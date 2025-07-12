var express = require("express");
const formidable = require("formidable");
const config = require("../../validator/config");
const DataCreationOrder = require("../../data_creation/orders");
const DataCreationUser = require("../../data_creation/users");

    const router = express.Router();
    router.get("/", (req, res) => {
        res.status(200).json({status:true,message:"Api is Online"});
    });

module.exports = router
