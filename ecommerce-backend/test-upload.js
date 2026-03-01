const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();
const UPLOAD_URL = process.env.UPLOAD_URL || 'http://localhost:5000/api/upload';

async function test() {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream('./uploads/sample.jpg'));

    console.log('uploading...');
    const res = await axios.post(UPLOAD_URL, form, {
      headers: form.getHeaders()
    });
    console.log('Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Network Error:', err.message);
    }
  }
}
test();
