const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate(
            'products.product',
            'title price image stock'
        );
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, products: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, products: [] });
        }

        const itemIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.products[itemIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update quantity
// @route   PUT /api/cart
// @access  Private
const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }

        const itemIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.products.splice(itemIndex, 1);
            } else {
                cart.products[itemIndex].quantity = quantity;
            }
            await cart.save();
            res.json(cart);
        } else {
            res.status(404);
            throw new Error('Product not in cart');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.id;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }

        cart.products = cart.products.filter(
            (p) => p.product.toString() !== productId
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
};
