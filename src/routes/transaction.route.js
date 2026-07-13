const express =  require("express");
const {authMiddleware,authSystemMiddleware} = require("../middleware/auth.middleware");
const {createTransaction,createIntialFundsTransaction} = require("../controllers/transaction.controller")

const transactionRouter = express.Router()
transactionRouter.post("/",authMiddleware, createTransaction)

/**
 * - POST /api/transactions/syste,/intial-funds
 * - Create intial funds transaction from system User
 */
transactionRouter.post("/system/intial-funds",authSystemMiddleware,createIntialFundsTransaction)

module.exports = {transactionRouter}