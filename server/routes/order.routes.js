
import express from 'express'
import { isAuthenticated } from '../middlewares/authMiddleware.js'
import {
    createOrder,
    verifyPayment,
    getMyOrders,
    getOrderById
} from '../controllers/order.controller.js'

const orderRoutes = express.Router()

// Create a ShopKart order and Razorpay order
orderRoutes.post(
    '/create-payment-order',
    isAuthenticated,
    createOrder
)

// Verify the Razorpay payment
orderRoutes.post(
    '/verify-payment',
    isAuthenticated,
    verifyPayment
)

// Get all orders belonging to the logged-in user
orderRoutes.get('/', isAuthenticated, getMyOrders)

// Get one order belonging to the logged-in user
orderRoutes.get('/:id', isAuthenticated, getOrderById)

export default orderRoutes
