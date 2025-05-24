const mongoose = require('mongoose');

const variationValueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
       type:String
    }],
    dimension_length:{
        type: String,
        required: false
    },
    dimension_width:{
        type: String,
        required: false
    },
    dimension_height:{
        type: String,
        required: false
    },
    pages:{
        type:String,
    },
    initial_cost:{
        type: String,
        required: false
    },
    selling_cost:{
        type: String,
        required: false
    },
});

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    product_name: {
        type: String,
        required: false
    },
    product_short_description: {
        type: String,
        required: false
    },
    product_description: {
        type: String,
        required: false
    },
    product_additional_details: {
        type: String
    },
    base_price: {
        type: Number,
        required: false
    },
    currency: {
        type: String,
        required: true,
        default: 'INR'
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    tags: [String],
    status: {
        type: String,

        default: 'draft'
    },
    variations: {
        color: [variationValueSchema],
        weight: [variationValueSchema],
        size: [variationValueSchema]
    },    
    meta: {
        title: String,
        keywords: [String],
        description: String
    },
    
    trending_count: {
        type: Number,
        default: 0
    },
    countryOfOrigin:{
        type:String
    },
    CountryOfManufacturing:{
        type:String
    }
}, { timestamps: true });

productSchema.index({ product_id: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ trending_count: -1 });

const Product= mongoose.model('Product', productSchema);
module.exports = Product