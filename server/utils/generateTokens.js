import jwt from 'jsonwebtoken'

export const genToken = (userId) =>{
    const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : "5d"})
    return token
}