
import User from '../models/user.models.js'
import Product from '../models/product.model.js'
import Order from '../models/order.model.js'
import mongoose from 'mongoose'
import razorpay from '../config/razorpay.js'
import crypto from 'crypto'

// Create a pending order and Razorpay payment order
export const createOrder = async (req, res) => {
    let order

    try {
        const { shippingAddress } = req.body

        // Validate shipping address
        const requiredFields = [
            'fullName',
            'phone',
            'addressLine1',
            'city',
            'state',
            'pincode'
        ]

        if (
            !shippingAddress ||
            requiredFields.some(
                field =>
                    typeof shippingAddress[field] !== 'string' ||
                    !shippingAddress[field].trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'All shipping fields are required'
            })
        }

        if (!/^[6-9]\d{9}$/.test(shippingAddress.phone.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Enter a valid 10-digit phone number'
            })
        }

        if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Pincode must contain 6 digits'
            })
        }

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (!user.cart.length) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty'
            })
        }

        const orderItems = []
        let totalAmount = 0

        // Fetch the latest product information
        for (const cartItem of user.cart) {
            const product = await Product.findById(cartItem.product)

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'A product in your cart no longer exists'
                })
            }

            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                })
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            })

            totalAmount += product.price * cartItem.quantity
        }

        // Save a snapshot of the order in ShopKart
        order = await Order.create({
            user: user._id,
            items: orderItems,
            shippingAddress: {
                fullName: shippingAddress.fullName.trim(),
                phone: shippingAddress.phone.trim(),
                addressLine1: shippingAddress.addressLine1.trim(),
                city: shippingAddress.city.trim(),
                state: shippingAddress.state.trim(),
                pincode: shippingAddress.pincode.trim()
            },
            totalAmount: Number(totalAmount.toFixed(2)),
            paymentStatus: 'PENDING',
            status: 'PENDING_PAYMENT'
        })

        // Create the corresponding Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: 'INR',
            receipt: order._id.toString()
        })

        // Save the Razorpay order ID in ShopKart
        order.razorpayOrderId = razorpayOrder.id
        await order.save()

        // Send checkout information to the frontend
        return res.status(201).json({
            success: true,
            message: 'Payment order created successfully',
            shopKartOrderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        })

    } catch (error) {
        // Remove an incomplete ShopKart order if Razorpay
        // order creation failed before its ID was saved
        if (order && !order.razorpayOrderId) {
            try {
                await Order.findByIdAndDelete(order._id)
            } catch (cleanupError) {
                console.error(
                    'Failed to clean up incomplete order:',
                    cleanupError.message
                )
            }
        }

        console.error('Create order error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to create payment order. Please try again.'
        })
    }
}

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
    try {
        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        const userId = req.user._id

        // Validate ShopKart order ID
        if (
            !shopKartOrderId ||
            !mongoose.Types.ObjectId.isValid(shopKartOrderId)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID'
            })
        }

        // Find the order belonging to the logged-in user
        const order = await Order.findOne({
            _id: shopKartOrderId,
            user: userId
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        // If payment was already verified, retry cart clearing
        if (order.paymentStatus === 'PAID') {
            await User.findByIdAndUpdate(userId, {
                $set: { cart: [] }
            })

            return res.status(200).json({
                success: true,
                message: 'Payment already verified successfully',
                order
            })
        }

        // Validate payment details
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification details are missing'
            })
        }

        // Ensure Razorpay order ID matches the saved order
        if (
            !order.razorpayOrderId ||
            order.razorpayOrderId !== razorpay_order_id
        ) {
            return res.status(400).json({
                success: false,
                message: 'Razorpay order ID mismatch'
            })
        }

        // Validate signature format
        if (!/^[a-fA-F0-9]{64}$/.test(razorpay_signature)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature format'
            })
        }

        // Generate expected signature using the saved Razorpay order ID
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
            .digest('hex')

        // Compare signatures safely
        const expectedBuffer = Buffer.from(generatedSignature, 'hex')
        const receivedBuffer = Buffer.from(razorpay_signature, 'hex')

        if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            })
        }

        // Update the ShopKart order
        order.paymentStatus = 'PAID'
        order.status = 'PLACED'
        order.razorpayPaymentId = razorpay_payment_id

        await order.save()

        // Clear the logged-in user's MongoDB cart
        await User.findByIdAndUpdate(userId, {
            $set: { cart: [] }
        })

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order
        })

    } catch (error) {
        console.error('Verify payment error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to verify payment. Please try again.'
        })
    }
}

// Get all orders belonging to the logged-in user
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        console.error('Get my orders error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch your orders'
        })
    }
}

// Get one order belonging to the logged-in user
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID'
            })
        }

        const order = await Order.findOne({
            _id: id,
            user: req.user._id
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        return res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.error('Get order by ID error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch order details'
        })
    }
}
