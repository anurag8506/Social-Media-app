const mongoose = require("mongoose");

const mailQuerySchema = new mongoose.Schema({
  email: { type: String, required: true },
  product_link: { type: String, required: true },
  product_name: { type: String, required: true },
  quantity: { type: String, required: true },
  dimension: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MailQuery", mailQuerySchema);
