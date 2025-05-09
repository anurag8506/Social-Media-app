const { default: mongoose } = require("mongoose");

const loginSchema=new mongoose.Schema({
   name:{
        type:String,
    },
    password:{
        type:String
    },
    email:{
        type:String
    }
})
const AdminSchema=mongoose.model("LoginSchema",loginSchema)
module.exports=AdminSchema