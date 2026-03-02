'use client';

import { useEffect, useState, useContext, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../../../../services/api';
import { CartContext } from '../../../../../context/CartContext';
import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

function CallbackContent() {
    const searchParams = useSearchParams();
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const { fetchCart } = useContext(CartContext);

    useEffect(() => {
        const executePayment = async () => {
            if (status === 'success' && paymentID) {
                try {
                    // In a real flow, you'd pass the orderId saved in session/local storage or retrieved via paymentID
                    // Since bKash sandbox callback doesn't return merchantInvoiceNumber directly,
                    // we are assuming the execution API checks the backend mapping.

                    // Note: for this implementation to perfectly match the backend, we need the Order ID.
                    // Since backend `executeBkashPayment` expects `orderId`, we must pull it from localStorage
                    const pendingOrderId = localStorage.getItem('pendingOrderId'); // Needs to be set in checkout.js

                    const res = await api.post('/payment/bkash/execute', {
                        paymentID,
                        orderId: pendingOrderId // Assuming you modify checkout page to store this
                    });

                    setSuccess(true);
                    setMessage(`Payment successful! TrxID: ${res.data.trxID}`);
                    await api.delete('/cart/clear'); // Example endpoint to clear cart if you had one
                    await fetchCart(); // Re-sync empty cart

                } catch (error) {
                    setSuccess(false);
                    setMessage(error.response?.data?.message || 'Failed to execute payment. Ensure sandbox credentials are valid.');
                }
            } else {
                setSuccess(false);
                setMessage(`Payment mapping failed or cancelled. Status: ${status}`);
            }
            setLoading(false);
        };

        executePayment();
    }, [paymentID, status]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Verifying Payment Status with bKash...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full">
                {success ? (
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                ) : (
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                )}

                <h2 className={`text-3xl font-extrabold mb-4 tracking-tight ${success ? 'text-gray-900' : 'text-red-600'}`}>
                    {success ? 'Payment Successful!' : 'Payment Failed'}
                </h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-center gap-4">
                    <Link href="/orders" className="bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors shadow-sm">
                        View Orders
                    </Link>
                    <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function BkashCallback() {
    return (
        <Suspense fallback={<div className="text-center py-20">Loading Callback...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
