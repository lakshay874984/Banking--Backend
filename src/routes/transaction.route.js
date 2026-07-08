const express =  require("express");
const {authMiddleware} = require("../middlewares/auth.middleware");


const transactionRouter = express.Router()

transactionRouter.post("/",authMiddleware, require("../controllers/transaction.controller").createTransaction)

module.exports = transactionRouter