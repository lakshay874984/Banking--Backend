const express = require("express")
const dotenv = require("dotenv")
const  connectDB  = require("./DB/connectDB")

/**
 * - ROute required
 */
const authRoutes = require("./routes/auth.routes")
const accountRoutes = require("./routes/account.routes")
const cookieParser = require("cookie-parser")

const app =  express()

app.use(express.json())
app.use(cookieParser())
dotenv.config()
connectDB()

app.use("/api/auth",authRoutes)
app.use("/api/accounts",accountRoutes)
module.exports = app