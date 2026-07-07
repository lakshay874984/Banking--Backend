
const jwt  = require("jsonwebtoken");
const User = require("../models/user.model");
const emailService = require("../services/email.service");


/** 
* - user register controller
* - post api/auth/controller
*/
async function UserRegisterController(req,res){
    const {email,password,name} = req.body
    const useralreadyexist = await User.findOne({email})
    if(useralreadyexist){
        res.status(422).json({message:"User already exists",status:false})
    }
    const user = await User.create({
        name,
        email,
        password
    })
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    
    res.cookie("token",token)
    res.status(201).json({user:{_id:user._id,email:user.email,name:user.name},message:"token is created"},token)// 201 beacuse a new user is created 
    await emailService.sendRegistrationEmail(user.email, user.name); // Send registration email
}
/**
 * 
 * - User Login Controller
 * - Post /api/auth/login
 */
async function UserLoginController(req,res){
    const {email,password} = req.body
    const user = await User.findOne({email}).select("+password")
    if(!user){
        res.status(400).json({status:false,message:"Email or Password is Invalid"})
    }
    const isValidPassword = await user.comparePassword(password)
     if(!isValidPassword){
        res.status(400).json({message:"Email or Password is Invalid"})
     }
     const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    
    res.cookie("token",token)
    res.status(200).json({user:{_id:user._id,email:user.email,name:user.name},message:"token is created"},token)
     //200 beacuse a no new user is created  just user is logged in

    
}

module.exports = {UserRegisterController,UserLoginController}