const accountmodel = require("../models/account.model")

async function createAccountController(req,res){

    const user = req.user

    const account = await accountmodel.create({user:user._id})
    res.status(201).json({message:"Account created successfully",account})
}

async function getUserAccountsController(req,res){
    const accounts  =  await accountmodel.find({user:req.user._id})

    res.status(200).json({accounts})
}


async function getBalanceAccountController(req,res){

    const { accountId} =  req.params;
    console.log(accountId)
    const account =  await accountmodel.findOne({_id:accountId,user:req.user._id})
    console.log("account",account)
    if(!account){
        return res.status(400).json({ message : "account not found"})
    }

    console.log("account",account)

    const balance  = await account.getBalance();

    res.status(200).json({accountId:account._id,balance : balance})

}

module.exports = {createAccountController,getUserAccountsController,getBalanceAccountController}