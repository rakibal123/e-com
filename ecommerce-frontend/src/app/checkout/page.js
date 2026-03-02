'use client';

import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import OrderSummary from '../../components/OrderSummary';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { ShieldCheck, MapPin, CreditCard, Banknote, CheckCircle, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function Checkout() {
    const { cart, clearLocalCart, fetchCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'bkash'
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [mobile1, setMobile1] = useState('');
    const [mobile2, setMobile2] = useState('');

    // Protect route
    useEffect(() => {
        if (!user) router.replace('/login');
        if (!showSuccessModal && cart?.products?.length === 0) router.replace('/cart');
    }, [user, cart, router, showSuccessModal]);

    const handlePayment = async () => {
        if (!shippingAddress.trim() || !mobile1.trim()) {
            setError('Please provide a valid shipping address and primary mobile number');
            return;
        }

        setIsCheckingOut(true);
        setError('');

        try {
            // 1. Calculate total from clean cart state
            const items = cart.products;
            const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
            const tax = subtotal * 0.05;
            const totalPrice = subtotal + tax;

            // 2. Map products to order schema format
            const orderProducts = items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));

            // 3. Create Order
            const orderRes = await api.post('/orders', {
                products: orderProducts,
                totalPrice: totalPrice,
                paymentMethod: paymentMethod === 'bkash' ? 'bKash' : 'Cash on Delivery',
                shippingAddress,
                mobile1,
                mobile2: mobile2 || undefined
            });

            const createdOrderId = orderRes.data._id;
            setOrderId(createdOrderId);

            if (paymentMethod === 'bkash') {
                // Init bKash Payment
                const paymentRes = await api.post('/payment/bkash/create', { orderId: createdOrderId });

                if (paymentRes.data && paymentRes.data.bkashURL) {
                    // Redirect to bKash portal
                    window.location.href = paymentRes.data.bkashURL;
                } else {
                    throw new Error('Invalid bKash configuration');
                }
            } else {
                // Handle Cash on Delivery
                clearLocalCart();
                fetchCart(); // Ensure server is synced
                setShowSuccessModal(true);
                setIsCheckingOut(false);
            }

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Payment intialization failed.');
            setIsCheckingOut(false);
        }
    };

    if (!user || (!showSuccessModal && cart?.products?.length === 0)) return null;

    if (showSuccessModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-gray-100 dark:border-gray-800 transform animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Order Confirmed!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Your Cash on Delivery order <span className="font-mono text-gray-700 dark:text-gray-300">#{orderId?.slice(-6).toUpperCase()}</span> has been successfully placed. We'll contact you shortly!
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link href="/orders" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-600/30">
                            View My Orders
                        </Link>
                        <Link href="/" className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 px-6 rounded-xl transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 transition-colors">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Secure Checkout</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Review your details and complete the purchase.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl font-medium border border-red-100 dark:border-red-900/50 transition-colors">
                    {error}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow space-y-6">

                    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-4">
                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Account Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Name</label>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">{user.name}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Email</label>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-4">
                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Shipping Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Delivery Address <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    rows="3"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter your street, house number, area, etc."
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary Mobile <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Smartphone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={mobile1}
                                            onChange={(e) => setMobile1(e.target.value)}
                                            placeholder="Ex: 017XXXXXXXX"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Secondary Mobile (Optional)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Smartphone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={mobile2}
                                            onChange={(e) => setMobile2(e.target.value)}
                                            placeholder="Ex: 019XXXXXXXX"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-4">
                            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Payment Method
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${paymentMethod === 'cod' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                        <Banknote className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className={`block font-bold ${paymentMethod === 'cod' ? 'text-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>Cash on Delivery</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive</span>
                                    </div>
                                </div>
                            </label>

                            <label className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                                <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="hidden" />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'bkash' ? 'border-blue-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {paymentMethod === 'bkash' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                                        {/* Stylized bKash mock icon */}
                                        <div className="font-black text-xl leading-none italic tracking-tighter">b</div>
                                    </div>
                                    <div>
                                        <span className={`block font-bold ${paymentMethod === 'bkash' ? 'text-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>Pay with bKash</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Secure digital portal</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                </div>

                <div className="lg:w-96 shrink-0">
                    <OrderSummary
                        cart={cart}
                        onCheckout={handlePayment}
                        isCheckingOut={isCheckingOut}
                        paymentMethod={paymentMethod}
                    />
                </div>
            </div>
        </div>
    );
}
