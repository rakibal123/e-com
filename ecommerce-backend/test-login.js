require('dotenv').config();
const axios = require('axios');
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';
async function run() {
    try {
        const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const res = await axios.put(`${BASE_URL}/api/users/profile`, {
            name: 'Admin User 2 Changed',
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Success:", res.data);
    } catch (e) {
        if (e.response && e.response.status === 401) {
            const loginRes2 = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: 'admin@example.com',
                password: 'admin'
            });
            const token = loginRes2.data.token;
            const res = await axios.put(`${BASE_URL}/api/users/profile`, {
                name: 'Admin User 2 Changed',
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Success:", res.data);
        } else {
            console.log("Error:", e.response ? e.response.data : e.message);
        }
    }
}
run();
