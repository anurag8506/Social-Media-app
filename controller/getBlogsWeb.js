
const Blog = require('../models/blogs');

// Get all blogs with pagination and filtering
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Filter by blog type if provided
    if (req.query.category && req.query.category !== 'All') {
      filter.blog_type = req.query.category;
    }
    
    // Search query if provided
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    // Count total documents for pagination
    const totalDocs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    
    // Get blogs with pagination
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      totalPages,
      currentPage: page,
      blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogs_id: req.params.id });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    // Generate a unique blog ID if not provided
    if (!req.body.blogs_id) {
      const count = await Blog.countDocuments();
      req.body.blogs_id = `blogs_${(count + 1).toString().padStart(2, '0')}`;
    }
    
    // Handle image uploads if any
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.filename);
    }
    
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Unable to create blog',
      error: error.message
    });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    // Handle image uploads if any
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.filename);
    }
    
    const blog = await Blog.findOneAndUpdate(
      { blogs_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Unable to update blog',
      error: error.message
    });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ blogs_id: req.params.id });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};