import express from 'express'
import { createProduct, getAllProducts, getProductById, getMyProducts, deleteProduct, updateProduct } from '../controllers/product.controller.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'
import { wishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js'
import upload from '../middlewares/upload.middleware.js'

const router = express.Router()

/// Register product
router.post('/', isAuthenticated, upload.single('image'), createProduct)

// Get all products
router.get('/', isAuthenticated, getAllProducts)

// Get logged-in user's products
router.get('/my-products', isAuthenticated, getMyProducts)

// Update logged-in user's product details
router.put('/:id', isAuthenticated, updateProduct)

// Delete logged-in user's products
router.delete('/:id', isAuthenticated, deleteProduct)

// Wishlist a product
router.post('/wishlist/:productId', isAuthenticated, wishlist)

// Get wishlist
router.get('/wishlist', isAuthenticated, getWishlist)

// Get single product
router.get('/:id', isAuthenticated, getProductById)

// Delete a wishlist product
router.delete('/wishlist/:productId', isAuthenticated, removeFromWishlist)

export default router