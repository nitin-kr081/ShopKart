import jwt from 'jsonwebtoken'
import User from '../models/user.models.js'

export const isAuthenticated = async(req , res , next) =>{
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if(!user){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    req.user = user

    next()
}