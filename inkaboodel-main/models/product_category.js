const mongoose = require('mongoose');

const product_catgeory_Schema = new mongoose.Schema({
    category_description: {
        type: String,
        required: true
    },
    category_name: {
        type: String,
        required: true
    },
    category_image: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    parent_category_id:{
        type:String
    },
    // Change from single string to array of strings
    parent_category_ids: {
        type: [String],
        default: []
    }
});

const Category = mongoose.model('product_category', product_catgeory_Schema);
module.exports = Category;