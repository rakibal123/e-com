const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { products, totalPrice, shippingAddress, mobile1, mobile2, paymentMethod } = req.body;

        if (products && products.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            const order = new Order({
                products,
                user: req.user._id,
                totalPrice,
                shippingAddress,
                mobile1,
                mobile2,
                paymentMethod,
            });

            const createdOrder = await order.save();

            // Clear the user's cart from the database automatically upon order
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { products: [] }
            );

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error("ORDER CREATION ERROR: ", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate(
            'products.product',
            'title price'
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.status || order.orderStatus;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrders,
    updateOrderStatus,
};
