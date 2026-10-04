import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0.00001
        },
        category: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, { timestamps: true })

const Product = mongoose.model("Product", productSchema)

export default Product