import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import ProductCard from '../components/ProductCard.jsx'

export default function MyProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch products created by the logged-in user
        const response = await axiosInstance.get('/products/my-products')
        setProducts(response.data.products)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your products.')
      } finally {
        setLoading(false)
      }
    }

    fetchMyProducts()
  }, [])

  const handleDeleteProduct = (productId) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Products</h1>
            <p className="text-sm text-gray-600 mt-1">Manage the products you have listed for sale on ShopKart.</p>
          </div>
          <button
            onClick={() => navigate('/add-product')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
          >
            + Add New Product
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="text-gray-500 font-medium">Loading your products...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm space-y-4">
            <p className="text-gray-500 text-base">You haven't listed any products for sale yet.</p>
            <button
              onClick={() => navigate('/add-product')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              List Your First Product
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                showSellerActions={true}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}