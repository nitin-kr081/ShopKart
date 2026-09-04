import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from '../server/routes/user.routes.js'
import cookieParser from 'cookie-parser'


const app = express()

const PORT = 8180

dotenv.config()

mongoose.connect(process.env.dbURL).then(()=>{
    console.log("DB Connected")
}).catch((error)=>{
    console.log(error)
})

app.use(express.json())
app.use(cookieParser())
app.use('/customers' , userRoutes)

app.listen(PORT , (req , res)=>{
    console.log(`Server Started at ${PORT}`)
})