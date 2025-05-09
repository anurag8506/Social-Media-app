const express=require('express');
const { fetchProductByID, productByCategory, allProduct, productByBrand, searchProducts } = require('../controller/productController');
const { fetchAllBrand, brandById } = require('../controller/brandController');
const { fetchAllCategory, getCategory, getParantCategory } = require('../controller/categoryController');
const { mainPage } = require('../controller/common');
const { subject, bulkEnquiry, subscribe } = require('../controller/mailController');
const logRequest = require('../middleware/logRequest');
const upload = require('../middleware/multer');
const { uploadImage } = require('../utils/ImageHandler');
const { submitInquiry } = require('../controller/contactus');
const router=express.Router()


router.get('/mainPage',mainPage)

router.get("/products/:category/:limit/:offset",)
router.get("/product/:product_id",fetchProductByID)
router.get("/productByCatgory/:category_id",productByCategory);
router.get("/all-products",allProduct)
router.get("/productByBrand/:brand_id",productByBrand)
router.get("/searchProducts",searchProducts)

router.get("/brand/:brand_id",brandById)
router.get("/brand", fetchAllBrand)

router.get("/category_arrays",fetchAllCategory)
router.get("/category",getCategory)
router.get("/parent-categories",getParantCategory)

router.post('/enquiryEmail',logRequest,upload.none(),bulkEnquiry)
router.post('/emailPage',logRequest,upload.none(), subject)

router.post('/subscribe',upload.none(),subscribe)

router.post("/inquiry", upload.none(),submitInquiry)
module.exports = router;