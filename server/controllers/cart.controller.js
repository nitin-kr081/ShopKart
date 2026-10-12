
import User from '../models/user.models.js'
import Product from '../models/product.model.js'
import mongoose from 'mongoose'

// Add product to cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const user = req.user
        const cartItem = user.cart.find(
            item => item.product.toString() === productId
        )

        const newQuantity = cartItem ? cartItem.quantity + 1 : 1

        if (newQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity exceeds available stock"
            })
        }

        if (cartItem) {
            cartItem.quantity = newQuantity
        } else {
            user.cart.push({
                product: product._id,
                quantity: 1
            })
        }

        await user.save()

        const updatedUser = await User.findById(user._id)
            .populate("cart.product", "name price category image stock")

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: updatedUser.cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get current user's cart
export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("cart.product", "name price category image stock")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            cart: user.cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Update product quantity
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            })
        }

        if (typeof quantity !== "number" ||
            !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity exceeds available stock"
            })
        }

        const user = req.user
        const cartItem = user.cart.find(
            item => item.product.toString() === productId
        )

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            })
        }

        cartItem.quantity = quantity
        await user.save()

        const updatedUser = await User.findById(user._id)
            .populate("cart.product", "name price category image stock")

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: updatedUser.cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Remove product from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            })
        }

        const user = req.user
        const cartItem = user.cart.find(
            item => item.product.toString() === productId
        )

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            })
        }

        user.cart.pull({ product: productId })
        await user.save()

        const updatedUser = await User.findById(user._id)
            .populate("cart.product", "name price category image stock")

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: updatedUser.cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
