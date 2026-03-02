'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ products: [] });
    const [loadingCart, setLoadingCart] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchCart = async () => {
        if (!user) {
            setCart({ products: [] });
            setLoadingCart(false);
            return;
        }
        try {
            setLoadingCart(true);
            const { data } = await api.get('/cart');
            setCart(data);
        } catch (error) {
            console.error('Failed to fetch cart', error);
        } finally {
            setLoadingCart(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) return { success: false, message: 'Please login first' };
        try {
            const { data } = await api.post('/cart', { productId, quantity });
            // Re-fetch to populate refs (title, price, image)
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to add' };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            if (quantity <= 0) {
                return await removeFromCart(productId);
            }
            await api.put('/cart', { productId, quantity });
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Failed to update' };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await api.delete(`/cart/${productId}`);
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Failed to remove' };
        }
    };

    const clearLocalCart = () => {
        setCart({ products: [] });
    }

    return (
        <CartContext.Provider
            value={{ cart, loadingCart, addToCart, updateQuantity, removeFromCart, clearLocalCart, fetchCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
