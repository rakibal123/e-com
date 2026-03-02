'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/my');
                // Sort newest first
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                    <Package className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Order History</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track and review your past purchases.</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                    <p className="text-xl text-gray-400 dark:text-gray-500 font-medium mb-4">No orders found.</p>
                    <a href="/" className="text-blue-600 font-bold hover:underline">Start Shopping</a>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all">
                            <div className="bg-gray-50 dark:bg-black px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 dark:border-gray-800 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-gray-900 dark:text-white font-medium text-sm md:text-base break-words">#{order._id}</p>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-gray-900 dark:text-white font-medium whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                        <p className="text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">
                                            ৳{order.totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                            order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {order.orderStatus === 'Delivered' && <CheckCircle2 className="w-4 h-4" />}
                                            {order.orderStatus === 'Processing' && <Clock className="w-4 h-4" />}
                                            {order.orderStatus === 'Cancelled' && <XCircle className="w-4 h-4" />}
                                            {order.orderStatus}
                                        </span>

                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${order.paymentStatus === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            Payment: {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800 pb-2">Items</h4>
                                    {order.products.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-xl border border-transparent dark:border-gray-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                                                    <Package className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{item.product?.title || 'Unknown Product'}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                ৳{((item.product?.price || 0) * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
