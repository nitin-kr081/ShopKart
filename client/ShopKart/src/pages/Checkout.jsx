import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import { fetchCart, clearCart } from '../redux/cartSlice.js'

// Reusable script loader guard to prevent duplicate script elements
let razorpayScriptPromise = null

const loadRazorpayScript = () => {
    if (window.Razorpay) {
        return Promise.resolve(true)
    }
    if (razorpayScriptPromise) {
        return razorpayScriptPromise
    }

    razorpayScriptPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            razorpayScriptPromise = null
            resolve(false)
        }
        document.body.appendChild(script)
    })

    return razorpayScriptPromise
}

const Checkout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const hasFetched = useRef(false)
    const isSubmittingRef = useRef(false)
    const isVerifyingRef = useRef(false)

    const { cartItems, loading, error: cartError } = useSelector(
        (state) => state.cart
    )

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: ''
    })

    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [apiError, setApiError] = useState(null)
    const [savedVerificationData, setSavedVerificationData] = useState(null)

    // Fetch cart once on mount if not already fetching
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true
            dispatch(fetchCart())
        }
    }, [dispatch])

    const grandTotal = cartItems.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0
    )

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required.'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.'
        } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Enter a valid 10-digit Indian mobile number.'
        }

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address line is required.'
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required.'
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required.'
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Six-digit pincode is required.'
        } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
            newErrors.pincode = 'Pincode must be exactly 6 digits.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Verification helper function that can be called on payment success or on retry
    const verifyPayment = async (verifyPayload) => {
        // Prevent duplicate verification requests
        if (isVerifyingRef.current) return

        isVerifyingRef.current = true
        setSubmitting(true)
        isSubmittingRef.current = true
        setApiError(null)

        try {
            const verifyRes = await axiosInstance.post(
                '/orders/verify-payment',
                verifyPayload
            )

            if (verifyRes.data?.success) {
                dispatch(clearCart())
                navigate(`/orders/${verifyPayload.shopKartOrderId}`)
            } else {
                setSavedVerificationData(verifyPayload)
                setApiError(
                    'Payment verification failed. Your payment may have succeeded on Razorpay. Please click "Retry Verification" below to verify without paying again. Do not pay again.'
                )
            }
        } catch (err) {
            setSavedVerificationData(verifyPayload)
            setApiError(
                err.response?.data?.message ||
                    'Payment verification failed. Your payment may have succeeded on Razorpay. Please click "Retry Verification" below to verify without paying again. Do not make another payment.'
            )
        } finally {
            isVerifyingRef.current = false
            setSubmitting(false)
            isSubmittingRef.current = false
        }
    }

    const handleRetryVerification = () => {
        if (savedVerificationData && !isSubmittingRef.current) {
            verifyPayment(savedVerificationData)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setApiError(null)

        // Prevent rapid duplicate clicks using ref check
        if (isSubmittingRef.current) {
            return
        }

        if (!validate()) {
            return
        }

        isSubmittingRef.current = true
        setSubmitting(true)

        // 1. Load Razorpay Script safely
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
            setApiError('Failed to load Razorpay SDK. Please check your internet connection.')
            isSubmittingRef.current = false
            setSubmitting(false)
            return
        }

        try {
            // 2. Call backend to create payment order
            const payload = {
                shippingAddress: {
                    fullName: formData.fullName.trim(),
                    phone: formData.phone.trim(),
                    addressLine1: formData.addressLine1.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    pincode: formData.pincode.trim()
                }
            }

            const response = await axiosInstance.post(
                '/orders/create-payment-order',
                payload
            )

            const { shopKartOrderId, razorpayOrderId, amount, currency, key } = response.data

            // 3. Configure Razorpay options
            const options = {
                key,
                amount,
                currency,
                name: 'ShopKart',
                description: 'Payment for your ShopKart Order',
                order_id: razorpayOrderId,
                prefill: {
                    name: formData.fullName.trim(),
                    contact: formData.phone.trim()
                },
                handler: (razorpayResponse) => {
                    const verifyPayload = {
                        shopKartOrderId,
                        razorpay_order_id: razorpayResponse.razorpay_order_id,
                        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                        razorpay_signature: razorpayResponse.razorpay_signature
                    }
                    verifyPayment(verifyPayload)
                },
                modal: {
                    ondismiss: () => {
                        // Do NOT reset submission state if verification is running in the background
                        if (!isVerifyingRef.current) {
                            isSubmittingRef.current = false
                            setSubmitting(false)
                            setApiError('Payment cancelled. You can try again whenever you are ready.')
                        }
                    }
                }
            }

            const razorpayInstance = new window.Razorpay(options)

            razorpayInstance.on('payment.failed', (response) => {
                // Don't reset state if payment verification is already running
                if (isVerifyingRef.current) return

                isSubmittingRef.current = false
                setSubmitting(false)
                setApiError(
                    response.error?.description ||
                        'Payment processing failed. Please try again.'
                )
            })

            razorpayInstance.open()
        } catch (err) {
            setApiError(
                err.response?.data?.message ||
                    'Failed to initiate payment. Please try again.'
            )
            isSubmittingRef.current = false
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-slate-600">Loading checkout...</p>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
                {cartError ? (
                    <>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Unable to load your cart
                        </h1>
                        <p className="mt-2 max-w-lg text-rose-600">{cartError}</p>
                        <button
                            type="button"
                            onClick={() => dispatch(fetchCart())}
                            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Try Again
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mb-5 text-6xl">🛒</div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Your cart is empty
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Add items to your cart before proceeding to checkout.
                        </p>
                    </>
                )}

                {apiError && (
                    <div className="mt-5 max-w-lg rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                        <p>{apiError}</p>
                        {savedVerificationData && (
                            <button
                                type="button"
                                onClick={handleRetryVerification}
                                disabled={submitting}
                                className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                            >
                                {submitting ? 'Verifying...' : 'Retry Verification'}
                            </button>
                        )}
                    </div>
                )}

                <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <Link
                        to="/cart"
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        View Cart
                    </Link>
                    <Link
                        to="/products"
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
                    <p className="mt-2 text-slate-500">
                        Please enter your shipping details to proceed.
                    </p>
                </div>

                {(apiError || cartError) && (
                    <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                        <p>{apiError || cartError}</p>
                        {savedVerificationData && (
                            <button
                                type="button"
                                onClick={handleRetryVerification}
                                disabled={submitting}
                                className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                            >
                                {submitting ? 'Verifying...' : 'Retry Verification'}
                            </button>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                        {/* Section A: Shipping Details */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                            <h2 className="mb-6 text-xl font-bold text-slate-900">
                                Shipping Details
                            </h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Full Name */}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="fullName"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        disabled={submitting}
                                        className={`w-full rounded-xl border ${
                                            errors.fullName
                                                ? 'border-rose-500 focus:ring-rose-500'
                                                : 'border-slate-300 focus:ring-indigo-500'
                                        } px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50`}
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="phone"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Phone Number <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        disabled={submitting}
                                        className={`w-full rounded-xl border ${
                                            errors.phone
                                                ? 'border-rose-500 focus:ring-rose-500'
                                                : 'border-slate-300 focus:ring-indigo-500'
                                        } px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50`}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Address Line */}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="addressLine1"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Address Line <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="addressLine1"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        placeholder="Flat, House no., Street name"
                                        disabled={submitting}
                                        className={`w-full rounded-xl border ${
                                            errors.addressLine1
                                                ? 'border-rose-500 focus:ring-rose-500'
                                                : 'border-slate-300 focus:ring-indigo-500'
                                        } px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50`}
                                    />
                                    {errors.addressLine1 && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {errors.addressLine1}
                                        </p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label
                                        htmlFor="city"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        City <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Bengaluru"
                                        disabled={submitting}
                                        className={`w-full rounded-xl border ${
                                            errors.city
                                                ? 'border-rose-500 focus:ring-rose-500'
                                                : 'border-slate-300 focus:ring-indigo-500'
                                        } px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50`}
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                {/* State */}
                                <div>
                                    <label
                                        htmlFor="state"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        State <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Karnataka"
                                        disabled={submitting}
                                        className={`w-full rounded-xl border ${
                                            errors.state
                                                ? 'border-rose-500 focus:ring-rose-500'
                                                : 'border-slate-300 focus:ring-indigo-500'
                                        } px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50`}
                                    />
                                    {errors.state && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {errors.state}
                                        </p>
                                    )}
                                </div>

                                {/* Pincode */}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="pincode"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Six-Digit Pincode <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="560100"
                                        maxLength={6}
                                        disabled={submitting}
                                        className={`w-full rounded-xl border ${
                                            errors.pincode
                                                ? 'border-rose-500 focus:ring-rose-500'
                                                : 'border-slate-300 focus:ring-indigo-500'
                                        } px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50`}
                                    />
                                    {errors.pincode && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {errors.pincode}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section B: Order Summary */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                            <h2 className="mb-4 text-xl font-bold text-slate-900">
                                Order Summary
                            </h2>

                            <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto pr-1">
                                {cartItems.map((item) => {
                                    const product = item.product
                                    if (!product) return null
                                    const lineTotal = product.price * item.quantity

                                    return (
                                        <div
                                            key={product._id}
                                            className="flex items-center gap-3 py-3"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-14 w-14 shrink-0 rounded-lg bg-slate-50 object-contain p-1"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-800">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    ₹{product.price.toLocaleString('en-IN')} × {item.quantity}
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">
                                                ₹{lineTotal.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-4 border-t border-slate-200 pt-4">
                                <div className="flex justify-between text-base font-bold text-slate-900">
                                    <span>Grand Total</span>
                                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? 'Processing Payment...' : 'Proceed to Payment'}
                            </button>

                            <Link
                                to="/cart"
                                className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Return to Cart
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Checkout