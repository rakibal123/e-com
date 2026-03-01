const express = require('express');
const router = express.Router();
const {
    createBkashPayment,
    executeBkashPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createBkashPayment);
router.post('/execute', protect, executeBkashPayment);

module.exports = router;
