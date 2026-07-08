const mongoose = require("mongoose")
const Ledger = require("./ledger.model")


const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Account must be associated with a user"],
        index:true
    },
    status:{
        type:String,
        enum:{values :["ACTIVE","FROZEN","CLOSE"],
            message:"Status must be one of the following: ACTIVE, FROZEN, CLOSE",
             
        },
        default:"ACTIVE",
       
    
    },
    currency:{
        default:"INR",
        type:String,
        required:[true,"Currency is required"]
    }
},{
    timestamps:true
})

accountSchema.index({user:1,status:1}) // means one user can have only one account with a particular status
accountSchema.methods.getBalance = async function() {
        const balancedata = await Ledger.aggregate([
            { $match:{account : this._id}},{
                $group : {
                    _id:null,
                    totalDebit:{
                        $sum:{
                            $cond:[{$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                                 ]
                        }
                    },
                     totalCredit:{
                        $sum:{
                            $cond:[{$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                                 ]
                        }
                    }
                }
            },
            {
                $project:{
                    _id:0,
                    balance:{$subtract:["$totalCredit","$totalDebit"]}
                }
            }
        ])
        if(balancedata.length === 0){
            return 0
        }
        return balancedata[0].balance
}
const Account = mongoose.model("Account", accountSchema)
module.exports = Account