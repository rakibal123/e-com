const bkash = require('../utils/bkash');
const Order = require('../models/Order');

// @desc    Create bKash Payment
// @route   POST /api/payment/bkash/create
// @access  Private
const createBkashPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        const token = await bkash.getToken();

        const paymentDetails = {
            mode: '0011',
            payerReference: req.user._id.toString(),
            callbackURL: `${process.env.FRONTEND_URL}/api/payment/bkash/callback`,
            amount: order.totalPrice.toString(),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: order._id.toString(),
        };

        const paymentResponse = await bkash.createPayment(token, paymentDetails);

        if (paymentResponse && paymentResponse.statusCode === '0000') {
            res.json(paymentResponse);
        } else {
            res.status(400);
            throw new Error(paymentResponse.statusMessage || 'Payment creation failed');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Execute bKash Payment
// @route   POST /api/payment/bkash/execute
// @access  Private
const executeBkashPayment = async (req, res) => {
    try {
        const { paymentID, orderId } = req.body;

        const token = await bkash.getToken();
        const executeResponse = await bkash.executePayment(token, paymentID);

        if (executeResponse && executeResponse.statusCode === '0000') {
            const order = await Order.findById(orderId);

            if (order) {
                order.paymentStatus = 'Completed';
                order.transactionId = executeResponse.trxID;
                await order.save();
            }

            res.json(executeResponse);
        } else {
            res.status(400);
            throw new Error(executeResponse.statusMessage || 'Payment execution failed');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBkashPayment,
    executeBkashPayment,
};
