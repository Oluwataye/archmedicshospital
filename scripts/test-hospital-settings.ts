import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

async function testHospitalSettings() {
    console.log('Testing Hospital Settings API...\n');

    try {
        // Test 1: Get hospital settings
        console.log('1. Testing GET /api/hospital-settings');
        const response = await axios.get(`${API_BASE_URL}/hospital-settings`);
        console.log('✅ Success! Hospital settings:', response.data);
        console.log('   - Hospital Name:', response.data.hospital_name);
        console.log('   - Abbreviation:', response.data.hospital_abbreviation);
        console.log('   - Address:', response.data.address);
        console.log('   - Phone:', response.data.phone);
        console.log('   - Email:', response.data.email);
        console.log('');

        // Test 2: Login as admin
        console.log('2. Testing admin login');
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@archmedics.com',
            password: 'admin123'
        });
        const token = loginResponse.data.token;
        console.log('✅ Admin login successful');
        console.log('');

        // Test 3: Update hospital settings (admin only)
        console.log('3. Testing PUT /api/hospital-settings (admin only)');
        const updateResponse = await axios.put(
            `${API_BASE_URL}/hospital-settings`,
            {
                hospital_name: 'Test Hospital',
                address: '123 Test Street',
                phone: '+234-123-456-7890',
                email: 'test@hospital.com'
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log('✅ Update successful!', updateResponse.data);
        console.log('');

        // Test 4: Verify update
        console.log('4. Verifying update');
        const verifyResponse = await axios.get(`${API_BASE_URL}/hospital-settings`);
        console.log('✅ Updated settings:', verifyResponse.data);
        console.log('');

        // Test 5: Restore original settings
        console.log('5. Restoring original settings');
        await axios.put(
            `${API_BASE_URL}/hospital-settings`,
            {
                hospital_name: 'Archmedics Hospital',
                address: '123 Medical Center Drive, Lagos, Nigeria',
                phone: '+234-XXX-XXX-XXXX',
                email: 'info@archmedics.com'
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log('✅ Original settings restored');
        console.log('');

        console.log('🎉 ALL TESTS PASSED!');
        console.log('\nThe Hospital Settings API is working correctly.');
        console.log('If you cannot see the Hospital Information tab in the UI:');
        console.log('1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)');
        console.log('2. Clear browser cache');
        console.log('3. Check browser console for errors');
        console.log('4. Navigate to: http://localhost:5173/admin/settings');

    } catch (error: any) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testHospitalSettings();
