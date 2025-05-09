const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const MailQuery = require("../models/mailSchema"); 
require('dotenv').config()
const Newsletter = require("../models/subscribers");


const subscribe = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ message: "Already subscribed" });

    const saved = await Newsletter.create({ email });
    // console.log(process.env.USER,process.env.PASS)
    // Send email
   const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user:process.env.MAIL_EMAIL,
         pass: process.env.MAIL_PASSWORD
       }
     });
 
     const mailOptions = {
       from:process.env.MAIL_EMAIL ,
       to: email,
       subject: `Thank You for Subscribe`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>🎉 Welcome to Inkcaboodle!</h2>
            
          <p>Thanks for subscribing to our newsletter.</p>
          <p>Get ready to receive exciting updates and offers. ❤️</p>
          <br/>
          <p>Cheers,<br/>Team Inkcaboodle</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Subscribed and email sent" });
  } catch (err) {
    console.error("Subscription error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  secureConnection: false,
  tls: {
    rejectUnauthorized: false,
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: "info@inkcaboodle.com",
    pass: process.env.EMAIL_PASS,
  },
});
function getFormattedDate() {
    const date = new Date();
    return date.toISOString().slice(0, 19).replace('T', ' '); 
  }
async function subject(req, res) {
  try {
    const {email,product_link,product_name,quantity,dimension,}=req.body
    const userEmail = email ? email.toString() : "No email provided";
    const productLink = product_link ? product_link.toString() : "No link provided";
    const productName = product_name ? product_name.toString() : "No product name provided";
    const quantities = quantity ? quantity.toString() : "No quantity provided";
    const dimensions = dimension ? dimension.toString() : "No dimension provided";
    console.log(email,)
    
    // Prepare email content
    const emailContent = `

    <div>

    <div>
    <style>
        * {
            box-sizing: border-box;
        }
    
        body {
            margin: 0;
            padding: 0;
        }
    
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }
    
        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }
    
        p {
            line-height: inherit
        }
    
        .desktop_hide,
        .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
        }
    
        .image_block img+div {
            display: none;
        }
    
        sup,
        sub {
            font-size: 75%;
            line-height: 0;
        }
    
        @media (max-width:665px) {
            .desktop_hide table.icons-inner {
                display: inline-block !important;
            }
    
            .icons-inner {
                text-align: center;
            }
    
            .icons-inner td {
                margin: 0 auto;
            }
    
            .mobile_hide {
                display: none;
            }
    
            .row-content {
                width: 100% !important;
            }
    
            .stack .column {
                width: 100%;
                display: block;
            }
    
            .mobile_hide {
                min-height: 0;
                max-height: 0;
                max-width: 0;
                overflow: hidden;
                font-size: 0px;
            }
    
            .desktop_hide,
            .desktop_hide table {
                display: table !important;
                max-height: none !important;
            }
        }
    </style>
    </head>
    <body class="body" style=" background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none; background-repeat: no-repeat; background-size: cover; width: auto; max-width: 100%; overflow-x: hidden; align-items: center;">
    
    <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; " width="100%">
    
    
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
    <table border="0" cellpadding="5" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad">
    <div align="center" class="alignment" style="line-height:10px">
    <div style="max-width: 180px;"><a href="#" style="outline:none" tabindex="-1" target="_blank"><img alt="Logo" height="auto"    src="https://raw.githubusercontent.com/anurag8506/email_temp/refs/heads/main/image%2021.png"style="display: block; height: auto; border: 0; width: 100%;" title="Logo" width="180"/></a></div>
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
    <tr>
    <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
    <div style="color:#B1AED1;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:20px;font-weight:800;letter-spacing:1px;line-height:120%;text-align:center;mso-line-height-alt:24px;">
    <p style="margin: 0; word-break: break-word;">New Website Inquiry Notification</p>
    </div>
    </td>
    </tr>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
    <tr>
    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
    <div style="color:#454562;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:30px;font-weight:600;line-height:120%;text-align:center;mso-line-height-alt:36px;">
    <p style="margin: 0; word-break: break-word;">Notification of New Website Inquiry</p>
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
        <td class="pad" style="width:100%;">
        <div align="center" class="alignment" style="line-height:10px">
        <div style="max-width:250px;"><img alt="" height="auto" src="https://raw.githubusercontent.com/anurag8506/email_temp/refs/heads/main/5118759-removebg-preview%20(1).png" style="display: block; height: auto; border: 0; width: 100%;" title="" width="322.5"/></div>
        </div>
        </td>
        </tr>
    <tr>
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad" style="width:100%;">
    <div align="center" class="alignment" style="line-height:10px">
    <div style="max-width: 645px;"><img alt="Image" height="auto" src="https://github.com/anurag8506/email_temp/blob/main/Top_blu.png?raw=true" style="display: block; height: auto; border: 0; width: 100%;" title="Image" width="645"/></div>
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('images/Background_icons_animated.gif'); background-position: top center; background-repeat: no-repeat;" width="100%">
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #6C63FF; color: #333; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #6C63FF; padding-bottom: 21px; padding-left: 30px; padding-right: 30px; padding-top: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
    <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
    <tr>
    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
    <div style="color:#FFFFFF;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:22px;font-weight:600;letter-spacing:2px;line-height:120%;text-align:left;mso-line-height-alt:26.4px;">
    
    </div>
    </td>
    </tr>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
    <tr>
    <td class="pad" style="padding-left:10px;padding-right:10px;">
    <div style="color:#DADADA;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:14px;font-weight:600;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
    <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${getFormattedDate()} </span></p>
    </div>
    </td>
    </tr>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
    <tr>
    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
    <div style="color:#DADADA;font-family:'Roboto',Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
    <p style="margin: 0; word-break: break-word;"> </p>
    </div>
    </td>
    </tr>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
    
    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
    <div style="color:#FFFFFF;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:left;mso-line-height-alt:21px;">
    
    </div>
    <p style="margin-bottom: 4; color: white;"><strong>Email:</strong> ${userEmail}</p>
    <p style="margin-bottom: 4; color: white;"><strong>Product Name:</strong> ${productName}</p>
    <p style="margin-bottom: 4; color: white;"><strong>Quantity:</strong> ${quantities}</p>
    <p style="margin-bottom: 4; color: white;"><strong>Product Link:</strong> ${productLink}</p>
    <p style="margin-bottom: 4; color: white;"><strong>Dimension:</strong> ${dimensions}</p>
    </div>
    </td>
    </tr>
    </table>
    </td>
    
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad" style="width:100%;">
    <div align="center" class="alignment" style="line-height:10px">
    <div style="max-width: 645px;"><img alt="Image" height="auto" src="https://github.com/anurag8506/email_temp/blob/main/Btm_blu.png?raw=true" style="display: block; height: auto; border: 0; width: 100%;" title="Image" width="645"/></div>
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad">
    <div></div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad">
    <div></div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #333; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
    <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad">
    <div></div>
    </td>
    </tr>
    </table>
    </td>
    <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
    <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad">
    <div></div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad">
    <div></div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tbody>
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
    <tbody>
    <tr>
    <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-left: 25px; padding-right: 25px; padding-top: 35px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
    <tr>
    <td class="pad">
    <div></div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    
    </td>
    </tr>
    </tbody>
    </table>
    </body>
    </div>;
    
    

    `;

   
    const newMailQuery = new MailQuery({
      email: userEmail,
      product_link: productLink,
      product_name: productName,
      quantity: quantities,
      dimension: dimensions,
    });

    await newMailQuery.save();

    const mailOptions = {
      from: "info@inkcaboodle.com",
      to: "info@inkcaboodle.com",
      subject: "Inkcaboodle Contact Us",
      html: emailContent,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        return res.status(500).json({
          status: false,
          message: "Failed to send email",
          error: error.message,
        });
      } else {
        
        return res.status(200).json({
          status: true,
          message: "We will be in touch shortly!",
          data: newMailQuery,
        });
      }
    });
  } catch (error) {
    console.error("Error handling form submission:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while processing the form.",
      error: error.message,
    });
  }
}


