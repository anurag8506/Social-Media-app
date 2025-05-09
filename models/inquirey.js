const mongoose = require('mongoose');

const contact_Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  website: String,
  projectType: { type: String, required: true },
  services: { type: [String], required: true },
  submittedAt: { type: Date, default: Date.now }
});

const Contact= mongoose.model('product_brand', contact_Schema);
module.exports=Contact