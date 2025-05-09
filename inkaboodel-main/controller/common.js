const Brand = require("../models/brand");
const Category = require("../models/product_category");

module.exports = {
    mainPage: async (req, res) => {
        try {
            const categories = await Category.find();
            
            // Find parent categories (those with parent_category_ids containing only "---")
            const parentCategories = categories.filter(cat => 
                cat.parent_category_ids && 
                cat.parent_category_ids.length === 1 && 
                cat.parent_category_ids[0] === "---"
            );
            
            // Create a map for faster lookups
            const categoryMap = new Map();
            categories.forEach(cat => categoryMap.set(cat.category_id, cat));
            
            // Process the parent categories and their children
            const CategoryArray = parentCategories.map(parentCategory => {
                // Find all child categories that have this parent in their parent_category_ids array
                const childCategories = categories.filter(cat => 
                    cat.parent_category_ids && 
                    cat.parent_category_ids.includes(parentCategory.category_id) &&
                    !cat.parent_category_ids.includes("---") // Exclude parent categories
                );
                
                return {
                    category_id: parentCategory.category_id,
                    category_name: parentCategory.category_name,
                    description: parentCategory.category_description || "",
                    category_image: parentCategory.category_image || "",
                    subCategory: childCategories.map(child => ({
                        category_id: child.category_id,
                        category_name: child.category_name,
                        description: child.category_description || "",
                        category_image: child.category_image || "",
                    })),
                };
            });
            
            const Brands = await Brand.find();
            console.log(CategoryArray,'................................. ')
            res.status(200).json({
                status: true,
                message: "Data fetched Successfully", 
                CategoryArray, 
                Brands 
            });
        } catch (err) {
            console.error('Error fetching category hierarchy:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
}