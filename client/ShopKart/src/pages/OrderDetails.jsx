import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'

const OrderDetails = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [imageErrors, setImageErrors] = useState({})

    const fetchOrderDetails = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axiosInstance.get(`/orders/${id}`)
            setOrder(response.data.order ?? response.data)
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Order not found. It may have been removed or does not exist.')
            } else {
                setError(
                    err.response?.data?.message ||
                        'Unable to load order details. Please try again.'
                )
            }
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (id) {
            fetchOrderDetails()
        }
    }, [id, fetchOrderDetails])

    const handleImageError = (itemId) => {
        setImageErrors((prev) => ({ ...prev, [itemId]: true }))
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PAID':
            case 'DELIVERED':
            case 'CONFIRMED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'SHIPPED':
            case 'PLACED':
                return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'PENDING':
            case 'PENDING_PAYMENT':
                return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'FAILED':
                return 'bg-rose-50 text-rose-700 border-rose-200'
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200'
        }
    }

    const formatStatusText = (statusText = '') => {
        return statusText.replace(/_/g, ' ')
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="font-medium text-slate-600">Loading order details...</p>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 text-5xl">⚠️</div>
                <h1 className="text-2xl font-bold text-slate-800">
                    {error || 'Order Unavailable'}
                </h1>
                <p className="mt-2 max-w-md text-slate-500">
                    We couldn't retrieve the details for this order. Check your URL or try reloading.
                </p>
                <div className="mt-6 flex items-center gap-4">
                    <button
                        onClick={fetchOrderDetails}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Try Again
                    </button>
                    <Link
                        to="/orders"
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Back to My Orders
                    </Link>
                </div>
            </div>
        )
    }

    const shippingAddress = order.shippingAddress ?? {}
    const orderItems = order.items ?? []
    const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          })
        : 'N/A'

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Top Bar Navigation */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        ← Back to My Orders
                    </Link>
                </div>

                {/* Main Order Header */}
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Order ID
                            </span>
                            <h1 className="mt-1 text-2xl font-bold text-slate-900">
                                #{order._id}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Placed on {orderDate}
                            </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                                    order.paymentStatus
                                )}`}
                            >
                                Payment: {formatStatusText(order.paymentStatus)}
                            </span>
                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                                    order.status
                                )}`}
                            >
                                Status: {formatStatusText(order.status)}
                            </span>
                        </div>
                    </div>

                    {/* Shipping Address Details */}
                    <div className="mt-6">
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
                            Shipping Details
                        </h2>
                        <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                            <p className="font-bold text-slate-900">
                                {shippingAddress.fullName || 'N/A'}
                            </p>
                            <p>{shippingAddress.addressLine1 || shippingAddress.addressLine || 'N/A'}</p>
                            <p>
                                {[shippingAddress.city, shippingAddress.state]
                                    .filter(Boolean)
                                    .join(', ')}{' '}
                                {shippingAddress.pincode ? `- ${shippingAddress.pincode}` : ''}
                            </p>
                            <p className="pt-1 text-slate-600">
                                <span className="font-medium text-slate-800">Phone:</span>{' '}
                                {shippingAddress.phone || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products List Section */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold text-slate-900">
                        Ordered Items
                    </h2>

                    <div className="divide-y divide-slate-100">
                        {orderItems.map((item, index) => {
                            const productObj = item.product ?? {}
                            const itemKey = item._id ?? index
                            const productImage = item.image || productObj.image || ''
                            const productName = item.name || productObj.name || 'Product Item'
                            const unitPrice = item.price ?? productObj.price ?? 0
                            const quantity = item.quantity ?? 1
                            const lineTotal = unitPrice * quantity
                            const isImageFailed = imageErrors[itemKey]

                            return (
                                <div
                                    key={itemKey}
                                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                >
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                        {productImage && !isImageFailed ? (
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                className="h-full w-full object-contain p-1"
                                                onError={() => handleImageError(itemKey)}
                                            />
                                        ) : (
                                            <span className="text-xs text-slate-400">
                                                No image
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {productName}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            ₹{unitPrice.toLocaleString('en-IN')} × {quantity}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-sm font-bold text-slate-900">
                                            ₹{lineTotal.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Order Total Summary */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-base">
                        <span className="font-bold text-slate-900">Total Amount</span>
                        <span className="text-xl font-bold text-slate-900">
                            ₹{(order.totalAmount ?? 0).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails