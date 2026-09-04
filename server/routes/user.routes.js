import express from 'express'
import {registerUser} from '../controllers/user.controllers.js'
import {loginUser} from '../controllers/user.controllers.js'
import {isAuthenticated} from '../middlewares/authMiddleware.js'
import {getUser} from '../controllers/user.controllers.js'

const userRoutes = express.Router()

// Register
userRoutes.post('/register' , registerUser)

// Login
userRoutes.post('/login' , loginUser)

// My Profile
userRoutes.get('/me' , isAuthenticated , getUser)
export default userRoutes