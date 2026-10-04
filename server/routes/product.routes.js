import express from 'express'
import { createProduct, getAllProducts, getProductById } from '../controllers/product.controller.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'
import { wishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js'

const router = express.Router()

/// Register product
router.post('/', isAuthenticated, createProduct)

// Get all products
router.get('/', isAuthenticated, getAllProducts)

// Wishlist a product
router.post('/wishlist/:productId', isAuthenticated, wishlist)

// Get wishlist
router.get('/wishlist', isAuthenticated, getWishlist)

// Get single product
router.get('/:id', isAuthenticated, getProductById)

// Delete a wishlist product
router.delete('/wishlist/:productId', isAuthenticated, removeFromWishlist)

export default router