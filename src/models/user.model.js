const  bcrypt  = require("bcryptjs");
const mongoose  = require("mongoose");


const userSchema = new mongoose.Schema({
        email : {
            type:String,
            required : [true,"Email address is required"],
            trim : true,
            match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
            lowercase : true,
            unique : [true,"Email is already in use"]
        },
        password : {
            required : [true,"Password is required"],
            type : String,
            minlength : [6,"min length is 6"],
            select : false // means it will not come as a response until asked from the database mean not come with user when run uses.findbyid
        },
        name : {
            type : String,
            required : [true,"name is required"]
        }
        
},{timestamps : true})



userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return 
    }
    const  hash = await bcrypt.hash(this.password,10)
    this.password = hash

    return 
})

userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password,this.password)

}
const User =  mongoose.model("User",userSchema)
module.exports = User