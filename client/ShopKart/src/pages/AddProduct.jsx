import React, { useState } from 'react';
import { axiosInstance } from '../axiosCalls/axios.js';
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Other'
];

export default function AddProduct() {
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null
    });

    const navigate = useNavigate()
    // Image Preview State
    const [imagePreview, setImagePreview] = useState(null);

    // Loading State
    const [loading, setLoading] = useState(false);

    // Submission Status Messages
    const [message, setMessage] = useState({ type: '', text: '' });

    // Errors State for Basic Client-side Validation
    const [errors, setErrors] = useState({});

    // Handle Text & Select Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear error for field on typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Handle File Input & Create Local Preview URL
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate image type
            if (!file.type.startsWith('image/')) {
                setErrors((prev) => ({ ...prev, image: 'Please select a valid image file.' }));
                return;
            }

            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, image: '' }));
        }
    };

    // Remove Selected Image
    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
    };

    // Reset Form State
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            image: null
        });
        setImagePreview(null);
        setErrors({});
    };

    // Validation Logic
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required.';
        if (!formData.description.trim()) newErrors.description = 'Description is required.';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Please enter a valid price.';
        if (!formData.category) newErrors.category = 'Please select a category.';
        if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'Please enter valid stock quantity.';
        if (!formData.image) newErrors.image = 'Product image is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateForm()) return;

        setLoading(true);

        try {
            // 1. Construct FormData object
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);
            data.append('image', formData.image); // File object

            // 2. Post FormData (Axios automatically sets multipart/form-data with proper boundary)
            const response = await axiosInstance.post('/products', data);

            // 3. Handle success
            setMessage({
                type: 'success',
                text: response.data?.message || 'Product created successfully!'
            });

            // Reset form after successful submission
            resetForm();
        } catch (error) {
            // 4. Handle error response
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to create product. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    // Cancel Handler
    const handleCancel = () => {
        resetForm();
        setMessage({ type: '', text: '' });
        navigate('/my-products')
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">

                {/* Header */}
                <div className="px-6 py-8 sm:p-10 border-b border-gray-100">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Add New Product
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        List your item on ShopKart. Provide key details like name, price, category, and images to attract potential buyers.
                    </p>
                </div>

                {/* Status Message Display */}
                {message.text && (
                    <div
                        className={`mx-6 sm:mx-10 mt-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">

                    {/* 1. Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Wireless Noise-Canceling Headphones"
                            className={`mt-2 block w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors text-sm`}
                        />
                        {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* 2. Category & Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`mt-2 block w-full rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'
                                    } bg-white px-4 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors text-sm`}
                            >
                                <option value="">Select a category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>}
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-2 rounded-lg">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                    <span className="text-gray-500 text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={`block w-full rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'
                                        } pl-8 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors text-sm`}
                                />
                            </div>
                            {errors.price && <p className="mt-1.5 text-xs text-red-500">{errors.price}</p>}
                        </div>
                    </div>

                    {/* 3. Stock */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-semibold text-gray-700">
                            Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="e.g. 50"
                            className={`mt-2 block w-full rounded-lg border ${errors.stock ? 'border-red-500' : 'border-gray-300'
                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors text-sm`}
                        />
                        {errors.stock && <p className="mt-1.5 text-xs text-red-500">{errors.stock}</p>}
                    </div>

                    {/* 4. Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write a brief overview of the product features, specifications, and condition..."
                            className={`mt-2 block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'
                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors text-sm resize-y`}
                        />
                        {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
                    </div>

                    {/* 5. Product Image & Preview */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Product Image <span className="text-red-500">*</span>
                        </label>

                        {!imagePreview ? (
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors">
                                <div className="space-y-2 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="image-upload"
                                            className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="image-upload"
                                                name="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP up to 5MB</p>
                                </div>
                            </div>
                        ) : (
                            /* Image Preview Area */
                            <div className="mt-2 flex items-center space-x-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <img
                                    src={imagePreview}
                                    alt="Product Preview"
                                    className="h-28 w-28 object-cover rounded-md border border-gray-300"
                                />
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                        {formData.image?.name}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        )}

                        {errors.image && <p className="mt-1.5 text-xs text-red-500">{errors.image}</p>}
                    </div>

                    {/* Form Action Buttons */}
                    <div className="pt-6 border-t border-gray-200 flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:opacity-50 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Adding Product...
                                </>
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}