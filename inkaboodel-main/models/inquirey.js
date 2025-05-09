const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  state: String,
  address: String,
  message: String,
  purpose: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('inquiry', inquirySchema);
