import Product from '../models/product.model.js'
import uploadToCloudinary from '../utils/uploadCloudinary.js'

// Register product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required"
            })
        }
        const uploadedImage = await uploadToCloudinary(req.file.buffer)
        const image = uploadedImage.secure_url

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock,
            seller: req.user._id
        })

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// Get products
export const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query

        let filter = {}

        if (search) {
            filter.name = { $regex: search, $options: 'i' }
        }

        if (category) {
            filter.category = { $regex: category, $options: 'i' }
        }

        const products = await Product.find(filter).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: products.length,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get product by id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        })
    }
}

// Get logged-in user's products
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.user._id
        })

        res.status(200).json({
            success: true,
            count: products.length,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Delete logged-in user's products
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this product"
            })
        }

        await Product.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Update logged-in user's products
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, category, stock } = req.body

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this product"
            })
        }

        let newImageUrl

        if (req.file) {
            const updatedImage = await uploadToCloudinary(req.file.buffer)
            newImageUrl = updatedImage.secure_url
        }

        product.name = name
        product.description = description
        product.price = price
        product.category = category
        product.stock = stock
        if (newImageUrl) {
            product.image = newImageUrl
        }

        await product.save()

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}