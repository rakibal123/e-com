import { CreditCard, ShoppingBag } from 'lucide-react';

export default function OrderSummary({ cart, onCheckout, isCheckingOut = false, paymentMethod = 'bkash', isCartPage = false, disabled = false }) {
    const items = cart?.products || [];
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => {
        return acc + (item.product?.price || 0) * item.quantity;
    }, 0);

    const tax = subtotal * 0.05; // 5% tax example
    const total = subtotal + tax;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 sticky top-24 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 flex items-center gap-2 transition-colors">
                <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Order Summary
            </h3>

            <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors">
                    <span>Items ({totalItems})</span>
                    <span className="font-medium text-gray-900 dark:text-white">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">৳{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 transition-colors pt-3 flex justify-between font-bold text-lg mt-2 text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">৳{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                disabled={disabled || items.length === 0 || isCheckingOut}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
            >
                {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                        {(!isCartPage && paymentMethod === 'bkash') && <div className="font-black text-xl leading-none italic tracking-tighter mr-1 text-pink-300">b</div>}
                        {(isCartPage || paymentMethod === 'cod') && <CreditCard className="w-5 h-5" />}
                        {isCartPage ? 'Proceed to Checkout' : (paymentMethod === 'bkash' ? 'Pay with bKash' : 'Confirm Order')}
                    </>
                )}
            </button>

            {items.length > 0 && (
                <p className="text-xs text-gray-400 text-center mt-4 transition-colors">
                    {paymentMethod === 'bkash' ? 'Secure checkout powered by bKash Tokens.' : 'Safe and secure cash delivery.'}
                </p>
            )}
        </div>
    );
}
