'use client';

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { RefreshCw } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders');
            setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            await fetchOrders();
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="p-8">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400">View customer purchases and update shipping statuses.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status & Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-semibold text-gray-600 dark:text-gray-400 block w-24 truncate" title={order._id}>
                                            {order._id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">{order.user?.name || 'Deleted User'}</p>
                                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                                        ৳{order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                disabled={updatingId === order._id}
                                                className={`text-sm font-medium px-3 py-1.5 rounded-lg border outline-none transition-colors ${order.orderStatus === 'Delivered' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 focus:border-green-500' :
                                                    order.orderStatus === 'Cancelled' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 focus:border-red-500' :
                                                        'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 focus:border-amber-500'
                                                    } disabled:opacity-50 appearance-none cursor-pointer`}
                                            >
                                                <option value="Processing" className="text-black bg-white dark:text-white dark:bg-gray-800">Processing</option>
                                                <option value="Shipped" className="text-black bg-white dark:text-white dark:bg-gray-800">Shipped</option>
                                                <option value="Delivered" className="text-black bg-white dark:text-white dark:bg-gray-800">Delivered</option>
                                                <option value="Cancelled" className="text-black bg-white dark:text-white dark:bg-gray-800">Cancelled</option>
                                            </select>
                                            {updatingId === order._id && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-medium">
                                        No orders found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
