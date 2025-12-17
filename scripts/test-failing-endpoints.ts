import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testEndpoints() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@archmedics.com',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log('✓ Login successful');

        console.log('\nTesting GET /api/auth/profile');
        try {
            const profileRes = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✓ Profile Response:', profileRes.status);
        } catch (err: any) {
            console.log('✗ Profile Error:', err.response?.status);
            console.log('Error details:', err.response?.data);
        }

        console.log('\nTesting GET /api/transactions?search=');
        try {
            const transactionsRes = await axios.get(`${API_URL}/transactions`, {
                params: { search: '' },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✓ Transactions Response:', transactionsRes.status);
        } catch (err: any) {
            console.log('✗ Transactions Error:', err.response?.status);
            console.log('Error details:', err.response?.data);
        }

    } catch (error: any) {
        console.error('Fatal error:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

testEndpoints();
