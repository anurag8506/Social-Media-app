const express = require('express');
const upload = require('../middleware/multer');
const { signin,registerA } = require('../controller/adminController');
const {uploadImageHandler } =require("../controller/categoryController")
const {createBlog,getAllBlogs,getSingleBlog,deleteBlog,updateBlog,deteImage,editDataFetch  } =require("../controller/add_blogs")
const projectController = require('../controller/project');
const router = express.Router()
router.post("/signin",signin);
router.post("/register",registerA);
router.post("/upload_images",upload.single('file'),uploadImageHandler);
router.post("/add_blog",upload.any('images'),createBlog);
router.get("/blogs",getAllBlogs);
router.get("/blogs/:blogs_id",getSingleBlog);
router.get("/editdatafetch/:blogs_id",editDataFetch );
router.put("/update_blog/:blogs_id",upload.any('images'),updateBlog);
// router.delete('/blogs/:blogs_id', deleteBlog);
// router.put('/blogs/:blogs_id', upload.any('images'), updateBlog );
router.delete('/blogs/:blogs_id/images/:imageName', deteImage);
router.delete('/blogs_delete/:blogs_id', deleteBlog);

// project section

// router.post('/add_projects', upload.any('images'), createProject);
router.post('/add_projects', upload.fields([
  { name: 'companyLogo', maxCount: 1 },
  { name: 'mainBanner', maxCount: 100 },
  { name: 'projectImages', maxCount: 100 },
  { name: 'reviewPersonImage', maxCount: 1 },
  { name: 'teamImages', maxCount: 100 }
]), projectController.createProject);
router.put('/update_project/:projects_id', upload.fields([
  { name: 'companyLogo', maxCount: 1 },
  { name: 'mainBanner', maxCount: 100 },
  { name: 'projectImages', maxCount: 100 },
  { name: 'teamImages', maxCount: 100 },
  { name: 'reviewPersonImage', maxCount: 1 }
]), projectController.updateProject);
router.get("/get_projects",projectController.fetchProjects);
router.get("/get_projectsbyID/:projects_id",projectController.getProjectById);
// router.put("/update_project/:projects_id",projectController.updateProject);
router.delete("/project_delete/:projects_id",projectController.deleteProject);
router.delete('/delete_project_image/:project_id', projectController.deleteImageByIndex);
// end project section



// router.post("/brand",authenticateUser, upload.single("image"), createBrand);
// router.put("/brand/:id", authenticateUser,upload.single("image"), updateBrand);


// router.post("/product", logRequest,authenticateUser, upload.any(),createProduct)



module.exports = router
