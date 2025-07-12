const config = require('../validator/config');
const validator = require("../validator/validator");
const UserSchema = require('../schema/user');
const OrderSchema = require('../schema/order');
const axios = require("axios");
const register_user = async(req,fields,files,res)=>{
  try {
    const requiredFields = ["userEmail", "userPassword","username"];
    const requiredFieldsErrro = ["user Email Is Required", "user Password can't be empty","User Name is Required"];
    const validation = validator.check_required_fields(fields, requiredFields);
    if (validation.status) {
      const userEmail = fields.userEmail.toString();
      const userPassword = fields.userPassword.toString();
      const username = fields.username.toString();
            var private_key = config.encrypt(userPassword);
            const CheckclientDetails = await UserSchema.find({user_email:userEmail});
            if(CheckclientDetails.length==0){
              const checkClientUserName = await UserSchema.find({user_name:username});
              if(checkClientUserName.length==0){
              const user_details = {
                user_id: config.getUniqueId(),
                user_name: username,
                user_password: private_key.encryptedData,
                private_key: private_key.iv,
                user_email: userEmail,
                }
                const UserDeatils_res = new UserSchema(user_details);
                var response = await  UserDeatils_res.save();
                if(response._id){
                res.status(200).json({status:true,message:"user Details Saved"});
                }else{
                  res.status(400).json({status:false,message:"Something Went Wrong"});
                }
              }else{
                return res.status(400).json({ status: false,  message: "Username Already Taken" });
              }
            }else{
              return res.status(400).json({ status: false,  message: "User Already Exist" });
            }
    } else {
      return res.status(400).json({ status: false, message:requiredFieldsErrro[validation.key_value] });
    }
  } catch (error) {
    console.log('error',error);
    return res.status(400).json({ status: false, message:"An error occurred while updating the sold status." });
  }
}
const LoginUser = async(req,fields,files,res)=>{
  try {
    const requiredFields = ["userEmail", "userPassword"];
    const requiredFieldsErrro = ["user Email Is Required", "user Password can't be empty"];
    const validation = validator.check_required_fields(fields, requiredFields);
    if (validation.status) {
      const userEmail = fields.userEmail.toString();
      const userPassword = fields.userPassword.toString();
      const CheckUserDetails = await UserSchema.find({user_email:userEmail});
      if(CheckUserDetails.length>0){
        var UserSavedPassword = CheckUserDetails[0].user_password;
        var UserSavedKey = CheckUserDetails[0].private_key;
        UserSavedPassword = config.decrypt(UserSavedPassword,UserSavedKey);
        if(UserSavedPassword==userPassword){
          const tokenData = { user_name: CheckUserDetails[0].user_name,user_id:CheckUserDetails[0].user_id };
          const jwtToken = config.jwtSign(tokenData);
          return res.status(200).json({ status: true, message:"User Login Successfully",userToken:jwtToken,userName:CheckUserDetails[0].user_name });
        }else{
          return res.status(400).json({ status: false, message:"Invalid User Details" });
        }
      }else{
        return res.status(400).json({ status: false, message:"Invalid User Details" });
      }
    } else {
      return res.status(400).json({ status: false, message:requiredFieldsErrro[validation.key_value] });
    }
  } catch (error) {
    console.log('error',error);
    return res.status(400).json({ status: false, message:"An error occurred while updating the sold status." });
  }
}
const GetTokenData = async(req,fields,files,res)=>{
  try {  
    const requiredFields = ["userToken"];
    const validation = validator.check_required_fields(
      fields,
      requiredFields
    );
    if (validation.status) {
    const jwtToken = fields.userToken.toString();
    var jwt_verify = config.jwtVerify(jwtToken);
    if(jwt_verify){
      const user_id = jwt_verify.user_id;
      const user_name = jwt_verify.user_name;
      const user_details_res = await UserSchema.findOne({ user_id: user_id });
      if(user_details_res){
        console.log('user_id',user_id);
        const OrderDetails = await OrderSchema.find({ user_id: user_id,status:"Purchased"});
        var TotalAmount = 0;
        const TotalOrderDetails = await OrderSchema.aggregate([
          {
            $match: {
              status:"Purchased"
            }
          },
          {
            $addFields: {
              TyraToken: { $toDouble: "$TyraToken" } // Convert Amount to a number
            }
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$TyraToken" }
            }
          }
        ]);

console.log('TotalOrderDetails',TotalOrderDetails);
        for(var i=0;i<OrderDetails.length;i++){
          TotalAmount = TotalAmount+parseFloat(OrderDetails[i].TyraToken)
        }
        var rateRes = await axios({url:"https://api.exchangerate-api.com/v4/latest/USD"})
        .then(function (response) {
          return({status:true,data:response.data});
        })
        .catch(function (error) {
          console.log(error);
          return({status:false,data:{}});
        });
        const INRRate = rateRes.data.rates.INR;
        return res.status(200).json({
          status: true,
          TotalAmount:TotalAmount,
          TotalWorth:TotalAmount/INRRate/2,
          TotalWorthAtLaunch:TotalAmount/INRRate,
          lastTransaction:OrderDetails,
          TotalOrderDetails:TotalOrderDetails[0].totalAmount,
          message: `Unathorized Access Try after some time`,
        });
      }else{
        return res.status(400).json({
          status: false,
          message: `Unathorized Access Try after some time`,
        });
      }
    }else{
      return res.status(400).json({
        status: false,
        message: `validation failed Token Expired Try Login Agaian`,
      });
    }
  }else{
    const missingField = requiredFields[validation.key];
    return res.status(400).json({
      status: false,
      message: `Validation failed. Please fill the required field: ${missingField}`,
    });
  }
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).json({
        status: false,
        message: error.message,
    });
  }
}
const MyTransactions = async(req,fields,files,res)=>{
  try {  
    const requiredFields = ["userToken"];
    const validation = validator.check_required_fields(
      fields,
      requiredFields
    );
    if (validation.status) {
    const jwtToken = fields.userToken.toString();
    var jwt_verify = config.jwtVerify(jwtToken);
    if(jwt_verify){
      const user_id = jwt_verify.user_id;
      const user_details_res = await UserSchema.findOne({ user_id: user_id });
      if(user_details_res){
        const OrderDetails = await OrderSchema.find({ user_id: user_id,status:"Purchased"});
        return res.status(200).json({
          status: true,
          lastTransaction:OrderDetails,
          message: `Unathorized Access Try after some time`,
        });
      }else{
        return res.status(400).json({
          status: false,
          message: `Unathorized Access Try after some time`,
        });
      }
    }else{
      return res.status(400).json({
        status: false,
        message: `validation failed Token Expired Try Login Agaian`,
      });
    }
  }else{
    const missingField = requiredFields[validation.key];
    return res.status(400).json({
      status: false,
      message: `Validation failed. Please fill the required field: ${missingField}`,
    });
  }
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).json({
        status: false,
        message: error.message,
    });
  }
}
const LiveTransactions = async(req,fields,files,res)=>{
  try {  
        const OrderDetails = await OrderSchema.find({status:"Purchased"});
        return res.status(200).json({
          status: true,
          lastTransaction:OrderDetails,
          message: `Unathorized Access Try after some time`,
        });
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).json({
        status: false,
        message: error.message,
    });
  }
}
const AllUsers = async(req,fields,files,res)=>{
  try {  
        const UserDetails = await UserSchema.find({});
        return res.status(200).json({
          status: true,
          UserDetails:UserDetails,
          message: `Unathorized Access Try after some time`,
        });
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).json({
        status: false,
        message: error.message,
    });
  }
}
module.exports = {
    register_user,
    LoginUser,
    GetTokenData,
    MyTransactions,
    LiveTransactions,
    AllUsers
};