async function bulkEnquiry(req,res){
    try {
        const { email, products } = req.body;
        console.log(products)
        const userEmail=email
    if (!email || !products || products.length === 0) {
      return res.status(400).json({ message: "Invalid request data." });
    }
    
    let productDetails = JSON.parse(products).map((product, index) => `
      <tr>
        <td style="margin-bottom: 4; color: white;">""${index + 1}</td>
        <td style="margin-bottom: 4; color: white;"><strong>Product Name:</strong>${product.product_name}</td>
        <td style="margin-bottom: 4; color: white;"><strong>Product Price:</strong>${product.selling_cost}</td>
        <td style="margin-bottom: 4; color: white;"><strong>Product Quantity:</strong>${product.quantity}</td>
        <td style="margin-bottom: 4; color: white;"><strong>Product Variation:</strong>${product.variation.type}: ${product.variation.name}</td>
        <td style="margin-bottom: 4; color: white;"><strong>Product Link:</strong>https://www.inkcaboodle.com/product/${product.product_id}</td>
      </tr>
    `).join("");

        // Prepare email content
        const emailContent = `
    
        <div>
    
        <div>
        <style>
            * {
                box-sizing: border-box;
            }
        
            body {
                margin: 0;
                padding: 0;
            }
        
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
            }
        
            #MessageViewBody a {
                color: inherit;
                text-decoration: none;
            }
        
            p {
                line-height: inherit
            }
        
            .desktop_hide,
            .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
            }
        
            .image_block img+div {
                display: none;
            }
        
            sup,
            sub {
                font-size: 75%;
                line-height: 0;
            }
        
            @media (max-width:665px) {
                .desktop_hide table.icons-inner {
                    display: inline-block !important;
                }
        
                .icons-inner {
                    text-align: center;
                }
        
                .icons-inner td {
                    margin: 0 auto;
                }
        
                .mobile_hide {
                    display: none;
                }
        
                .row-content {
                    width: 100% !important;
                }
        
                .stack .column {
                    width: 100%;
                    display: block;
                }
        
                .mobile_hide {
                    min-height: 0;
                    max-height: 0;
                    max-width: 0;
                    overflow: hidden;
                    font-size: 0px;
                }
        
                .desktop_hide,
                .desktop_hide table {
                    display: table !important;
                    max-height: none !important;
                }
            }
        </style>
        </head>
        <body class="body" style=" background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none; background-repeat: no-repeat; background-size: cover; width: auto; max-width: 100%; overflow-x: hidden; align-items: center;">
        
        <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; " width="100%">
        
        
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="5" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div align="center" class="alignment" style="line-height:10px">
        <div style="max-width: 180px;"><a href="#" style="outline:none" tabindex="-1" target="_blank"><img alt="Logo" height="auto"    src="https://raw.githubusercontent.com/anurag8506/email_temp/refs/heads/main/image%2021.png"style="display: block; height: auto; border: 0; width: 100%;" title="Logo" width="180"/></a></div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
        <div style="color:#B1AED1;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:20px;font-weight:800;letter-spacing:1px;line-height:120%;text-align:center;mso-line-height-alt:24px;">
        <p style="margin: 0; word-break: break-word;">New Website Inquiry Notification</p>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
        <div style="color:#454562;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:30px;font-weight:600;line-height:120%;text-align:center;mso-line-height-alt:36px;">
        <p style="margin: 0; word-break: break-word;">Notification of New Website Inquiry</p>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
            <td class="pad" style="width:100%;">
            <div align="center" class="alignment" style="line-height:10px">
            <div style="max-width:250px;"><img alt="" height="auto" src="https://raw.githubusercontent.com/anurag8506/email_temp/refs/heads/main/5118759-removebg-preview%20(1).png" style="display: block; height: auto; border: 0; width: 100%;" title="" width="322.5"/></div>
            </div>
            </td>
            </tr>
        <tr>
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad" style="width:100%;">
        <div align="center" class="alignment" style="line-height:10px">
        <div style="max-width: 645px;"><img alt="Image" height="auto" src="https://github.com/anurag8506/email_temp/blob/main/Top_blu.png?raw=true" style="display: block; height: auto; border: 0; width: 100%;" title="Image" width="645"/></div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('images/Background_icons_animated.gif'); background-position: top center; background-repeat: no-repeat;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #6C63FF; color: #333; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #6C63FF; padding-bottom: 21px; padding-left: 30px; padding-right: 30px; padding-top: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
        <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
        <div style="color:#FFFFFF;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:22px;font-weight:600;letter-spacing:2px;line-height:120%;text-align:left;mso-line-height-alt:26.4px;">
        
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad" style="padding-left:10px;padding-right:10px;">
        <div style="color:#DADADA;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:14px;font-weight:600;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${getFormattedDate()} </span></p>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
        <div style="color:#DADADA;font-family:'Roboto',Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
        <p style="margin: 0; word-break: break-word;"> </p>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        
        <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
        <div style="color:#FFFFFF;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:left;mso-line-height-alt:21px;">
        
        </div>
        ${productDetails}
    
        </div>
        </td>
        </tr>
        </table>
        </td>
        
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad" style="width:100%;">
        <div align="center" class="alignment" style="line-height:10px">
        <div style="max-width: 645px;"><img alt="Image" height="auto" src="https://github.com/anurag8506/email_temp/blob/main/Btm_blu.png?raw=true" style="display: block; height: auto; border: 0; width: 100%;" title="Image" width="645"/></div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div></div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div></div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #333; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
        <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div></div>
        </td>
        </tr>
        </table>
        </td>
        <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
        <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div></div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div></div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
        <tbody>
        <tr>
        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-left: 25px; padding-right: 25px; padding-top: 35px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div></div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        
        </td>
        </tr>
        </tbody>
        </table>
        </body>
        </div>;
        
        
    
        `;
    
        // Store data in MongoDB
        // const newMailQuery = new MailQuery({
        //   email: userEmail,
        //   product_link: productLink,
        //   product_name: productName,
        //   quantity: quantities,
        //   dimension: dimensions,
        // });
    
        // await newMailQuery.save();
    
        // Send email
        const mailOptions = {
          from: "info@inkcaboodle.com",
          to: "info@inkcaboodle.com",
          subject: "Inkcaboodle Contact Us",
          html: emailContent,
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return res.status(500).json({
              status: false,
              message: "Failed to send email",
              error: error.message,
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "We will be in touch shortly!",
              data: newMailQuery,
            });
          }
        });
      } catch (error) {
        console.error("Error handling form submission:", error);
        return res.status(500).json({
          status: false,
          message: "An error occurred while processing the form.",
          error: error.message,
        });
      }
}
module.exports = { subject,bulkEnquiry,subscribe };






