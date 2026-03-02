'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User, LogOut, PackageSearch, LayoutDashboard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    const cartCount = cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600 transition-transform hover:scale-105">
                        <PackageSearch className="w-8 h-8" />
                        <span>StoreFront</span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <ThemeToggle />

                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors whitespace-nowrap">
                            Shop
                        </Link>

                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors whitespace-nowrap">
                                        <LayoutDashboard className="w-4 h-4" /> Admin
                                    </Link>
                                )}

                                {user.role !== 'admin' && (
                                    <>
                                        <Link href="/orders" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors whitespace-nowrap">
                                            My Orders
                                        </Link>
                                        <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                                            <ShoppingCart className="w-6 h-6" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </>
                                )}

                                <div className="flex items-center gap-2 sm:gap-4 border-l pl-3 sm:pl-4 border-gray-300">
                                    <Link href="/profile" className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
                                        <User className="w-5 h-5 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">{user.name}</span>
                                    </Link>
                                    <button onClick={logout} className="text-red-500 hover:text-red-700 transition-colors" title="Logout">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
