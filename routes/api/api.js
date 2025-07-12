var express = require("express");
const formidable = require("formidable");
const config = require("../../validator/config");
const DataCreationOrder = require("../../data_creation/orders");
const DataCreationUser = require("../../data_creation/users");
const DataCreationAdmin = require("../../data_creation/admin");

    const router = express.Router();
    router.post("/generateOrderId", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationOrder.GenerateOrderId(req,fields,files,res);
            }
        })
    });
    router.post("/register_user", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationUser.register_user(req,fields,files,res);
            }
        })
    });
    router.post("/LoginUser", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationUser.LoginUser(req,fields,files,res);
            }
        })
    });
    router.post("/userToken", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationUser.GetTokenData(req,fields,files,res);
            }
        })
    });
    router.post("/userTransactions", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationUser.MyTransactions(req,fields,files,res);
            }
        })
    });
    router.post("/LiveTransactions", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationUser.LiveTransactions(req,fields,files,res);
            }
        })
    });
    router.post("/updateStatus", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationOrder.updateStatus(req,fields,files,res);
            }
        })
    });
    router.post("/AdminLoginUser", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationAdmin.AdminLogin(req,fields,files,res);
            }
        })
    });
    router.get("/allTransaction", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationAdmin.LiveTransactions(req,fields,files,res);
            }
        })
    });
    router.get("/CompleteTransaction", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationAdmin.CompleteTransaction(req,fields,files,res);
            }
        })
    });
    router.get("/totalTokenSold", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationAdmin.TotalTokenSold(req,fields,files,res);
            }
        })
    });
    router.get("/allUsers", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationUser.AllUsers(req,fields,files,res);
            }
        })
    });
    router.get("/UpdateTokenTransferStatus/:transacation_id", (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.log('MOMO Alert Something Went Wrong');
            }else{
                DataCreationAdmin.UpdateTokenTransferStatus(req,fields,files,res);
            }
        })
    });

module.exports = router
