const express = require('express');



const upload = require('../middleware/multer');

const { signin,registerA } = require('../controller/adminController');

const {uploadImageHandler } =require("../controller/categoryController")

const router = express.Router()

 

router.post("/signin",signin);
router.post("/register",registerA);
router.post("/upload_images",upload.single('file'),uploadImageHandler);

// router.post("/brand",authenticateUser, upload.single("image"), createBrand);
// router.put("/brand/:id", authenticateUser,upload.single("image"), updateBrand);


// router.post("/product", logRequest,authenticateUser, upload.any(),createProduct)



module.exports = router
