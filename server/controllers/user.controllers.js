import User from '../models/user.models.js'
import bcrypt from 'bcrypt'
import {genToken} from "../utils/generateTokens.js"

// Register Controller

const cookiesOption = {
    httpOnly : true,
    secure : true
}

export const registerUser = async(req , res) =>{
    try{
        const {fullName, email, password, phone} = req.body

        // All fields are mandatory
        if(!fullName || !email || !password || !phone){
            return res.status(400).json({
                message : "All fields are mandatory"
            })
        }

        // Email must be unique
        const emailExists = await User.findOne({email})
        if(emailExists){
            return res.status(409).json({
                message : "Email Already in Use"
            })
        }

        // Password must contain at least 6 characters
        if(password.length < 6){
            return res.staus(400).json({
                message : "Please use a Strong Password"
            })
        }

        // Phone number is required
        if(!phone){
            return res.status(400).json({
                message : "Please Enter Phone Number"
            })
        }

        // Password Security
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)

        const newUser = await User.create({
            fullName,
            email,
            password : hashedPassword,
            phone
        })

        // Generate tokens
        const token = genToken(newUser._id)
        res.cookie('token' , token , cookiesOption)

        res.status(201).json({success : true, message: "Customer registered successfully", 
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                phone: newUser.phone
            }
         })

    }catch(error){
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

// Login Controller

export const loginUser = async(req , res) =>{
    try{
        const {email , password} = req.body
        const user = await User.findOne({email})
        
        if(!user){
            return res.status(401).json({
                message : "Invalid Credentials"
            })
        }

        const passwordCheck = await bcrypt.compare(password , user.password)

        if(!passwordCheck){
            return res.status(401).json({
                message : "Invalid Credentials"
            })
        }

        // Generate tokens
        const token = genToken(user._id)
        res.cookie('token' , token , cookiesOption)

        return res.status(200).json({
            "success": true,
            "message": "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
            }
        })
    }catch(error){
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

// Profile Controller

export const getUser = async(req, res) =>{
    res.status(200).json({
        user: {
            id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            phone: req.user.phone
        }
    })
}

// Logout Controller

export const logoutUser = async(req , res) =>{
    res.clearCookie('token' , cookiesOption)
    res.status(200).json({
        "success": true,
        "message": "Logged out successfully"
    })
}