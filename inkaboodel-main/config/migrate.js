// Run this script to migrate existing data to the new schema structure
// Save this as a separate file and run it once with Node.js

const mongoose = require('mongoose');
const Category = require('../models/product_category');
require('dotenv').config()

// Connect to your MongoDB
mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const migrateCategories = async () => {
    try {
        const categories = await Category.find();
        for (const category of categories) {    
            if (category.parent_category_id ) {
                console.log(`Before migration:`, category);

                // Use $unset to remove field from DB
                await Category.updateOne(
                    { _id: category._id }, 
                    { $unset: { parent_category_id: 1 } }
                );

                console.log(`Migrated category: ${category.category_name}`);
            }
        }
        
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // mongoose.disconnect();
    }
};
module.exports=migrateCategories
