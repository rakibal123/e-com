'use client';

import { useState } from 'react';
import api from '../../../services/api';
import { useRouter } from 'next/navigation';
import { Upload, Plus } from 'lucide-react';

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        brand: '',
        stock: '',
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const imageData = new FormData();
        imageData.append('image', file);

        // Show instant preview using createObjectURL
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await api.post('/upload', imageData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setImage(data);
            setUploading(false);
        } catch (err) {
            console.error(err);
            setError('Image upload failed');
            setPreview(null);
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading || uploading) return;

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await api.post('/products', {
                ...formData,
                image: image || '/uploads/sample.jpg',
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Product added successfully!');
            setTimeout(() => {
                router.push('/admin');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product');
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Create a new product listing in your store</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm font-medium">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 text-sm font-medium">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-black p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            placeholder="e.g., iPhone 15 Pro"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            required
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            placeholder="e.g., Apple"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <input
                            type="text"
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            placeholder="e.g., Electronics"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            placeholder="999.99"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Count in Stock</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            placeholder="50"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-900 relative overflow-hidden group">
                            {preview ? (
                                <div className="relative w-full h-48 flex justify-center items-center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Change Image
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 items-center justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </div>
                        {uploading && <p className="text-sm text-blue-500 mt-2">Uploading image...</p>}
                        {image && <p className="text-sm text-green-500 mt-2 font-medium">Image uploaded: {image}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Description</label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                            placeholder="Enter detailed product description..."
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800 mt-6">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <Plus className="w-5 h-5" /> Add Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
