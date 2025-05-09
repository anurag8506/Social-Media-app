const express = require('express');

const {submitForm} =require("../controller/contactus")
const {ContactForm} =require("../controller/mailController")
const router = express.Router()

router.post("/contactuspage",submitForm);
router.post("/contactinquerry",ContactForm);




module.exports = router
