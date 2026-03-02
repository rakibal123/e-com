import Link from 'next/link';
import { ShoppingCart, Edit } from 'lucide-react';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import EditProductModal from './EditProductModal';
import { getImageUrl } from '../utils/imageUrl';

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault(); // Prevent navigating to product details if clicked here
        setIsAdding(true);
        await addToCart(product._id, 1);
        setIsAdding(false);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setIsEditingModalOpen(true);
    };

    return (
        <>
            <Link href={`/product/${product._id}`} className="group block h-full">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col relative">
                    {/* Image Container with fixed aspect ratio */}
                    <div className="relative pt-[100%] bg-gray-50 dark:bg-gray-800 overflow-hidden">
                        <img
                            src={getImageUrl(product.image)}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getImageUrl('/uploads/sample.jpg'); }}
                        />
                        {product.stock <= 0 && (
                            <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md backdrop-blur-sm">
                                Out of Stock
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-5 flex flex-col flex-grow">
                        <div className="text-[10px] sm:text-xs font-medium text-blue-600 mb-1 sm:mb-2 tracking-wide uppercase">{product.category}</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                            {product.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-4 flex-grow">
                            {product.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto border-t border-gray-100 dark:border-gray-800 pt-3 sm:pt-4">
                            <span className="font-bold text-base sm:text-xl text-gray-900 dark:text-white">
                                ৳{product.price.toLocaleString()}
                            </span>

                            {user?.role === 'admin' ? (
                                <button
                                    onClick={handleEdit}
                                    className="p-1.5 sm:p-2 rounded-full transition-all bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white hover:shadow-lg"
                                    title="Edit Product"
                                >
                                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleAdd}
                                    disabled={product.stock <= 0 || isAdding}
                                    className={`p-1.5 sm:p-2 rounded-full transition-all ${product.stock <= 0
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-lg'
                                        }`}
                                    title="Add to Cart"
                                >
                                    {isAdding ? (
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {
                isEditingModalOpen && (
                    <EditProductModal
                        product={product}
                        onClose={() => setIsEditingModalOpen(false)}
                        onSuccess={() => window.location.reload()}
                    />
                )
            }
        </>
    );
}
