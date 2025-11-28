import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

import { spawn } from 'child_process';

const API_URL = 'http://localhost:3001/api';
let authToken = '';
let hmoProviderId = '';
let packageId = '';
let tariffId = '';
let serviceCodeId = '';
let serverProcess: any;

async function startServer() {
    console.log('Starting server...');
    return new Promise<void>((resolve, reject) => {
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

async function login() {
    try {
        console.log('1. Logging in as admin...');
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@archmedics.com',
            password: 'admin123'
        });
        authToken = response.data.token;
        console.log('✅ Login successful');
    } catch (error: any) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

async function getHMOProvider() {
    try {
        console.log('\n2. Fetching HMO Provider...');
        const response = await axios.get(`${API_URL}/hmo/providers`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        if (response.data.length > 0) {
            hmoProviderId = response.data[0].id;
            console.log(`✅ Found provider: ${response.data[0].name} (${hmoProviderId})`);
        } else {
            console.error('❌ No HMO providers found. Please seed data first.');
            process.exit(1);
        }
    } catch (error: any) {
        console.error('❌ Failed to fetch providers:', error.response?.data || error.message);
        process.exit(1);
    }
}

async function getServiceCode() {
    try {
        console.log('\n3. Fetching a Service Code...');
        const response = await axios.get(`${API_URL}/nhis/service-codes`, {
            headers: { Authorization: `Bearer ${authToken}` },
            params: { search: 'malaria' }
        });
        if (response.data.length > 0) {
            serviceCodeId = response.data[0].id;
            console.log(`✅ Found service code: ${response.data[0].code} (${serviceCodeId})`);
        } else {
            console.error('❌ No service codes found. Please seed data first.');
            process.exit(1);
        }
    } catch (error: any) {
        console.error('❌ Failed to fetch service codes:', error.response?.data || error.message);
        process.exit(1);
    }
}

async function testPackages() {
    console.log('\n4. Testing Service Packages...');

    // Create Package
    try {
        console.log('   Creating package...');
        const response = await axios.post(`${API_URL}/hmo/packages`, {
            hmo_provider_id: hmoProviderId,
            package_name: 'Test Gold Plan',
            package_code: 'TGP-001',
            annual_limit: 500000,
            copay_percentage: 10,
            services_covered: ['CON-001', 'LAB-001'],
            exclusions: ['COS-001']
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        packageId = response.data.id;
        console.log('   ✅ Package created:', response.data.package_name);
    } catch (error: any) {
        console.error('   ❌ Failed to create package:', error.response?.data || error.message);
    }

    // Update Package
    try {
        console.log('   Updating package...');
        const response = await axios.put(`${API_URL}/hmo/packages/${packageId}`, {
            package_name: 'Test Gold Plan Updated',
            annual_limit: 600000
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('   ✅ Package updated:', response.data.package_name);
    } catch (error: any) {
        console.error('   ❌ Failed to update package:', error.response?.data || error.message);
    }

    // Get Packages for Provider
    try {
        console.log('   Fetching packages for provider...');
        const response = await axios.get(`${API_URL}/hmo/providers/${hmoProviderId}/packages`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Fetched ${response.data.length} packages`);
    } catch (error: any) {
        console.error('   ❌ Failed to fetch packages:', error.response?.data || error.message);
    }
}

async function testTariffs() {
    console.log('\n5. Testing Tariffs...');

    // Create Tariff
    try {
        console.log('   Creating tariff...');
        const response = await axios.post(`${API_URL}/hmo/tariffs`, {
            hmo_provider_id: hmoProviderId,
            service_code_id: serviceCodeId,
            tariff_amount: 5000,
            copay_amount: 500,
            effective_from: new Date().toISOString().split('T')[0]
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        tariffId = response.data.id;
        console.log('   ✅ Tariff created for service:', response.data.service_code_id);
    } catch (error: any) {
        console.error('   ❌ Failed to create tariff:', error.response?.data || error.message);
    }

    // Update Tariff
    try {
        console.log('   Updating tariff...');
        const response = await axios.put(`${API_URL}/hmo/tariffs/${tariffId}`, {
            tariff_amount: 5500
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('   ✅ Tariff updated amount:', response.data.tariff_amount);
    } catch (error: any) {
        console.error('   ❌ Failed to update tariff:', error.response?.data || error.message);
    }

    // Get Tariffs for Provider
    try {
        console.log('   Fetching tariffs for provider...');
        const response = await axios.get(`${API_URL}/hmo/providers/${hmoProviderId}/tariffs`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`   ✅ Fetched ${response.data.length} tariffs`);
    } catch (error: any) {
        console.error('   ❌ Failed to fetch tariffs:', error.response?.data || error.message);
    }
}

async function cleanup() {
    console.log('\n6. Cleaning up...');

    // Delete Tariff
    if (tariffId) {
        try {
            await axios.delete(`${API_URL}/hmo/tariffs/${tariffId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('   ✅ Tariff deleted');
        } catch (error: any) {
            console.error('   ❌ Failed to delete tariff:', error.response?.data || error.message);
        }
    }

    // Delete Package
    if (packageId) {
        try {
            await axios.delete(`${API_URL}/hmo/packages/${packageId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('   ✅ Package deleted');
        } catch (error: any) {
            console.error('   ❌ Failed to delete package:', error.response?.data || error.message);
        }
    }
}

async function run() {
    try {
        await startServer();
        await login();
        await getHMOProvider();
        await getServiceCode();
        await testPackages();
        await testTariffs();
        await cleanup();
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        if (serverProcess) {
            console.log('\nStopping server...');
            spawn("taskkill", ["/pid", serverProcess.pid, '/f', '/t']);
        }
        process.exit(0);
    }
}

run();
