import express from 'express'
import {createProduct, getAllProducts, getProductById} from '../controllers/product.controller.js'

const router = express.Router()

// Register product
router.post('/', createProduct)

// Get all products
router.get('/', getAllProducts)

// Get single product
router.get('/:id', getProductById)

export default router