// async function isEmailValid(email) {
//   const result = await deepEmailValidator.validate({
//     email: email,
//     validateMx: true, // Checks for MX records
//     validateTypo: true, // Checks for typos
//     validateDisposable: true, // Filters disposable emails
//     validateSMTP: true, // Checks inbox availability
//   });
  

//   return result;
// }
// async function subject(req, fields, files, res) {
//   const email = "strix.production@yahoo.com";
//   const Useremail = fields.email?.toString() || "No email provided";
//   const name = fields.name?.toString() || "No name provided";
//   const subject = fields.subject?.toString() || "No subject provided";
//   const message = fields.message?.toString() || "No message provided";
//   const phone = fields.phone?.toString() || "No phone provided";

//   function getFormattedDate() {
//     const date = new Date();
//     return date.toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:mm:ss
//   }


//   // Email HTML Content
//   const EmailData = `
//     <div>
// <style>
// 		* {
// 			box-sizing: border-box;
// 		}

// 		body {
// 			margin: 0;
// 			padding: 0;
// 		}

// 		a[x-apple-data-detectors] {
// 			color: inherit !important;
// 			text-decoration: inherit !important;
// 		}

// 		#MessageViewBody a {
// 			color: inherit;
// 			text-decoration: none;
// 		}

// 		p {
// 			line-height: inherit
// 		}

