import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

export default function EditProductModal({ product, onClose, onSuccess }) {
    const [title, setTitle] = useState(product?.title || '');
    const [price, setPrice] = useState(product?.price || '');
    const [stock, setStock] = useState(product?.stock || '');
    const [category, setCategory] = useState(product?.category || '');
    const [description, setDescription] = useState(product?.description || '');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(getImageUrl(product?.image));
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(getImageUrl(product?.image));
        }
    }, [file, product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let imagePath = '';
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                const uploadRes = await api.post('/upload', formData);
                imagePath = uploadRes.data;
            }

            const payload = {
                title,
                price: Number(price),
                stock: Number(stock),
                category,
                description,
                ...(imagePath && { image: imagePath })
            };

            await api.put(`/products/${product._id}`, payload);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Product</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Price (৳)</label>
                                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                                <input type="number" value={stock} onChange={e => setStock(e.target.value)} required min="0" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="3" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Image <span className="text-gray-400 font-normal">(Leave blank to keep existing)</span></label>
                            {preview && (
                                <div className="mb-3 flex justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-2 bg-gray-50 dark:bg-gray-800">
                                    <img src={preview} alt="Preview" className="h-32 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                </div>
                            )}
                            <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none transition-all text-sm" />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md disabled:opacity-70">
                                {submitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
