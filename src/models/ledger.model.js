const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Ledger entry must be associated with an account"],
        index: true,
        immutable: true
    },
    amount:{
        type: Number,
        required: [true, "Ledger entry amount is required"],
        min: [1, "Ledger entry amount must be greater than 0"]
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Ledger entry must be associated with a transaction"],
        index: true,
        immutable: true
    },
    type:{
        type: String,
        enum: { values: ["CREDIT", "DEBIT"],
            message: "Ledger entry type must be either CREDIT or DEBIT"
        },
        required: [true, "Ledger entry type is required"]
    }
})


function preventLedgerModification(){
    throw new Error("Ledger entries cannot be modified or deleted")
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification)
ledgerSchema.pre("findOneAndDelete", preventLedgerModification)
ledgerSchema.pre("updateOne", preventLedgerModification)
ledgerSchema.pre("deleteOne", preventLedgerModification)
ledgerSchema.pre("updateMany", preventLedgerModification)
ledgerSchema.pre("deleteMany", preventLedgerModification)
ledgerSchema.pre("findOneAndRemove", preventLedgerModification)
ledgerSchema.pre("remove", preventLedgerModification)
ledgerSchema.pre("findOneAndReplace", preventLedgerModification)



const Ledger = mongoose.model("Ledger", ledgerSchema)

module.exports = Ledger