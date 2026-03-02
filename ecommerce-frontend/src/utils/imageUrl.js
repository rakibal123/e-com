export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/uploads/sample.jpg';
    if (imagePath.startsWith('http')) return imagePath; // Cloudinary or absolute URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};
