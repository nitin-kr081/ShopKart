import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'

const ProductCard = ({ product, wishlist = [], onWishlistChange }) => {
    const navigate = useNavigate()
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [wishlistError, setWishlistError] = useState("")

    useEffect(() => {
        const exists = wishlist.some((item) => item._id === product._id)
        setIsWishlisted(exists)
    }, [wishlist, product._id])

    const toggleWishlist = async (e) => {
        e.stopPropagation() // Prevents triggering card navigation
        try {
            setWishlistLoading(true)
            setWishlistError("")
            if (isWishlisted) {
                await axiosInstance.delete(`/products/wishlist/${product._id}`)
                setIsWishlisted(false)
                onWishlistChange?.(product._id, false)
            } else {
                await axiosInstance.post(`/products/wishlist/${product._id}`)
                setIsWishlisted(true)
                onWishlistChange?.(product._id, true)
            }
        } catch (error) {
            setWishlistError(
                error.response?.data?.message || "Failed to update wishlist"
            )
        } finally {
            setWishlistLoading(false)
        }
    }

    return (
        <div className="max-w-sm w-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col justify-between group">
            <div className="relative h-56 w-full overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />

                {/* Wishlist Button */}
                <button
                    type="button"
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    aria-label={wishlistLoading ? "Saving wishlist" : "Add to Wishlist"}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-200 focus:outline-none ${wishlistLoading
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:scale-110 active:scale-95 cursor-pointer'
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className={`w-5 h-5 transition-colors duration-200 ${isWishlisted
                                ? 'fill-red-500 stroke-red-500'
                                : 'fill-none stroke-gray-600 hover:stroke-red-500'
                            }`}
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                </button>

                {wishlistLoading && (
                    <p className="absolute top-14 right-3 z-10 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
                        Saving...
                    </p>
                )}

                {wishlistError && (
                    <p className="absolute top-14 right-3 z-10 text-xs text-red-500 bg-white px-2 py-1 rounded shadow">
                        {wishlistError}
                    </p>
                )}
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

                        <p className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${product.stock > 0
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