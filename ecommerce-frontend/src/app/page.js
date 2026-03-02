'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { PackageSearch } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-white text-center shadow-lg transform transition-all hover:shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl rounded-3xl"></div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <PackageSearch className="w-16 h-16 opacity-90" />
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Discover Premium Tech
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-light">
                        Upgrade your lifestyle with our curated collection of high-end electronics, gadgets, and accessories.
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight relative">
                        Latest Arrivals
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                        <PackageSearch className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">No Premium Products Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Check back soon for our new collection!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
