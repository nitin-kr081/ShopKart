import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/orders')
                setOrders(response.data.orders || [])
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        'Failed to load your orders. Please try again.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

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
                <p className="text-slate-600 font-medium">Loading your orders...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <p className="text-rose-600 mb-4">{error}</p>
                <button
                    onClick={() => {
                        setLoading(true)
                        setError(null)
                        axiosInstance
                            .get('/orders')
                            .then((res) => setOrders(res.data.orders || []))
                            .catch((err) =>
                                setError(
                                    err.response?.data?.message ||
                                        'Failed to load your orders.'
                                )
                            )
                            .finally(() => setLoading(false))
                    }}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-5 text-6xl">📦</div>
                <h1 className="text-2xl font-bold text-slate-800">
                    No orders placed yet
                </h1>
                <p className="mt-2 text-slate-500">
                    Looks like you haven't bought anything on ShopKart yet.
                </p>
                <Link
                    to="/products"
                    className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        My Orders
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Manage and track your recent ShopKart orders.
                    </p>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => {
                        const orderDate = new Date(order.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }
                        )

                        const shortOrderId = order._id
                            ? `#${order._id.slice(-8).toUpperCase()}`
                            : 'N/A'

                        return (
                            <div
                                key={order._id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                {/* Card Header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:p-6">
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                                        <div>
                                            <span className="block text-xs text-slate-400">
                                                ORDER ID
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {shortOrderId}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-400">
                                                DATE PLACED
                                            </span>
                                            <span className="font-medium text-slate-700">
                                                {orderDate}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-400">
                                                TOTAL AMOUNT
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex items-center gap-2">
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
                                            {formatStatusText(order.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Items Preview List */}
                                <div className="divide-y divide-slate-100 p-5 sm:p-6">
                                    {order.items?.map((item, index) => {
                                        const productObj = item.product || {}
                                        const productImage =
                                            item.image || productObj.image || ''
                                        const productName =
                                            item.name || productObj.name || 'Product Item'
                                        const unitPrice = item.price || productObj.price || 0

                                        return (
                                            <div
                                                key={item._id || index}
                                                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                                            >
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                                                    {productImage ? (
                                                        <img
                                                            src={productImage}
                                                            alt={productName}
                                                            className="h-full w-full object-contain p-1"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none'
                                                                e.target.nextSibling.style.display = 'block'
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span
                                                        className="text-xs text-slate-400"
                                                        style={{
                                                            display: productImage ? 'none' : 'block'
                                                        }}
                                                    >
                                                        No image
                                                    </span>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-slate-800">
                                                        {productName}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        Qty: {item.quantity} × ₹
                                                        {unitPrice.toLocaleString('en-IN')}
                                                    </p>
                                                </div>

                                                <p className="text-sm font-bold text-slate-900">
                                                    ₹
                                                    {(
                                                        unitPrice * item.quantity
                                                    ).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Footer Action */}
                                <div className="flex justify-end border-t border-slate-100 bg-slate-50/30 px-5 py-3 sm:px-6">
                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MyOrders