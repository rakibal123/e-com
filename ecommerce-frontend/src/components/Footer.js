import { PackageSearch, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors duration-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
                            <PackageSearch className="w-8 h-8" />
                            <span className="font-bold text-xl text-gray-900 dark:text-white">StoreFront</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                            Your premium destination for high-end electronics, gadgets, and accessories. Elevate your tech lifestyle with our curated collections.
                        </p>
                        <div className="flex gap-4 text-gray-400 dark:text-gray-500">
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-pink-600 dark:hover:text-pink-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-red-600 dark:hover:text-red-500 transition-colors"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><Link href="/cart" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shop</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Service</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</Link></li>
                            <li><Link href="/orders" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Track Order</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shipping Info</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>123 Tech Avenue, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>support@storefront.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} StoreFront. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-500">
                        <Link href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
