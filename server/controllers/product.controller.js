import Product from '../models/product.model.js'

// Register product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
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
            filter.category = { $regex: category, $options: 'i'}
        }

        const products = await Product.find(filter)

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