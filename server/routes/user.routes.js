import express from 'express'
import {registerUser} from '../controllers/user.controllers.js'
import {loginUser} from '../controllers/user.controllers.js'

const userRoutes = express.Router()

// Register
userRoutes.post('/register' , registerUser)

// Login
userRoutes.post('/login' , loginUser)

export default userRoutes