// 		.desktop_hide,
// 		.desktop_hide table {
// 			mso-hide: all;
// 			display: none;
// 			max-height: 0px;
// 			overflow: hidden;
// 		}

// 		.image_block img+div {
// 			display: none;
// 		}

// 		sup,
// 		sub {
// 			font-size: 75%;
// 			line-height: 0;
// 		}

// 		@media (max-width:665px) {
// 			.desktop_hide table.icons-inner {
// 				display: inline-block !important;
// 			}

// 			.icons-inner {
// 				text-align: center;
// 			}

// 			.icons-inner td {
// 				margin: 0 auto;
// 			}

// 			.mobile_hide {
// 				display: none;
// 			}

// 			.row-content {
// 				width: 100% !important;
// 			}

// 			.stack .column {
// 				width: 100%;
// 				display: block;
// 			}

// 			.mobile_hide {
// 				min-height: 0;
// 				max-height: 0;
// 				max-width: 0;
// 				overflow: hidden;
// 				font-size: 0px;
// 			}

// 			.desktop_hide,
// 			.desktop_hide table {
// 				display: table !important;
// 				max-height: none !important;
// 			}
// 		}
// 	</style>
// </head>
// <body class="body" style=" background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none; background-repeat: no-repeat; background-size: cover; width: auto; max-width: 100%; overflow-x: hidden; align-items: center;">

