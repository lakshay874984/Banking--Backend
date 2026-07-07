const express = require("express");
const { UserRegisterController ,UserLoginController} = require("../controllers/auth.controller");


const router = express.Router()

router.post("/register",UserRegisterController)
router.post("/login",UserLoginController)

module.exports = router

