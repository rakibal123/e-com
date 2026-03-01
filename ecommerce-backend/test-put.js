require('dotenv').config();
const axios = require('axios');
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';
async function test() {
  try {
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    const token = loginRes.data.token;

    // get products
    const prodRes = await axios.get(`${BASE_URL}/api/products`);
    const firstProduct = prodRes.data[0];

    // put
    console.log('putting product', firstProduct._id);
    const putRes = await axios.put(`${BASE_URL}/api/products/${firstProduct._id}`, {
      title: firstProduct.title + ' (Edited)',
      price: firstProduct.price,
      stock: firstProduct.stock,
      category: firstProduct.category,
      description: firstProduct.description
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', putRes.status);
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Network Error:', err.message);
    }
  }
}
test();
