const express = require('express');

const {submitForm} =require("../controller/contactus")
const {ContactForm} =require("../controller/mailController")
const {getAllBlogs,getBlogById}=require("../controller/getBlogsWeb")
const projectController =require("../controller/project_web")
const router = express.Router()

router.post("/contactuspage",submitForm);
router.post("/contactinquerry",ContactForm);
router.get("/blogsFetch",getAllBlogs);
router.get("/blogs/:blogs_id",getBlogById);
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:projects_id', projectController.getProjectById);



module.exports = router
