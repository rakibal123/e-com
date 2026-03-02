'use client';

import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, ShieldAlert, Phone, MapPin, Calendar, Camera, Edit2, Save, X, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';

export default function Profile() {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        profilePicture: ''
    });

    useEffect(() => {
        if (!user) {
            router.replace('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setFormData({
                    name: data.name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    dateOfBirth: data.dateOfBirth || '',
                    profilePicture: data.profilePicture || ''
                });
            } catch (error) {
                console.error('Failed to fetch profile data');
            }
        };

        fetchProfile();
    }, [user, router]);

    if (!user) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setIsUploading(true);
            const { data } = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, profilePicture: data }));
        } catch (error) {
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.put('/users/profile', formData);
            alert('Profile updated successfully!');
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const profileImageUrl = getImageUrl(formData.profilePicture);

    const renderField = (icon, label, name, type = 'text') => {
        const value = formData[name];

        if (isEditing) {
            return (
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {icon} {label}
                    </label>
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                </div>
            );
        }

        return (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-sm transition-shadow">
                <p className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    {icon} {label}
                </p>
                {value ? (
                    <p className="text-gray-900 dark:text-gray-200 font-medium whitespace-pre-line">{value}</p>
                ) : (
                    <p className="text-gray-400 dark:text-gray-600 italic">Not provided yet.</p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Your Profile</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and preferences.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 text-gray-700 dark:text-gray-300 font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    )}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition-colors"
                        title="Close and go back"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-100 dark:border-gray-800 p-8 sm:p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>

                <div className="relative z-10">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Header Section: Avatar & Basic Info */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                            <div className="relative group shrink-0">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-5xl font-extrabold text-white shadow-xl shadow-blue-600/20 border-4 border-white dark:border-gray-800 relative">
                                    {profileImageUrl ? (
                                        <img src={profileImageUrl} alt="Profile" className="absolute inset-0 w-full h-full object-cover rounded-full" />
                                    ) : (
                                        formData.name ? formData.name.charAt(0).toUpperCase() : user.name.charAt(0).toUpperCase()
                                    )}
                                </div>

                                {isEditing && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="absolute -bottom-3 -right-3 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:scale-105 transition-all disabled:opacity-50 z-20"
                                        >
                                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </>
                                )}
                            </div>

                            <div className="flex-1 text-center sm:text-left pt-2">
                                {isEditing ? (
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1.5">FULL NAME</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full text-xl font-bold text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{formData.name || user.name}</h2>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 dark:text-gray-400 mt-2 font-medium">
                                            <Mail className="w-4 h-4 text-blue-500" /> {user.email}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Detailed Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                            {renderField(<Phone className="w-4 h-4 text-emerald-500" />, "Phone Number", "phone")}
                            {renderField(<MapPin className="w-4 h-4 text-rose-500" />, "Address", "address")}

                            <div className="md:col-span-2">
                                {renderField(<Calendar className="w-4 h-4 text-amber-500" />, "Date of Birth", "dateOfBirth", "date")}
                            </div>
                        </div>

                        {/* System Info (Read Only) */}
                        {!isEditing && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4 bg-orange-50/50 dark:bg-orange-900/10 p-5 rounded-2xl border border-orange-100/50 dark:border-orange-500/10">
                                    <div className="p-3 bg-white dark:bg-orange-900/30 rounded-xl shadow-sm border border-orange-100 dark:border-orange-800/50">
                                        <ShieldAlert className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Account Role</p>
                                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/30 p-5 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Account ID</p>
                                        <p className="text-gray-900 dark:text-gray-300 font-mono text-sm mt-1 truncate">{user._id}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || isUploading}
                                        className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-3 px-8 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30 ml-auto"
                                >
                                    Sign Out of Account
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
