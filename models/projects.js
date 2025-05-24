// models/projectModel.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  companyName: { type: String, required: false },
  projects_id: { type: String, required: false },
  projectName: { type: String, required: false },
  projectLink: { type: String, required: false },
  projectType: { type: String},
  companyLogo: { type: String, required: false },
  mainBanner: { type: [String], required: false }, // Changed to array
  projectImages: { type: [String], required: false }, // New field
  shortDescription: { type: String, required: false },
  description: { type: String, required: false },
  mainDescription: { type: String, required: false },
  reviewText: { type: String, required: false },
  reviewPersonName: { type: String, required: false },
  reviewPersonImage: { type: String, required: false },
  projectTeamMembers: { type: [String], required: false },
  teamImages: { type: [String], required: false }, // Changed to array
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);