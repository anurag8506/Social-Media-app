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
    },
    token:{
        type:String
    }
})

const AdminSchema=mongoose.model("LoginSchema",loginSchema)
module.exports=AdminSchema