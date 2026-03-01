require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Loaded' : 'Not Loaded');
// Connect to MongoDB
connectDB();

const premiumProducts = [
    {
        title: 'MacBook Pro 16" M3 Max',
        description: 'The ultimate pro notebook. Blazing-fast M3 Max chip, 128GB unified memory, and a stunning Liquid Retina XDR display.',
        price: 3499.00,
        stock: 15,
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise cancellation, crystal clear hands-free calling, and up to 30 hours of battery life.',
        price: 398.00,
        stock: 45,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'iPhone 15 Pro Max',
        description: 'Forged in titanium. Featuring the A17 Pro chip, customizable Action button, and a powerful new camera system.',
        price: 1199.00,
        stock: 25,
        category: 'Smartphones',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Samsung 49" Odyssey OLED G9',
        description: 'Dual QHD Curved Gaming Monitor with 240Hz refresh rate and 0.03ms response time (GtG).',
        price: 1599.99,
        stock: 8,
        category: 'Monitors',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'DJI Mini 4 Pro Drone',
        description: 'Under 249 g, Omnidirectional Active Obstacle Sensing, 4K/60fps HDR True Vertical Shooting.',
        price: 759.00,
        stock: 12,
        category: 'Drones',
        image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Keychron Q1 Pro Mechanical Keyboard',
        description: 'A fully customizable 75% layout custom mechanical keyboard with QMK/VIA support and CNC machined aluminum body.',
        price: 199.00,
        stock: 30,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Oura Ring Gen3',
        description: 'The revolutionary smart ring that accurately tracks sleep, activity, readiness, and heart rate.',
        price: 299.00,
        stock: 50,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1629853965578-838612ecece3?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Sonos Era 300 Smart Speaker',
        description: 'Next-level spatial audio speaker with Dolby Atmos, Bluetooth, and Wi-Fi streaming.',
        price: 449.00,
        stock: 20,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=1000'
    }
];

const importData = async () => {
    try {
        // Wipe existing products
        await Product.deleteMany();
        // Insert new products
        await Product.insertMany(premiumProducts);

        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with data import:', error);
        process.exit(1);
    }
};

importData();
