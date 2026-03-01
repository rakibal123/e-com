const axios = require('axios');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function test() {
    try {
        const token = jwt.sign({ id: '67b9dcca591b61bdc0a72ad9' }, process.env.JWT_SECRET);
        const res = await axios.put(`${BASE_URL}/api/users/profile`, {
            name: 'Admin User 2',
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Success:", res.data);
    } catch (e) {
        console.log("Error:", e.response ? e.response.data : e.message);
    }
}
test();
