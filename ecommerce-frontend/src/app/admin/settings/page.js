'use client';

import { Settings2 } from 'lucide-react';

export default function AdminSettings() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400">Configure your global store preferences.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                <div className="inline-flex items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full mb-6 relative">
                    <Settings2 className="w-16 h-16 animate-spin-slow" style={{ animationDuration: '4s' }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    The store configurations feature is currently under final development and will be available in the next major update.
                </p>
                <div className="mt-8">
                    <button disabled className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-semibold cursor-not-allowed">
                        Configuration Locked
                    </button>
                </div>
            </div>
        </div>
    );
}
