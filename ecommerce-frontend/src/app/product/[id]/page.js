'use client';

import { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../services/api';
import { CartContext } from '../../../context/CartContext';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '../../../utils/imageUrl';

export default function ProductDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                setError('Product not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setIsAdding(true);
        const res = await addToCart(product._id, 1);
        if (!res.success) {
            alert(res.message);
        }
        setIsAdding(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">{error}</h3>
                <button onClick={() => router.back()} className="text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center gap-2 mx-auto hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 font-medium">
                <ArrowLeft className="w-5 h-5" /> Back to Store
            </Link>

            <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row gap-8 lg:gap-16 p-6 md:p-10 transition-colors">

                {/* Product Image */}
                <div className="w-full md:w-1/2 lg:w-[45%] rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800 relative group transition-colors">
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.title}
                        className="w-full aspect-square object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x600?text=No+Image" }}
                    />
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 flex flex-col justify-center gap-6">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 transition-colors">
                            {product.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">
                            {product.title}
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-6">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-end gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 transition-colors">
                        <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                            ৳{product.price.toLocaleString()}
                        </span>
                        {product.stock > 0 ? (
                            <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold px-3 py-1 rounded-md mb-2 transition-colors">
                                In Stock ({product.stock})
                            </span>
                        ) : (
                            <span className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold px-3 py-1 rounded-md mb-2 transition-colors">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0 || isAdding}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-600/50 hover:-translate-y-1 transform active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isAdding ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <ShoppingCart className="w-6 h-6" />
                                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Perks */}
                    <div className="grid grid-cols-2 gap-4 pt-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors"><ShieldCheck className="w-5 h-5 text-gray-700 dark:text-gray-300" /></div>
                            Premium Quality
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors"><Truck className="w-5 h-5 text-gray-700 dark:text-gray-300" /></div>
                            Fast Delivery
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
