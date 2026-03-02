'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, PlusCircle, Settings, ShieldAlert, Users } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.replace('/login');
        }
    }, [user, router]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 mt-4">
            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4 transition-colors">
                <div className="mb-6 px-4">
                    <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Admin Portal
                    </h2>
                </div>
                <nav className="space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/add-product"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Product
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                        <Users className="w-5 h-5" />
                        Users Status
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                        <Settings className="w-5 h-5" />
                        Store Settings
                    </Link>
                </nav>
            </aside>

            {/* Admin Content Area */}
            <main className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-6 transition-colors">
                {children}
            </main>
        </div>
    );
}
