// var nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({    
//   service: 'gmail', // This specifies Gmail (also works for Google Workspace)
// host: "smtp.gmail.com", // Google's SMTP server
//   secure: true,
//   secureConnection: false, // TLS requires secureConnection to be false
//   tls: {
//     rejectUnauthorized: false
//   },
//   requireTLS:true,
//   port: 465,
//   debug: true,
//   auth: {
//       user: "hello@cloudessentials.co",
//       pass: "bpjggsojhtnwwrek" 
//   }
// });
const config = require('../validator/config');
const validator = require("../validator/validator");
const OrderSchema = require('../schema/order');
const axios = require('axios');
async function sendRetailerForm(req,fields,files,res) {
    const email = "hellocloudessentials@gmail.com";
const Useremail = fields.email.toString();
const name = fields.email.toString();
const storeName = fields.email.toString();
const address = fields.email.toString();
const bussinessWebiste = fields.email.toString();
const socialMediaLink = fields.email.toString();
const InterestedInProdiuct = fields.email.toString();
const HearAbout = fields.email.toString();
const EmailData = `<div>
<h1>Email:`+Useremail+`<h1>
<h1>What is your name:`+name+`<h1>
<h1>What is the name of your store:`+storeName+`<h1>
<h1>What is your store's address:`+address+`<h1>
<h1>What is your business website:`+bussinessWebiste+`<h1>
<h1>Please list any social media links for your business:`+socialMediaLink+`<h1>
<h1>Which products are you most interested in carrying:`+InterestedInProdiuct+`<h1>
<h1>How did you hear about Cloud Essentials:`+HearAbout+`<h1>
</div>`;

  try {
    var mailOptions = {
        from: 'hello@cloudessentials.co',
        to: email,
        subject: 'Cloud Essentials stockist application',
         html: EmailData,
      }
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(200).json({
                status: false,
                message: "Something Went Wrong 3",
              });
        } else {
          res.status(400).json({
            status: false,
            capture: false,
            message: "We Will be in touch shortly",
          });
        }
      }); 
  } catch (error) {
    console.log(error);
  }
}
async function GenerateOrderId(req,fields,files,res) {
  try {
    const crypto = fields.cryptoValue.toString();
    const AmountValue = fields.AmountValue.toString();
    const AddressValue = fields.AddressValue.toString();
    const OrderId = config.generate_Unique_id();
    let CryptoValue = "";
    let CryptoQrImg = "";
    let CryptoAddress = "";
    let response = null;
        var jwt_verify = config.jwtVerify(AddressValue);
new Promise(async (resolve, reject) => {
  try {
    response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': 'aaeb0be3-92a2-4483-8b8a-546bf5fd2974',
      },
    });
  } catch(ex) {
    response = null;
    // error
    console.log(ex);
    reject(ex);
  }
  if (response) {
    const ResponseData = response.data.data;
    let Bitcoin = "";
    let Ethereum = "";
    let USDT = "";
    let BNB = "";
    let Solana = "";
    for(var i=0;i<ResponseData.length;i++){
      if(ResponseData[i].name=="Bitcoin"){
        Bitcoin = ResponseData[i].quote.USD.price;
      }else if(ResponseData[i].name=="Ethereum"){
        Ethereum = ResponseData[i].quote.USD.price;
      }else if(ResponseData[i].name=="Tether USDt"){
        USDT = ResponseData[i].quote.USD.price;
      }else if(ResponseData[i].name=="BNB"){
        BNB = ResponseData[i].quote.USD.price;
      }else if(ResponseData[i].name=="Solana"){
        Solana = ResponseData[i].quote.USD.price;
      }
    }
    if(crypto=="Solana"){
      CryptoValue = Solana;
      CryptoQrImg = "/images/solanaTrustQr.jpeg";
      CryptoAddress = "8TGdU7MStAsd3EFjsjhbaLTzQhudegM51uiZTYZxt77q";
    }else if(crypto=="Binance"){
      CryptoValue = BNB
      CryptoQrImg = "/images/BNBTrustQr.jpeg";
      CryptoAddress = "0x50Ec183b761B090A12bad8C18593Fd36b1f8E5eb";
    }else if(crypto=="Ethereum"){
      CryptoValue = Ethereum
      CryptoQrImg = "/images/ETHTrustQr.jpeg";
      CryptoAddress = "0x50Ec183b761B090A12bad8C18593Fd36b1f8E5eb";
    }else if(crypto=="Bitcoin"){
      CryptoValue = Bitcoin
      CryptoQrImg = "/images/solanaTrustQr.jpeg";
      CryptoAddress = "bc1q5hfgpeflqh3lr7z8qdk53kctqzfhcrwhatt7ux";
    }else if(crypto=="Tether"){
      CryptoValue = USDT
      CryptoQrImg = "/images/USDTTrustQr.jpeg";
      CryptoAddress = "0x50Ec183b761B090A12bad8C18593Fd36b1f8E5eb";
    }
    CryptoValue = parseFloat(AmountValue)/parseFloat(CryptoValue);
            var rateRes = await axios({url:"https://api.exchangerate-api.com/v4/latest/USD"})
            .then(function (response) {
              return({status:true,data:response.data});
            })
            .catch(function (error) {
              console.log(error);
              return({status:false,data:{}});
            });
            const INRRate = rateRes.data.rates.INR;
            const valueInInr = INRRate * parseFloat(AmountValue);
            const TyraValueCalculated = Math.floor(valueInInr / 2);
const orderDetails = {
  user_id:jwt_verify.user_id,
  order_id:OrderId,
  transactionId:config.getUniqueId(),
  WalletAddress:jwt_verify.user_id,
  TyraToken:TyraValueCalculated,
  Crypto:crypto,
  CryptoValue:CryptoValue,
  Amount:AmountValue,
  status:"Purchase Pending",
}
    let OrderDetailsRes = new OrderSchema(orderDetails);
    OrderDetailsRes = await OrderDetailsRes.save();
    if(OrderDetailsRes._id){
      res.status(200).json({status:true,message:"Order Generated",OrderId:OrderId,CryptoValue:CryptoValue,CryptoQrImg:CryptoQrImg,CryptoAddress:CryptoAddress});
    }else{
      res.status(400).json({status:false,message:"Something Went Wrong"});
    }
  }
});
  } catch (error) {
    console.log(error);
  }
}
async function updateStatus(req,fields,files,res) {
  try {
    const TransactionId = fields.TransactionId.toString();
    const OrderId = fields.OrderId.toString();
    const AddressValue = fields.AddressValue.toString();
    console.log('AddressValue',AddressValue);
        var jwt_verify = config.jwtVerify(AddressValue);
const orderDetails = {
  user_id:jwt_verify.user_id,
  order_id:OrderId,
}
    let OrderDetailsRes = await OrderSchema.updateOne(orderDetails,{$set:{transactionId:TransactionId}});
    console.log('OrderDetailsRes',OrderDetailsRes);
    if(OrderDetailsRes.acknowledged){
      res.status(200).json({status:true,message:"Order Transaction Saved Waiting For Approval"});
    }else{
      res.status(400).json({status:false,message:"Something Went Wrong"});
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
    sendRetailerForm,
    GenerateOrderId,
    updateStatus
};
