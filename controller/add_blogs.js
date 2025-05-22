const Blogs = require('../models/blogs');
const path = require('path');
const fs = require('fs');
const createBlog = async (req, res) => {
  try {
    const {
      blog_title,
      blog_heading,
      blog_short_description,
      blog_type,
      blog_content
    } = req.body;

    // Get just the filenames from uploaded files
    let imageFilenames = [];
    if (req.files && req.files.length > 0) {
      imageFilenames = req.files.map(file => file.filename);
    }

    // Auto-generate blogs_id like blogs_01, blogs_02, ...
    const lastBlog = await Blogs.findOne().sort({ createdAt: -1 }).lean();
    let newIdNumber = 1;

    if (lastBlog && lastBlog.blogs_id) {
      const lastId = parseInt(lastBlog.blogs_id.split("_")[1]);
      if (!isNaN(lastId)) {
        newIdNumber = lastId + 1;
      }
    }

    const blogs_id = `blogs_${String(newIdNumber).padStart(2, "0")}`;

    const newBlog = new Blogs({
      blogs_id,
      blog_title,
      blog_heading,
      blog_short_description,
      blog_type,
      blog_content,
      images: imageFilenames
    });

    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blogs.findOne({ blogs_id: req.params.blogs_id });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Error fetching blog" });
  }
};

//  edit data fetch
const editDataFetch = async (req, res) => {
  try {
    const blog = await Blogs.findOne({ blogs_id: req.params.blogs_id });
    console.log(req.params.blogs_id  ,"++++++++++++++++++++++++++++++++++++++++++",req.params.blogs_id )
    // if (!blog) {
    //   return res.json({ 
    //     success: false, 
    //     message: "Blog not found" 
    //   });
    // }
    
    return res.json({
      blog: {
        blog_title: blog.blog_title,
        blog_heading: blog.blog_heading,
        blog_short_description: blog.blog_short_description,
        blog_type: blog.blog_type,
        blog_content: blog.blog_content,
        images: blog.images || []
      }
    });
  } catch (err) {
    console.error("Error in editDataFetch:", err);
    return res.json({ 
      success: false, 
      message: "Error fetching blog data", 
      error: err.message 
    });
  }
};
const updateBlog = async (req, res) => {
  try {
    const {
      blog_title,
      blog_heading,
      blog_short_description,
      blog_type,
      blog_content,
      existingImages = []
    } = req.body;

    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    // Parse existingImages if it's a string
    const parsedExistingImages = typeof existingImages === 'string' 
      ? JSON.parse(existingImages) 
      : existingImages;

    // Handle new uploaded files
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => file.filename);
    }

    // ONLY include explicitly uploaded images (existing + new)
    // DO NOT include images from blog content in this array
    const uploadedImages = [
      ...new Set([...parsedExistingImages, ...newImages])
    ];

    const updatedData = {
      blog_title,
      blog_heading,
      blog_short_description,
      blog_type,
      blog_content,  // This contains its own images which will render in the content
      images: uploadedImages  // Only contains explicitly uploaded images
    };

    const updatedBlog = await Blogs.findOneAndUpdate(
      { blogs_id: req.params.blogs_id },
      updatedData,
      { new: true }
    );

    res.json({ 
      success: true,
      message: 'Blog updated successfully', 
      blog: updatedBlog 
    });
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating blog', 
      error: err.message 
    });
  }
};

// Delete Blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blogs.findOneAndDelete({ blogs_id: req.params.blogs_id });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Remove images from file system
    blog.images.forEach((img) => {
      const imgPath = path.join(__dirname, '../public/assets/uploads', img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};
// delete image 
const deteImage = async (req, res) => {
  try {
    const { blogs_id, imageName } = req.params;
    const blog = await Blogs.findOne({ blogs_id });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.images = blog.images.filter(img => img !== imageName);
    await blog.save();

    const imgPath = path.join(__dirname, '../public/assets/uploads', imageName);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting image', error: err.message });
  }
}

module.exports = {
  createBlog,
  getAllBlogs,
  deteImage,
  updateBlog,
  deleteBlog,
  getSingleBlog,
  editDataFetch 
};