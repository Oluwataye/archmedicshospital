
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
let authToken = '';

async function login() {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'pharmacist@archmedics.com',
            password: 'pharm123'
        });
        authToken = response.data.token;
        console.log('✅ Login successful');
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

async function testInventoryItems() {
    try {
        const response = await axios.get(`${API_URL}/inventory/items`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✅ Fetched ${response.data.length} inventory items`);

        if (response.data.length > 0) {
            const item = response.data[0];
            console.log('   Sample Item:', {
                name: item.name,
                stock: item.current_stock,
                supplier: item.supplier_name
            });
        }
    } catch (error) {
        console.error('❌ Failed to fetch inventory items:', error.response?.data || error.message);
    }
}

async function testStockAlerts() {
    try {
        const response = await axios.get(`${API_URL}/inventory/alerts`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Fetched stock alerts');
        console.log(`   Low Stock Items: ${response.data.lowStock.length}`);
        console.log(`   Expiring Batches: ${response.data.expiringBatches.length}`);
    } catch (error) {
        console.error('❌ Failed to fetch stock alerts:', error.response?.data || error.message);
    }
}

async function runTests() {
    console.log('Starting Inventory API Tests...');
    await login();
    await testInventoryItems();
    await testStockAlerts();
    console.log('Tests completed.');
}

runTests();
