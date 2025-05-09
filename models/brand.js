const mongoose = require('mongoose');

const product_brand_Schema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true
    },
    brand_image: {
        type: String,
        required: true
    },
    brand_id:{
        type: String,
        required: true
    },
});

const Brand= mongoose.model('product_brand', product_brand_Schema);
module.exports=Brand