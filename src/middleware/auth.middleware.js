const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")


async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    console.log("token",token,req.cookies)
    if(!token){
        return res.status(401).json({message:"Unauthorized or Invalid token"})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log("decoded",decoded)
        const user = await userModel.findById(decoded.userId)
        if(!user){
            return res.status(401).json({message:"No user found with this token"})
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({message:"Unauthorized or Invalid token"})
    }
}

module.exports = {authMiddleware }