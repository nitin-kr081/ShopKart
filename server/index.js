import express from 'express'

const app = express()

const PORT = 8180



app.listen(PORT , (req , res)=>{
    console.log(`Server Started at ${PORT}`)
})