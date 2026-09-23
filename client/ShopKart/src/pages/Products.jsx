import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../axiosCalls/axios.js'
import ProductCard from '../components/ProductCard.jsx'

const Products = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')

    useEffect(() => {
        axiosInstance.get(`/products?search=${search}&category=${category}`).then((response) => {
            setProducts(response.data.products)
        }).catch((error) => {
            setError(error.response.data.message)
        }).finally(() => {
            setLoading(false)
        })
    }, [search,category])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg font-medium">Loading products...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-rose-600 text-lg font-medium bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl">{error}</p>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
                <p className="text-gray-500 text-lg font-medium mb-4">No products found</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <input
                        type='text'
                        placeholder='Search products'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                    >
                        <option value=''>All Categories</option>
                        <option value='Electronics'>Electronics</option>
                        <option value='Clothing'>Clothing</option>
                        <option value='Books'>Books</option>
                    </select>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                    Products
                </h1>

                {/* Filter and Search Bar */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <input
                        type='text'
                        placeholder='Search products'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:max-w-xs px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                    >
                        <option value=''>All Categories</option>
                        <option value='Electronics'>Electronics</option>
                        <option value='Clothing'>Clothing</option>
                        <option value='Books'>Books</option>
                    </select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Products