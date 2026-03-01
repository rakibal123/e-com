const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCart).post(protect, addToCart).put(protect, updateCartQuantity);
router.route('/:id').delete(protect, removeFromCart);

module.exports = router;