// <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; " width="100%">
 

// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">

// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="5" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad">
// <div align="center" class="alignment" style="line-height:10px">
// <div style="max-width: 180px;"><a href="#" style="outline:none" tabindex="-1" target="_blank"><img alt="Logo" height="auto"    src="https://github.com/anurag8506/email_temp/blob/main/logo-strix.png?raw=true"style="display: block; height: auto; border: 0; width: 100%;" title="Logo" width="180"/></a></div>
// </div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
// <div style="color:#B1AED1;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:20px;font-weight:800;letter-spacing:1px;line-height:120%;text-align:center;mso-line-height-alt:24px;">
// <p style="margin: 0; word-break: break-word;">New Website Inquiry Notification</p>
// </div>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
// <div style="color:#454562;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:30px;font-weight:600;line-height:120%;text-align:center;mso-line-height-alt:36px;">
// <p style="margin: 0; word-break: break-word;">Notification of New Website Inquiry</p>
// </div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
//     <tr>
//         <td class="pad" style="width:100%;">
//         <div align="center" class="alignment" style="line-height:10px">
//         <div style="max-width:250px;"><img alt="" height="auto" src="https://raw.githubusercontent.com/anurag8506/email_temp/refs/heads/main/5118759-removebg-preview%20(1).png" style="display: block; height: auto; border: 0; width: 100%;" title="" width="322.5"/></div>
//         </div>
//         </td>
//         </tr>
//     <tr>
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad" style="width:100%;">
// <div align="center" class="alignment" style="line-height:10px">
// <div style="max-width: 645px;"><img alt="Image" height="auto" src="https://github.com/anurag8506/email_temp/blob/main/Top_blu.png?raw=true" style="display: block; height: auto; border: 0; width: 100%;" title="Image" width="645"/></div>
// </div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('images/Background_icons_animated.gif'); background-position: top center; background-repeat: no-repeat;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #6C63FF; color: #333; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #6C63FF; padding-bottom: 21px; padding-left: 30px; padding-right: 30px; padding-top: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
// <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
// <div style="color:#FFFFFF;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:22px;font-weight:600;letter-spacing:2px;line-height:120%;text-align:left;mso-line-height-alt:26.4px;">
// <p style="margin: 0; word-break: break-word;"><strong><span style="word-break: break-word;">${subject}</span></strong></p>
// </div>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-left:10px;padding-right:10px;">
// <div style="color:#DADADA;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:14px;font-weight:600;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
// <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${getFormattedDate()} </span></p>
// </div>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
// <div style="color:#DADADA;font-family:'Roboto',Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
// <p style="margin: 0; word-break: break-word;"> </p>
// </div>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">

