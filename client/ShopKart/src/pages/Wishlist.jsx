import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../axiosCalls/axios.js'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'

const Wishlist = () => {
    const navigate = useNavigate()

    const [wishlist, setWishlist] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosInstance.get('/products/wishlist')
            .then((response) => {
                setWishlist(response.data.wishlist)
            })
            .catch((error) => {
                setError(
                    error.response?.data?.message || "Failed to fetch wishlist"
                )
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const handleWishlistChange = (productId, isWishlisted) => {
        if (!isWishlisted) {
            setWishlist((current) =>
                current.filter((product) => product._id !== productId)
            )
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg font-medium">
                    Loading wishlist...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-rose-600 text-lg font-medium bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl">
                    {error}
                </p>
            </div>
        )
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <p className="text-gray-500 text-lg font-medium">
                    Your wishlist is empty ❤️
                </p>

                <p className="text-gray-400 mt-2">
                    Start saving products you love.
                </p>

                <button
                    onClick={() => navigate('/products')}
                    className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors cursor-pointer"
                >
                    Browse Products
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                    My Wishlist
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            wishlist={wishlist}
                            onWishlistChange={handleWishlistChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Wishlist




















// import React, { useState, useEffect } from 'react'
// import { axiosInstance } from '../axiosCalls/axios.js'
// import { useNavigate } from 'react-router-dom'

// const Wishlist = () => {
//     const [wishlist, setWishlist] = useState([])
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(true)
//     const navigate = useNavigate()

//     useEffect(() => {
//         axiosInstance.get('/products/wishlist')
//             .then((response) => { setWishlist(response.data.wishlist) })
//             .catch((error) => { setError(error.response?.data?.message || "Failed to fetch wishlist") })
//             .finally(() => { setLoading(false) })
//     }, [])

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-gray-500 text-lg font-medium">
//                     Loading wishlist...
//                 </p>
//             </div>
//         )
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-rose-600 text-lg font-medium bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl">
//                     {error}
//                 </p>
//             </div>
//         )
//     }

//     if (wishlist.length === 0) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
//                 <p className="text-gray-500 text-lg font-medium">
//                     Your wishlist is empty ❤️
//                 </p>

//                 <p className="text-gray-400 mt-2">
//                     Start saving products you love.
//                 </p>

//                 <button
//                     onClick={() => navigate('/products')}
//                     className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
//                 >
//                     Browse Products
//                 </button>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
//                     My Wishlist
//                 </h1>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {wishlist.map((product) => (
//                         <div
//                             key={product._id}
//                             className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
//                         >
//                             <img
//                                 src={product.image}
//                                 alt={product.name}
//                                 className="w-full h-56 object-cover"
//                             />

//                             <div className="p-5">
//                                 <h2 className="text-lg font-bold text-gray-800">
//                                     {product.name}
//                                 </h2>

//                                 <p className="text-xl font-extrabold text-gray-900 mt-3">
//                                     ₹{product.price}
//                                 </p>

//                                 <p className="text-sm text-gray-500 mt-2">
//                                     {product.category}
//                                 </p>

//                                 <p className="text-sm text-gray-600 mt-2">
//                                     {product.stock > 0
//                                         ? 'In Stock'
//                                         : 'Out of Stock'}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Wishlist