const express = require("express");
const { UserRegisterController ,UserLoginController,UserLogoutController} = require("../controllers/auth.controller");


const router = express.Router()

router.post("/register",UserRegisterController)
router.post("/login",UserLoginController)
/**
 * -POST /API/AUTH/LOGOUT
 */

router.post("/logout",UserLogoutController)
module.exports = router

