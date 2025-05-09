const fs = require("fs");
const Category = require("../models/product_category");
const { uploadImage } = require("../utils/ImageHandler");
const path = require('path');
const { generate_randome_id } = require("../utils/config");

module.exports = {
    fetchCategoryById: async (req, res) => {
        try {
            const category_id = req.params.category_id
            const category = await Category.findOne({ category_id });
            if (category) {
                return res.status(404).json({ message: "No Category found" });
            }
            res.status(200).json({ status: true, message: "Category Data", category });
        } catch (err) {
            console.error('Error fetching Brand', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    fetchAllCategory: async (req, res) => {
        try {
            // Fetch all categories
            const allCategories = await Category.find({});

            // Create a map for quick lookup
            const categoryMap = {};
            allCategories.forEach(cat => {
                categoryMap[cat.category_id] = {
                    category_id: cat.category_id,
                    category_name: cat.category_name,
                    description: cat.category_description || "",
                    category_image: cat.category_image || "",
                };
            });

            // Find root categories (no parents or only "---" as parent)
            const rootCategories = allCategories.filter(cat =>
                cat.parent_category_ids.length === 0 ||
                (cat.parent_category_ids.length === 1 && cat.parent_category_ids[0] === "---")
            );

            // Build parent-child relationships map
            const childrenMap = {};
            allCategories.forEach(cat => {
                cat.parent_category_ids.forEach(parentId => {
                    if (parentId !== "---") {
                        if (!childrenMap[parentId]) {
                            childrenMap[parentId] = [];
                        }
                        childrenMap[parentId].push(cat.category_id);
                    }
                });
            });

            // Function to build category hierarchy without getting stuck in cycles
            const buildCategoryTree = (categoryId, visitedIds = new Set()) => {
                // Prevent infinite recursion due to circular references
                if (visitedIds.has(categoryId)) {
                    return null;
                }

                const category = categoryMap[categoryId];
                if (!category) return null;

                // Mark this category as visited for this branch
                const newVisitedIds = new Set(visitedIds);
                newVisitedIds.add(categoryId);

                // Get children for this category
                const children = childrenMap[categoryId] || [];

                // Build the category object with its children
                return {
                    category_id: category.category_id,
                    category_name: category.category_name,
                    description: category.description,
                    category_image: category.category_image,
                    subCategory: children
                        .map(childId => buildCategoryTree(childId, newVisitedIds))
                        .filter(Boolean) // Remove null entries
                };
            };

            // Build the final category array starting from root categories
            const CategoryArray = rootCategories.map(root =>
                buildCategoryTree(root.category_id, new Set())
            );

            res.status(200).json({ CategoryArray });
        } catch (err) {
            console.error('Error fetching category hierarchy:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    createCategory: async (req, res) => {
        try {
            console.log(req.file);
            console.log(req.body, 'add category data ..............................')
            const { name, description } = req.body;
            const parents = req.body.parents || [];

            const parentIds = Array.isArray(parents) ? parents : [parents].filter(p => p && p !== "---");

            if (!name || !description) {
                return res.status(400).json({ message: "Name and description are required" });
            }

            const category_image = req.file ? req.file.filename : null;
            if (!category_image) {
                return res.status(400).json({ message: "Image is required" });
            }
            console.log(parentIds, '----------------------------------------------')
            const newCategory = new Category({
                category_name: name,
                category_description: description,
                category_image,
                category_id: generate_randome_id(),
                // Use the array of parent IDs
                parent_category_ids: parentIds.length > 0 ? parentIds : ["---"]
            });

            await newCategory.save();

            res.status(201).json({
                message: "Category created successfully",
                category: newCategory
            });
        } catch (err) {
            console.error("Error creating category:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { name, description } = req.body;
            const { id } = req.params;

            const parents = req.body.parents|| [];
            console.log(req.body,'111111111111111111111111111111')
            // Handle both single parent and array of parents
            const parentIds = Array.isArray(parents) ? parents : [parents].filter(p => p && p !== "---");

            const category = await Category.findOne({ category_id: id });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            const category_image = req.file ? req.file.filename : category.category_image;

            // Update category fields
            category.category_name = name || category.category_name;
            category.category_description = description || category.category_description;
            category.category_image = category_image;

            // Update parent IDs array
            category.parent_category_ids = parentIds.length > 0 ? parentIds : category.parent_category_ids;
            console.log(category,'////////////////////////')
            await category.save();

            res.status(200).json({
                message: "Category updated successfully",
                category
            });
        } catch (err) {
            console.error("Error updating category:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getCategoryWithParents: async (req, res) => {
        try {
            const { id } = req.params;

            const category = await Category.findOne({ category_id: id });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            // Get parent category details
            const parentCategories = await Category.find({
                category_id: { $in: category.parent_category_ids }
            }).select('category_id category_name');

            res.status(200).json({
                category,
                parents: parentCategories
            });
        } catch (err) {
            console.error("Error fetching category:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find();

            // Format the categories for frontend consumption
            const formattedCategories = await Promise.all(categories.map(async (cat) => {
                let parents = [];

                if (cat.parent_category_ids && cat.parent_category_ids.length > 0 && cat.parent_category_ids[0] !== "---") {
                    parents = await Category.find({
                        category_id: { $in: cat.parent_category_ids }
                    }).select('category_id category_name');
                }

                return {
                    id: cat.category_id,
                    name: cat.category_name,
                    description: cat.category_description,
                    image: cat.category_image,
                    type: cat.parent_category_ids[0] === "---" ? "Parent" :
                        (parents.length > 0 && parents[0].parent_category_ids &&
                            parents[0].parent_category_ids[0] !== "---") ? "Grandchild" : "Child",
                    parents: parents.map(p => ({ id: p.category_id, name: p.category_name }))
                };
            }));

            res.status(200).json({ categories: formattedCategories });
        } catch (err) {
            console.error("Error fetching categories:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;

            const category = await Category.findOne({ category_id: id });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            const imagePath = path.join(__dirname, "../public/assets/uploads/", category.category_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            await Category.findByIdAndDelete(category._id);

            res.status(200).json({ message: "Category deleted successfully" });
        } catch (err) {
            console.error("Error deleting category:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getParantCategory: async (req, res) => {
        try {
          const category = await Category.find({ parent_category_ids: { $in: ['---'] } }).select('category_name category_id')
            console.log(category,'--------')
          if (!category || category.length === 0) {
            return res.status(404).json({ message: "No Category found" });
          }
      
          res.status(200).json({ status: true, message: "Category Data", category });
        } catch (err) {
          console.error('Error fetching Category:', err);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      },
      
    getCategory: async (req, res) => {
        try {
            const category = await Category.find();
            if (!category) {
                return res.status(404).json({ message: "No Category found" });
            }
            res.status(200).json({ status: true, message: "Category Data", category });
        } catch (err) {
            console.error('Error fetching Brand', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

}




