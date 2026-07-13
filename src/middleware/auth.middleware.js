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


async function authSystemMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    
    if(!token){ return res.status(401).json({
        message : "unauthorizred  access , token is missing "
    }) }

  try {
    const decoded  = jwt.verify(token,process.env.JWT_SECRET)

    const user  =  await userModel.findById(decoded.userId).select("+systemUser")
    if(!user.systemUser){
        return res.status(403).json({
            message : "Forbidden access,not a system user"
        })
    }

    req.user  = user


    return next()




  } catch (error) {
    return res.status(401).json({
        message : "Forbidden access, token is invalid"
    })
  }



}

module.exports = {authMiddleware ,authSystemMiddleware}