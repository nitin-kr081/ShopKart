import User from '../models/user.models.js'
import bcrypt from 'bcrypt'

// Register Controller

export const registerUser = async(req , res) =>{
    try{
        const {fullName, email, password, phone} = req.body

        // All fields are mandatory
        if(!fullName || !email || !password || !phone){
            res.status(400).json({
                message : "All fields are mandatory"
            })
        }

        // Email must be unique
        const emailExists = await User.findOne({email})
        if(emailExists){
            res.status(409).json({
                message : "Email Already in Use"
            })
        }

        // Password must contain at least 6 characters
        if(password.length < 6){
            res.staus(400).json({
                message : "Please use a Strong Password"
            })
        }

        // Phone number is required
        if(!phone){
            res.status(400).json({
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

        res.status(201).json({ message: "User Resgitered", user: newUser })

    }catch(error){
        
    }
}