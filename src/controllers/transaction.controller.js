const { mongoose } = require("mongoose")
const Account = require("../models/account.model")
const Ledger = require("../models/ledger.model")
const Transaction = require("../models/transaction.model")
const { sendEmail , sendTransactionEmail,sendTransactionFailureEmail } = require("../services/email.service")



/**
 * * - create a new transaction 
 * The 10-step TRANSFER FLOW
 * 1 . validate request 
 * 2 . validate idempotency key
 * 3 . check account status
 * 4 . derive sender balance from ledger
 * 5 . create transaction (PENDING)
 * 6 . create ledger entries (DEBIT and CREDIT)
 * 7 . update transaction status (SUCCESS)
 * 8 . commit transaction
 * 9 . send email notification to both users about the transaction
 * 10. return response
 */



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
        return res.status(400).json({message:"insufficient balance"},amount,balance)
    }

   /**
    *  Create transaction (PENDING)
    */

   const session = await Transaction.startSession()
   session.startTransaction()  // Start a new transaction session which means that all operations performed within this session will be part of a single transaction. If any operation fails, the entire transaction can be rolled back to maintain data integrity.
    const transaction = await Transaction.create([{fromAccount,toAccount,amount,idempotencyKey,status:"PENDING"}],{session})

    const debitLedgerEntry = await Ledger.create([{account : fromAccount, type:"DEBIT", amount, transaction : transaction[0]._id}],{session})
    const creditLedgerEntry = await Ledger.create([{account : toAccount, type:"CREDIT", amount, transaction:transaction[0]._id}],{session})


    transaction[0].status = "SUCCESS"
    await transaction[0].save({session})

    await session.commitTransaction() // Commit the transaction, making all changes permanent in the database.  
    session.endSession() // End the transaction session, releasing any resources associated with it.

    /** 
     * send email notification to both users about the transaction. This is done asynchronously and does not affect the transaction process.
     */
    await sendTransactionEmail(req.user.email, req.user.name, amount, fromUserAccount, toUserAccount);

    return res.status(200).json({message:"Transaction successful", transaction:transaction[0]})




} 

async function createIntialFundsTransaction(req,res) {
    const {toAccount,amount,idempotencyKey} = req.body

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "toAccount,amount and idempotencyKey are required"
        })
    }
    const toUserAccount =  await Account.findOne({
        _id : toAccount,
    })
    if(!toUserAccount){
        return res.status(400).json({
            message : "Invalid toAccount"
        })
    }
    const fromUserAccount = await Account.findOne({
        user : req.user._id
    })

    console.log(req.user,fromUserAccount)

    if(!fromUserAccount){
        return res.status(400).json({
            message : "System user account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    const transaction = new Transaction({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status : "PENDING"

    }) // diff between create and new is that create will save the document to the database immediately while new will create a new instance of the model but will not save it to the database until you call save() method on it.

    const debitLedgerEntry =  await Ledger.create([{
        account : fromUserAccount._id,
        amount : amount,
        transaction : transaction._id,
        type:"DEBIT"
    }],{session})
    const creditLedgerEntry =  await Ledger.create([{
        account : toAccount,
        amount : amount,
        transaction : transaction._id,
        type:"CREDIT"
    }],{session})

    transaction.status = "SUCCESS"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()
    return res.status(201).json({
        message : "Intial funds transaction completed successfully",
        transaction : transaction
    })
}
module.exports = {createTransaction,createIntialFundsTransaction}