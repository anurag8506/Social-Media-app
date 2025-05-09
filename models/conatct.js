const mongoose = require('mongoose');

const contactus_Schema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },

  email: { type: String, required: true },

  submittedAt: { type: Date, default: Date.now }
});

const Contactus= mongoose.model('conatctus', contactus_Schema);
module.exports=Contactus