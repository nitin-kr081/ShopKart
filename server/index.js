import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const app = express()

const PORT = 8180

dotenv.config()

mongoose.connect(process.env.dbURL).then(()=>{
    console.log("DB Connected")
}).catch((error)=>{
    console.log(error)
})

app.use(express.json())

app.listen(PORT , (req , res)=>{
    console.log(`Server Started at ${PORT}`)
})