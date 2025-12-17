
import axios from 'axios';
import { login } from './test-utils'; // Assuming reuse, or I'll implement login inline

const API_URL = 'http://localhost:3001/api';

async function testSearch() {
    try {
        console.log('Logging in...');
        // Login as cashier or admin
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@archmedics.com', // Try email as username might fail if auth route changed
            password: 'admin123'
        }).catch(async () => {
            // Fallback to username
            console.log('Email login failed, trying username...');
            return await axios.post(`${API_URL}/auth/login`, {
                username: 'admin',
                password: 'admin123'
            });
        });

        const token = loginRes.data.token;
        console.log('Logged in. Token obtained.');

        console.log('Testing GET /api/payments?status=pending');
        try {
            const paymentsRes = await axios.get(`${API_URL}/payments`, {
                params: { status: 'pending' },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Payments Response:', paymentsRes.status);
        } catch (err: any) {
            console.log('Payments Error:', err.response?.status, err.response?.data);
        }

        console.log('Testing GET /api/refunds?status=pending');
        try {
            const refundsRes = await axios.get(`${API_URL}/refunds`, {
                params: { status: 'pending' },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Refunds Response:', refundsRes.status);
        } catch (err: any) {
            console.log('Refunds Error:', err.response?.status, err.response?.data);
        }

    } catch (error: any) {
        console.error('Login/General Error:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

testSearch();
