
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchCart,
    updateCartQuantity,
    removeFromCart
} from '../redux/cartSlice.js'

const Cart = () => {
    const dispatch = useDispatch()
    const { cartItems, loading, actionLoading, error } = useSelector(
        (state) => state.cart
    )

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const subtotal = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    )

    const handleQuantityChange = (productId, quantity) => {
        dispatch(updateCartQuantity({ productId, quantity }))
    }

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId))
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-slate-600">Loading your cart...</p>
            </div>
        )
    }

    if (error && cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
                <p className="text-rose-600">{error || 'Unable to load your cart.'}</p>
                <button
                    onClick={() => dispatch(fetchCart())}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
                <div className="mb-5 text-6xl">🛒</div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Your cart is empty
                </h1>
                <p className="mt-2 text-slate-500">
                    Looks like you haven't added anything yet.
                </p>
                <Link
                    to="/products"
                    className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        My Cart
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Review your items before checkout.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="space-y-4 lg:col-span-2">
                        {cartItems.map((item) => {
                            const product = item.product

                            if (!product) return null

                            const productId = product._id

                            return (
                                <div
                                    key={productId}
                                    className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
                                >
                                    <Link
                                        to={`/products/${productId}`}
                                        className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:w-36"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-contain p-2"
                                        />
                                    </Link>

                                    <div className="flex flex-1 flex-col justify-between gap-4">
                                        <div>
                                            <Link
                                                to={`/products/${productId}`}
                                                className="text-lg font-semibold text-slate-800 hover:text-indigo-600"
                                            >
                                                {product.name}
                                            </Link>

                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {product.stock > 0
                                                    ? `${product.stock} available`
                                                    : 'Currently out of stock'}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            productId,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ||
                                                        item.quantity <= 1
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-lg hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>

                                                <span className="min-w-6 text-center font-semibold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            productId,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ||
                                                        item.quantity >= product.stock
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-lg hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <p className="font-bold text-slate-900">
                                                ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(productId)}
                                            disabled={actionLoading}
                                            className="self-start text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
                                        >
                                            {actionLoading
                                                ? 'Please wait...'
                                                : 'Remove'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Order Summary */}
                    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                        <h2 className="text-xl font-bold text-slate-900">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4 text-sm">
                            <div className="flex justify-between gap-4 text-slate-600">
                                <span>Items</span>
                                <span>{totalItems}</span>
                            </div>

                            <div className="flex justify-between gap-4 text-slate-600">
                                <span>Subtotal</span>
                                <span>
                                    ₹{subtotal.toLocaleString('en-IN')}
                                </span>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <div className="flex justify-between gap-4 text-base font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>
                                        ₹{subtotal.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Shipping and final charges will be confirmed at checkout.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled
                            title="Checkout will be implemented in Lab-06"
                            className="mt-6 w-full cursor-not-allowed rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white opacity-60"
                        >
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/products"
                            className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Continue Shopping
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Cart
