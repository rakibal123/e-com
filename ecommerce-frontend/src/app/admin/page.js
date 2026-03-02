'use client';

import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch admin dashboard stats:', error.response?.status, error.config?.url, error.message);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40', link: '/admin/products' },
        { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/40', link: '/admin/orders' },
        { title: 'Total Customers', value: stats.users, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/40', link: '/admin/users' },
        { title: 'Revenue', value: `$${(stats.revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/40', link: '/admin/orders' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your store's performance</p>
                </div>
                <Link
                    href="/admin/add-product"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    + New Product
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    const cardContent = (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-all h-full cursor-pointer">
                            <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
                                <Icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</h3>
                            </div>
                        </div>
                    );

                    return card.link ? (
                        <Link key={idx} href={card.link} className="block transform transition-transform hover:-translate-y-1">
                            {cardContent}
                        </Link>
                    ) : (
                        <div key={idx} className="block transform transition-transform hover:-translate-y-1">
                            {cardContent}
                        </div>
                    );
                })}
            </div>

            <div className="bg-gray-50 dark:bg-black rounded-xl p-6 border border-gray-100 dark:border-gray-800 transition-colors">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Activity logs will appear here</p>
                </div>
            </div>
        </div>
    );
}
