require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

connectDB();

const createAdmin = async () => {
    try {
        const admins = [
            {
                name: 'Admin User 1',
                email: 'admin1@gmail.com',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'Admin User 2',
                email: 'admin2@gmail.com',
                password: '123456',
                role: 'admin'
            }
        ];

        // Delete existing admins to prevent duplicate email errors if running again
        await User.deleteMany({ role: 'admin' });

        for (const admin of admins) {
            await User.create(admin);
        }
        console.log('Admin users created successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
