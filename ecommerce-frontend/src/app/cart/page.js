'use client';

import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import CartItem from '../../components/CartItem';
import OrderSummary from '../../components/OrderSummary';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Cart() {
    const { cart, loadingCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const router = useRouter();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 max-w-md w-full transition-colors">
                    <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please log in</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">You need to log in to view your shopping cart.</p>
                    <Link href="/login" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors w-full block shadow-lg shadow-blue-600/30">
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    if (loadingCart) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const items = cart?.products || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
                    <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Your Cart</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                    <p className="text-xl text-gray-400 dark:text-gray-500 font-medium mb-6">Your cart is empty.</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-1">
                        Start Shopping <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    <div className="flex-grow bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="space-y-0 sm:space-y-2">
                            {items.map((item) => (
                                <CartItem key={item.product._id} item={item} />
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-right">
                            <Link href="/" className="text-blue-600 font-medium hover:underline text-sm">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-96 shrink-0">
                        <OrderSummary
                            cart={cart}
                            onCheckout={() => router.push('/checkout')}
                            isCartPage={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
