import React from 'react'
import {useNavigate} from 'react-router-dom'

const ProductCard = ({ product }) => {
    const navigate = useNavigate()
    return (
        <div className="max-w-sm w-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col justify-between group">
            <div className="relative h-56 w-full overflow-hidden bg-gray-50">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h2>

                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-2xl font-extrabold text-gray-900">
                            Price: ₹{product.price}
                        </p>

                        <p className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                            product.stock > 0 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="mt-5 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                >
                    View Details
                </button>
            </div>
        </div>
    )
}

export default ProductCard