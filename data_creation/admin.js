const config = require('../validator/config');
const validator = require("../validator/validator");
const UserSchema = require('../schema/user');
const OrderSchema = require('../schema/order');
const axios = require("axios");
// const AdminLogin = async(req,fields,files,res)=>{
//   try {
//     const requiredFields = ["userEmail", "userPassword"];
//     const requiredFieldsErrro = ["user Email Is Required", "user Password can't be empty"];
//     const validation = validator.check_required_fields(fields, requiredFields);
//     if (validation.status) {
//       const userEmail = fields.userEmail.toString();
//       const userPassword = fields.userPassword.toString();
//         var UserSavedPassword = "845a14ef2c22c3d0813a52d917fc1daf";
//         var UserSavedEmail = "admin@tyra.ae";
//         var UserSavedKey = "75bb61e63077c17242b686a05546c5bf";
//         if(UserSavedEmail==userEmail){
//         UserSavedPassword = config.decrypt(UserSavedPassword,UserSavedKey);
//         if(UserSavedPassword==userPassword){
//           const tokenData = { user_name: "Tyra Token",user_id:"1735287293708_qzzg2fclb" };
//           const jwtToken = config.jwtSign(tokenData);
//           return res.status(200).json({ status: true, message:"User Login Successfully",userToken:jwtToken,userName:"Tyra Token" });
//         }else{
//           return res.status(400).json({ status: false, message:"Invalid User Details" });
//         }
//     }else{
//         return res.status(400).json({ status: false, message:"Invalid User Details" });
//     }
//     } else {
//       return res.status(400).json({ status: false, message:requiredFieldsErrro[validation.key_value] });
//     }
//   } catch (error) {
//     console.log('error',error);
//     return res.status(400).json({ status: false, message:"An error occurred while updating the sold status." });
//   }
// }
const AdminLogin = async (req, fields, files, res) => {
  try {
    const requiredFields = ["userEmail", "userPassword"];
    const requiredFieldsError = ["User Email is required", "User Password can't be empty"];
    
    // Validate required fields
    const validation = validator.check_required_fields(fields, requiredFields);
    if (!validation.status) {
      return res.status(400).json({ 
        status: false, 
        message: requiredFieldsError[validation.key_value] 
      });
    }

    const userEmail = fields.userEmail.toString().trim();
    const userPassword = fields.userPassword.toString().trim();

    // Hardcoded admin credentials (in production, store securely in DB)
    const UserSavedEmail = "admin@tyra.ae";
    const encryptedPassword = "845a14ef2c22c3d0813a52d917fc1daf";
    const encryptionKey = "75bb61e63077c17242b686a05546c5bf";

    // Verify email
    if (UserSavedEmail !== userEmail) {
      return res.status(400).json({ 
        status: false, 
        message: "Invalid credentials" 
      });
    }

    // Decrypt and verify password
    const decryptedPassword = config.decrypt(encryptedPassword, encryptionKey);
    if (decryptedPassword !== userPassword) {
      return res.status(400).json({ 
        status: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const tokenData = { 
      user_name: "Tyra Token",
      user_id: "1735287293708_qzzg2fclb",
      role: "admin" 
    };
    
    const jwtToken = config.jwtSign(tokenData);

    return res.status(200).json({ 
      status: true, 
      message: "Login successful",
      userToken: jwtToken,
      userName: "Tyra Token" 
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ 
      status: false, 
      message: "An error occurred during login" 
    });
  }
}
const LiveTransactions = async(req,fields,files,res)=>{
  try {  
        const OrderDetails = await OrderSchema.find({status:"Purchase Pending"});
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
const CompleteTransaction = async(req,fields,files,res)=>{
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
const TotalTokenSold = async(req,fields,files,res)=>{
  try {  
        const TotalTokenSold = await OrderSchema.aggregate([
          {
            $match: { status: "Purchased" } // Filter documents where status is "Purchased"
          },
          {
            $group: {
              _id: null, // We don't need grouping by any specific field
              totalTokens: {
                $sum: { $toInt: "$TyraToken" } // Convert TyraToken to an integer and sum it
              }
            }
          }
        ]);

        return res.status(200).json({
          status: true,
          TotalTokenSold:TotalTokenSold[0],
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
const UpdateTokenTransferStatus = async(req,fields,files,res)=>{
  const order_id = req.params.transacation_id;
  try {  
    const OrderDetails = {
      status:'Purchased',
    }
    const UpdateTokenTransferStatus = await OrderSchema.updateOne({order_id:order_id},{$set:OrderDetails});
    if(UpdateTokenTransferStatus.acknowledged){
      return res.status(200).json({
        status: true,
        message: `Token Transfered`,
      });
    }else{
      return res.status(200).json({
        status: false,
        message: `Something Went Wrong`,
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
module.exports = {
    AdminLogin,
    LiveTransactions,
    CompleteTransaction,
    TotalTokenSold,
    UpdateTokenTransferStatus,
    UpdateTokenTransferStatus
};
