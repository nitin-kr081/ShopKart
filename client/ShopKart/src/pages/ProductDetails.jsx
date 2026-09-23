import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'

const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        axiosInstance.get(`/products/${id}`)
            .then((response) => {
                setProduct(response.data.product)
            })
            .catch((error) => {
                setError(error.response.data.message)
            })
    }, [id])

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg font-medium">Loading product...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <button 
                    onClick={() => navigate('/products')}
                    className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
                >
                    ← Back to Products
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <p className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                                Category: {product.category}
                            </p>

                            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <p className="text-gray-600 text-base leading-relaxed mb-6">
                                {product.description}
                            </p>

                            <div className="space-y-3 border-t border-gray-100 pt-4">
                                <p className="text-3xl font-extrabold text-gray-900">
                                    Price: ₹{product.price}
                                </p>

                                <p className="text-sm font-medium text-gray-600">
                                    Stock: <span className="font-semibold text-gray-800">{product.stock}</span>
                                </p>
                            </div>
                        </div>

                        <button className="mt-8 w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails