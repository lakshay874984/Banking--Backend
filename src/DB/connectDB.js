const mongoose  = require("mongoose")


const connectDB = async () =>
{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MONGODB CONNECTED : ${process.env.MONGO_URI}`) 
    }
    catch(error){
        console.log("error conncetion to Mongodb :",error.message)
        process.exit(1) // eska mtlb h ki agar hmara server databse se connect nhi h too hmare server ko band krdo kyuki fhir vo hmare resouces ko waste krega 
    }

}

module.exports =  connectDB