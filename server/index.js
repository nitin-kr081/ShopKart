
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const app = express()

// Render provides PORT; locally, use 8180
const PORT = process.env.PORT || 8180

// Allow local development and the deployed Vercel frontend
const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Health check for deployment
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'ShopKart server is running'
    })
})

// Existing ShopKart routes
app.use('/customers', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

// Connect to MongoDB and start the server
mongoose.connect(process.env.dbURL)
    .then(() => {
        console.log('DB Connected')

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server Started at ${PORT}`)
        })
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message)
        process.exit(1)
    })