// <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
// <div style="color:#FFFFFF;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:left;mso-line-height-alt:21px;">
// <p style="margin: 0;"><strong>Name:</strong>${name}</p>
// <p style="margin: 0;"><strong>Email:</strong>  ${Useremail}</p>
// <p style="margin: 0;"><strong></strong>  ${phone}</p>
// <p style="margin: 0;"><strong></strong><br/>${message}</p>
// </div>
// </td>
// </tr>
// </table>
// </td>

// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad" style="width:100%;">
// <div align="center" class="alignment" style="line-height:10px">
// <div style="max-width: 645px;"><img alt="Image" height="auto" src="https://github.com/anurag8506/email_temp/blob/main/Btm_blu.png?raw=true" style="display: block; height: auto; border: 0; width: 100%;" title="Image" width="645"/></div>
// </div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad">
// <div></div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad">
// <div></div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; color: #333; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
// <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad">
// <div></div>
// </td>
// </tr>
// </table>
// </td>
// <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
// <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad">
// <div></div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad">
// <div></div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 645px; margin: 0 auto;" width="645">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-left: 25px; padding-right: 25px; padding-top: 35px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad">
// <div></div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>

// </td>
// </tr>
// </tbody>
// </table>
// </body>
//     </div>`;

//   try {
//     // Validate Email Address
//     // const validationResult = await isEmailValid(Useremail);
//     // if (!validationResult.valid) {
//     //   return res.status(400).json({
//     //     status: false,
//     //     message: `Invalid email: ${validationResult.reason || "Unknown reason"}`,
//     //   });
//     // }

//     // Save Contact Details to Database
//     const EmailDataContent = {
//       email: Useremail,
//       name: name,
//       subject: subject,
//       message: message,
//     }
//     const newContact = new Contact(EmailDataContent);
//     sendFormData(Useremail,EmailDataContent)

//     await newContact.save();

//     // Email Options
//     const mailOptions = {
//       from: email,
//       to: email,
//       subject: "Strixproduction Contact Us",
//       html: EmailData,
//     };

//     // Send Email
//     const sendEmail = () => {
//       return new Promise((resolve, reject) => {
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             reject(error);
//           } else {
//             resolve(info);
//           }
//         });
//       });
//     };

//     await sendEmail();

//     return res.status(200).json({
//       status: true,
//       message: "We will be in touch shortly.",
//     });
//   } catch (error) {
//     console.error("Error:", error.message);
//     return res.status(500).json({
//       status: false,
//       message: "Something went wrong while processing your request.",
//     });
//   }
// }
// async function sendFormData(email,content) {
//     console.log('content',content,email);
//     const url = 'http://3.6.58.31:8000/api/sendEmail/StrixProduction';
//     const formData = {
//       email:email,
//       emailData:JSON.stringify(content),
//     };
  
//     try {
//       const response = await axios.post(url, qs.stringify(formData), {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       });
//       console.log('Response:', response.data);
//     } catch (error) {
//       console.error('Error making the POST request:', error.message);
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//       }
//     }
//   }