const axios = require('axios');

const getToken = async () => {
    try {
        const { data } = await axios.post(
            `${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`,
            {
                app_key: process.env.BKASH_APP_KEY,
                app_secret: process.env.BKASH_APP_SECRET,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    username: process.env.BKASH_USERNAME,
                    password: process.env.BKASH_PASSWORD,
                },
            }
        );

        return data.id_token;
    } catch (error) {
        console.error('Error getting bKash token:', error.response?.data || error.message);
        throw new Error('Failed to grant bKash token');
    }
};

const createPayment = async (token, paymentDetails) => {
    try {
        const { data } = await axios.post(
            `${process.env.BKASH_BASE_URL}/tokenized/checkout/create`,
            paymentDetails,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'X-APP-Key': process.env.BKASH_APP_KEY,
                },
            }
        );

        return data;
    } catch (error) {
        console.error('Error creating bKash payment:', error.response?.data || error.message);
        throw new Error('Failed to create bKash payment');
    }
};

const executePayment = async (token, paymentID) => {
    try {
        const { data } = await axios.post(
            `${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`,
            { paymentID },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'X-APP-Key': process.env.BKASH_APP_KEY,
                },
            }
        );

        return data;
    } catch (error) {
        console.error('Error executing bKash payment:', error.response?.data || error.message);
        throw new Error('Failed to execute bKash payment');
    }
};

module.exports = {
    getToken,
    createPayment,
    executePayment,
};
