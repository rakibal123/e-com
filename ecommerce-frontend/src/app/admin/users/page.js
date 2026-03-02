'use client';

import { useState, useEffect } from 'react';
import api from '../../../services/api';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/users');
                // Sort by lastLogin descending, or by createdAt descending if lastLogin is null
                setUsers(data.sort((a, b) => {
                    const dateA = a.lastLogin ? new Date(a.lastLogin) : new Date(a.createdAt);
                    const dateB = b.lastLogin ? new Date(b.lastLogin) : new Date(b.createdAt);
                    return dateB - dateA;
                }));
            } catch (error) {
                console.error('Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Users Tracking</h1>
                    <p className="text-gray-500 dark:text-gray-400">Monitor all registered users and their last login activity.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4">Last Logged In</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400'
                                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {user.lastLogin ? (
                                            <div className="flex flex-col">
                                                <span className="font-medium text-green-600 dark:text-green-400">
                                                    {new Date(user.lastLogin).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(user.lastLogin).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Never logged in</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                                        No users found in the system.
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
