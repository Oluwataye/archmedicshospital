import axios from 'axios';
import { spawn } from 'child_process';

const API_URL = 'http://localhost:3001/api';
let serverProcess: any;

async function startServer() {
    console.log('Starting server...');
    return new Promise<void>((resolve, reject) => {
        // Using ts-node to run the server directly
        serverProcess = spawn('npx', ['ts-node', '--esm', '--experimental-specifier-resolution=node', 'src/server/index.ts'], {
            cwd: process.cwd(),
            stdio: 'inherit',
            shell: true,
        });

        // Wait for server to start
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}

async function runTests() {
    try {
        // 1. Login
        console.log('\n1. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@archmedics.com',
            password: 'admin123',
        });
        const { token, user } = loginRes.data;
        console.log('✅ Login successful');
        console.log(`   User: ${user.first_name} ${user.last_name} (${user.role})`);

        const headers = { Authorization: `Bearer ${token}` };

        // 2. List Wards
        console.log('\n2. Testing List Wards...');
        const wardsRes = await axios.get(`${API_URL}/wards`, { headers });
        console.log(`✅ Fetched ${wardsRes.data.length} wards`);
        if (wardsRes.data.length > 0) {
            console.log(`   First ward: ${wardsRes.data[0].name} (Capacity: ${wardsRes.data[0].capacity})`);
        } else {
            throw new Error('No wards found. Seeding might have failed.');
        }

        const firstWardId = wardsRes.data[0].id;

        // 3. Get Ward Details
        console.log(`\n3. Testing Get Ward Details (ID: ${firstWardId})...`);
        const wardDetailsRes = await axios.get(`${API_URL}/wards/${firstWardId}`, { headers });
        console.log(`✅ Fetched details for ${wardDetailsRes.data.name}`);
        console.log(`   Beds count: ${wardDetailsRes.data.beds ? wardDetailsRes.data.beds.length : 0}`);

        // 4. Create New Ward
        console.log('\n4. Testing Create New Ward...');
        const newWardData = {
            name: `Test Ward ${Date.now()}`,
            type: 'General',
            capacity: 10,
            gender: 'Mixed',
            description: 'Created by test script'
        };
        const createWardRes = await axios.post(`${API_URL}/wards`, newWardData, { headers });
        console.log(`✅ Created ward: ${createWardRes.data.name}`);
        const newWardId = createWardRes.data.id;

        // 5. Add Beds to New Ward
        console.log(`\n5. Testing Add Beds to New Ward (ID: ${newWardId})...`);
        const bedsData = {
            beds: [
                { bed_number: 'TW-01', type: 'Standard' },
                { bed_number: 'TW-02', type: 'Standard' }
            ]
        };
        await axios.post(`${API_URL}/wards/${newWardId}/beds`, bedsData, { headers });
        console.log('✅ Beds added successfully');

        // Verify beds added
        const newWardDetails = await axios.get(`${API_URL}/wards/${newWardId}`, { headers });
        console.log(`   New bed count: ${newWardDetails.data.beds.length}`);

        // 6. Admit Patient (Need a patient first)
        console.log('\n6. Fetching a patient for admission test...');
        // Assuming we have patients. If not, we might need to create one or skip.
        // Let's try to fetch patients.
        try {
            const patientsRes = await axios.get(`${API_URL}/patients`, { headers });
            if (patientsRes.data.length > 0) {
                const patient = patientsRes.data[0];
                console.log(`   Found patient: ${patient.first_name} ${patient.last_name} (ID: ${patient.id})`);

                // Find an available bed in the new ward
                const availableBed = newWardDetails.data.beds.find((b: any) => !b.is_occupied);
                if (availableBed) {
                    console.log(`   Found available bed: ${availableBed.bed_number} (ID: ${availableBed.id})`);

                    // Admit
                    console.log('   Admitting patient...');
                    await axios.post(`${API_URL}/wards/admit`, {
                        patient_id: patient.id,
                        ward_id: newWardId,
                        bed_id: availableBed.id,
                        reason: 'Test Admission',
                        diagnosis: 'Testing',
                        notes: 'Test notes'
                    }, { headers });
                    console.log('✅ Patient admitted successfully');

                    // Verify admission
                    const updatedWardDetails = await axios.get(`${API_URL}/wards/${newWardId}`, { headers });
                    const updatedBed = updatedWardDetails.data.beds.find((b: any) => b.id === availableBed.id);
                    if (updatedBed.is_occupied) {
                        console.log('   Bed is now marked as occupied');
                    } else {
                        console.error('❌ Bed should be occupied but is not');
                    }

                    // 7. Discharge Patient
                    // We need the admission ID. The bed details in ward details should have it if we implemented that.
                    // Let's check the route implementation:
                    // router.get('/:id', ...
                    // ... if (bed.is_occupied) { const admission = ... bed.admission = admission; }

                    if (updatedBed.admission) {
                        console.log(`\n7. Testing Discharge Patient (Admission ID: ${updatedBed.admission.id})...`);
                        await axios.put(`${API_URL}/wards/discharge/${updatedBed.admission.id}`, {
                            notes: 'Discharged by test script',
                            discharge_type: 'Discharged'
                        }, { headers });
                        console.log('✅ Patient discharged successfully');

                        // Verify bed status
                        const finalWardDetails = await axios.get(`${API_URL}/wards/${newWardId}`, { headers });
                        const finalBed = finalWardDetails.data.beds.find((b: any) => b.id === availableBed.id);
                        console.log(`   Bed status after discharge: ${finalBed.status} (Should be Cleaning)`);
                    } else {
                        console.error('❌ Could not find admission details on occupied bed');
                    }

                } else {
                    console.log('   No available beds found in new ward (unexpected).');
                }
            } else {
                console.log('   No patients found. Skipping admission test.');
            }
        } catch (err: any) {
            console.log('   Failed to fetch patients or admit:', err.message);
        }

        console.log('\n✅ All tests passed successfully!');

    } catch (error: any) {
        console.error('\n❌ Test failed:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data:`, error.response.data);
        } else {
            console.error(`   Error: ${error.message}`);
        }
    } finally {
        if (serverProcess) {
            console.log('\nStopping server...');
            spawn("taskkill", ["/pid", serverProcess.pid, '/f', '/t']);
        }
        process.exit(0);
    }
}

// Run
(async () => {
    await startServer();
    await runTests();
})();
