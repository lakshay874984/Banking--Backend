const Account = require("../models/account.model")
const Ledger = require("../models/ledger.model")
const Transaction = require("../models/transaction.model")
const { sendEmail } = require("../services/email.service")






async function createTransaction(req, res) {

    /**
     * Validate the request body to ensure that all required fields are present and valid. The required fields are:
     * - fromAccount: The ID of the account from which the transaction is being made.
     * - toAccount: The ID of the account to which the transaction is being made.
     * - amount: The amount of money being transferred.
     * - idempotencyKey: A unique key to ensure the transaction is idempotent.
     */
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({message:"Missing required fields"})
    }


    const fromUserAccount = await Account.findOne({ _id:fromAccount})
    if(!fromUserAccount){
        return res.status(404).json({message:"From account not found"})
    }
    const toUserAccount = await Account.findOne({ _id:toAccount})
    if(!toUserAccount){
        return res.status(404).json({message:"To account not found"})
    }

    /**
     * Validate the idempotency key to ensure that the transaction is not a duplicate. If a transaction with the same idempotency key already exists, return a 409 Conflict response.
     */
    const existingTransaction = await Transaction.findOne({idempotencyKey})
    if(existingTransaction){
        if(existingTransaction.status === "PENDING"){
            return res.status(409).json({message:"Transaction is already in progress"})
        }
        if(existingTransaction.status === "SUCCESS"){
            return res.status(200).json({message:"Transaction has already been completed", transaction:existingTransaction})
        }
        if(existingTransaction.status === "FAILED"){
            return res.status(409).json({message:"Transaction has already failed", transaction:existingTransaction})
        }
        if(existingTransaction.status === "REVERSED"){
            return res.status(500).json({message:"Transaction has already been reversed", transaction:existingTransaction})
        }
    }

    /**
     * check account status of both accounts to ensure that they are ACTIVE. If either account is not ACTIVE, return a 400 Bad Request response.
     */

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({message:"One or both accounts are not active"})
    }


    /**
     *  Derive sender balance from ledger
     */
    const balance = fromUserAccount.getBalance(W)
    if(balance < amount){
        res.status(400).json({message:"insuffiecient balance"},amount,balance)
    }








}
module.exports = {createTransaction}