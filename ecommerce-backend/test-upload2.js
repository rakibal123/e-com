require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const UPLOAD_URL = process.env.UPLOAD_URL || 'http://localhost:5000/api/upload';

async function test() {
  try {
    const form = new FormData();
    // make sure file exists and boundary is auto-handled by getHeaders()
    const filePath = path.join(__dirname, 'uploads', 'image-1772006646610.jpg');
    form.append('image', fs.createReadStream(filePath));

    console.log('uploading from', filePath);
    const res = await axios.post(UPLOAD_URL, form, {
      headers: { ...form.getHeaders() }
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
