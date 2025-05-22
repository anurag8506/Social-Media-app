const mongoose = require('mongoose');

const blogs_Schema = new mongoose.Schema({
  blog_title: {
    type: String,
  },
  blogs_id: {
    type: String,
  },
  blog_heading: {
    type: String,
  },
  blog_short_description: {
    type: String,
  },
  blog_type: {
    type: String,
  },
  blog_content: { 
    type: String,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Blogs = mongoose.model('Blogs', blogs_Schema); // Changed to 'Blogs' to match content
module.exports = Blogs;