const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Account must be associated with a user"],
        index:true
    },
    status:{
        enum:{values :["ACTIVE","FROZEN","CLOSE"],
            message:"Status must be one of the following: ACTIVE, FROZEN, CLOSE"
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

const Account = mongoose.model("Account", accountSchema)
module.exports = Account