import { Trash2, Plus, Minus } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Link from 'next/link';
import { getImageUrl } from '../utils/imageUrl';

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useContext(CartContext);
    const { product, quantity } = item;

    if (!product) return null;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors rounded-xl px-1 sm:px-2">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-grow min-w-0">
                <Link href={`/product/${product._id}`} className="shrink-0 relative overflow-hidden rounded-lg w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800">
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image" }}
                    />
                </Link>

                <div className="flex-grow min-w-0">
                    <Link href={`/product/${product._id}`}>
                        <h4 className="font-medium text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-lg">{product.title}</h4>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-2">৳{product.price.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors scale-90 sm:scale-100 origin-left">
                    <button
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        className="p-1 rounded bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-50"
                        disabled={quantity <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
                    <button
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        className="p-1 rounded bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-50"
                        disabled={quantity >= product.stock}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-20 sm:w-24 text-right font-semibold text-gray-900 dark:text-white shrink-0 text-sm sm:text-base">
                    ৳{(product.price * quantity).toLocaleString()}
                </div>

                <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all shrink-0 -mr-2 sm:mr-0"
                    title="Remove item"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
