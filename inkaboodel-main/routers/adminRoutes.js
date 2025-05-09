const express = require('express');
const { fetchAllBrand, createBrand, updateBrand, deleteBrand } = require('../controller/brandController');
const { fetchCategoryById, fetchAllCategory, createCategory, updateCategory, deleteCategory } = require('../controller/categoryController');
const logRequest = require('../middleware/logRequest');
const upload = require('../middleware/multer');
const { createProduct,DeleteImage, updateProduct, deleteProduct } = require('../controller/productController');
const { signin, getAdminDetails, logoutAdmin } = require('../controller/adminController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router()

 

router.post("/signin",signin)
router.get('/fetchAdmin',authenticateUser,getAdminDetails)
router.post("/logout",logoutAdmin)


router.get("/brand", fetchAllBrand)
router.post("/brand",authenticateUser, upload.single("image"), createBrand);
router.put("/brand/:id", authenticateUser,upload.single("image"), updateBrand);
router.delete("/brand/:id",authenticateUser, deleteBrand);

router.get("/category/:category_id",authenticateUser, fetchCategoryById)
router.get("/category/",authenticateUser, fetchAllCategory)
router.post("/category", logRequest,authenticateUser, upload.single("image"), createCategory);
router.put("/category/:id", logRequest,authenticateUser, upload.single("image"), updateCategory);
router.delete("/category/:id", logRequest,authenticateUser, deleteCategory);

router.post("/product", logRequest,authenticateUser, upload.any(),createProduct)
router.post("/product/delete-image",logRequest,authenticateUser,DeleteImage)
router.put("/product/:product_id",logRequest,authenticateUser, upload.any(),updateProduct)
router.delete("/product/:product_id",deleteProduct)


module.exports = router
