const Brand = require("../models/brand");
const { generate_randome_id } = require("../utils/config");
const fs = require("fs");
const path=require('path')


module.exports = {
    fetchAllBrand: async (req, res) => {
        try {
            const brands = await Brand.find();

            if (!brands || brands.length === 0) {
                return res.status(404).json({ message: "No brands found" });
            }

            res.status(200).json({ brands });
        } catch (err) {
            console.error("Error fetching brands:", err);

            if (err.name === "MongoNetworkError") {
                return res.status(503).json({ message: "Database connection error" });
            }

            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    createBrand: async (req, res) => {
        try {
            const { brand_name } = req.body;
            const file = req.file;

            if (!brand_name) {
                return res.status(400).json({status:false, message: "Brand name is required" });
            }

            const brand_id = generate_randome_id()

            const brand_image =  req.file.filename 

            if (!brand_image) {
                return res.status(400).json({status:false, message: "Brand image upload failed" });
            }
            const newBrand = new Brand({
                brand_name,
                brand_image, 




                
                brand_id,
            });

            await newBrand.save();

            res.status(201).json({status:true, message: "Brand uploaded successfully", brand: newBrand });
        } catch (err) {
            console.error("Error uploading brand:", err);

            res.status(500).json({ message: "Internal Server Error" });
        }
    },
   updateBrand : async (req, res) => {
        try {
            const { brand_name } = req.body;
            const { id } = req.params; 
            const file = req.file;
    
            const brand = await Brand.findOne({brand_id:id});
            if (!brand) {
                return res.status(404).json({ message: "Brand not found" });
            }
    
            const brand_image = req.file ? req.file.filename : brand.brand_image;
    
            brand.brand_name = brand_name || brand.brand_name;
            brand.brand_image = brand_image;
    
            await brand.save();
    
            res.status(200).json({ message: "Brand updated successfully", brand });
        } catch (err) {
            console.error("Error updating brand:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },   
   deleteBrand : async (req, res) => {
        try {
            const { id } = req.params; 
    
            const brand = await Brand.findOne({brand_id:id});
            if (!brand) {
                return res.status(404).json({ message: "Brand not found" });
            }
                const imagePath = path.join(__dirname, "../public/assets/uploads/", brand.brand_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
    
            await Brand.findByIdAndDelete(brand._id);
    
            res.status(200).json({ message: "Brand deleted successfully" });
        } catch (err) {
            console.error("Error deleting brand:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    brandById:async(req,res)=>{
        try {
            const {brand_id}=req.params
            const brands = await Brand.findOne({brand_id:brand_id});

            if (!brands || brands.length === 0) {
                return res.status(404).json({ message: "No brands found" });
            }

            res.status(200).json({ brands });
        } catch (err) {
            console.error("Error fetching brands:", err);

            if (err.name === "MongoNetworkError") {
                return res.status(503).json({ message: "Database connection error" });
            }

            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
