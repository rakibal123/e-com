const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getAdminDashboardStats = async (req, res) => {
    try {
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();
        const usersCount = await User.countDocuments({ role: 'user' });

        const orders = await Order.find({ paymentStatus: 'Completed' });
        const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.json({
            products: productsCount,
            orders: ordersCount,
            users: usersCount,
            revenue: revenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

module.exports = {
    getAdminDashboardStats
};
