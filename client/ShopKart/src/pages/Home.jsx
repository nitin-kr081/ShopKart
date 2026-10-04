import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Hero / Welcome Section */}
        <div className="bg-white rounded-2xl p-8 sm:p-14 shadow-sm border border-gray-100 text-center space-y-6">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
            ShopKart Marketplace
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Welcome to <span className="text-indigo-600">ShopKart</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your all-in-one e-commerce platform to explore quality items, save your favorite products, and list your own items for sale.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Shop Now
            </button>

            <button
              onClick={() => navigate('/add-product')}
              className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl border border-gray-300 shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sell a Product
            </button>
          </div>
        </div>

        {/* Feature Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Browse */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
              🛒
            </div>
            <h3 className="text-lg font-bold text-gray-900">Browse Products</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Explore a wide collection of items across multiple categories listed by sellers.
            </p>
          </div>

          {/* Feature 2: Wishlist */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
              ❤️
            </div>
            <h3 className="text-lg font-bold text-gray-900">Wishlist Items</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Save your favorite items to your wishlist and access them anytime when shopping.
            </p>
          </div>

          {/* Feature 3: Sell */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              📦
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sell Your Products</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Easily upload, manage, edit, or delete your own products from your account.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home