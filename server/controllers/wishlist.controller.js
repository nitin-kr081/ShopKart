import User from '../models/user.models.js'
import Product from '../models/product.model.js'
import mongoose from 'mongoose'

export const wishlist = async (req, res) => {
    try {
        const { productId } = req.params
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product Id" })
        }
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(400).json({ message: "Product not found" })
        }
        const user = req.user
        const alreadyExists = user.wishlist.some((id) => id.toString() === productId.toString())
        if (alreadyExists) {
            return res.status(409).json({ message: "Product already exists in wishlist" })
        }
        user.wishlist.push(product._id)
        await user.save()
        res.status(200).json({ message: "Product added to the wishlist" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).populate("wishlist", "name price category image stock")
        const wishlist = user.wishlist
        res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist: wishlist
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product Id to remove" })
        }
        const user = req.user
        const exists = user.wishlist.some((id) => id.toString() === productId.toString())
        if (!exists) {
            return res.status(404).json({ message: "Product not found in wishlist" })
        }
        user.wishlist.pull(productId)
        await user.save()
        res.status(200).json({ message: "Product removed from wishlist" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}