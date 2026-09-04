import express from 'express'
import {registerUser} from '../controllers/user.controllers.js'

const userRoutes = express.Router()

// Register
userRoutes.post('/register' , registerUser)

export default userRoutes