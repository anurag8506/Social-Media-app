const generateProductId = require("../utils/generateProductId");
const fs = require("fs");
const path = require("path");
const Product = require("../models/productSchema");
const Brand = require("../models/brand");
const categoryController = require("./categoryController");

module.exports = {
    fetchProductByID: async (req, res) => {
        try {
            const product_id = req.params.product_id;
            console.log(product_id, '....................');

            const products = await Product.aggregate([
                {
                    $match: { product_id: product_id }
                },
                {
                    $addFields: {
                        product_category_id: { $arrayElemAt: [{ $split: ["$product_category", ","] }, 0] }
                    }
                },
                {
                    $lookup: {
                        from: 'product_categories',
                        localField: 'product_category_id',
                        foreignField: 'category_id',
                        as: 'product_category_name'
                    }
                },
                {
                    $addFields: {
                        scent_id: { $arrayElemAt: [{ $split: ["$product_scent", ","] }, 0] }
                    }
                },
                {
                    $lookup: {
                        from: 'product_scents',
                        localField: 'product_scent',
                        foreignField: 'scent_id',
                        as: 'product_scent_name'
                    }
                },

                {
                    $lookup: {
                        from: 'product_brands',
                        localField: 'brand',
                        foreignField: 'brand_id',
                        as: 'brand_details'
                    }
                },
                {
                    $addFields: {
                        brand_name: { $arrayElemAt: ["$brand_details.brand_name", 0] }
                    }
                },
                {
                    $project: {
                        brand_details: 0
                    }
                },
                { $limit: 1 }
            ]);

            console.log(products, '==============', products[0].brand_name);

            if (!products.length) {
                return res.status(400).json({ message: "Product not found" });
            }

            const mainProduct = products[0];
            const categoryIds = mainProduct.category.split(",");

            console.log("Category IDs for fetching related products:", categoryIds);

            const relatedProduct = await Product.aggregate([
                {
                    $match: {
                        $or: categoryIds.map(id => ({
                            category: new RegExp(`(^|,)${id}(,|$)`, "i")
                        })),
                        product_id: { $ne: product_id }
                    }
                },
                { $sort: { _id: 1 } },
                { $limit: 5 }
            ]);

            const extractRelatedProducts = (relatedProducts) => {
                return relatedProducts.map(product => {
                    const variationKeys = Object.keys(product.variations || {});
                    let selectedVariation = null;

                    for (const key of variationKeys) {
                        if (product.variations[key].length > 0) {
                            selectedVariation = product.variations[key][0];
                            break;
                        }
                    }

                    return {
                        product_name: product.product_name,
                        product_id: product.product_id,
                        selling_cost: selectedVariation ? selectedVariation.selling_cost : null,
                        image: selectedVariation && selectedVariation.images.length > 0 ? selectedVariation.images[0] : null
                    };
                });
            };

            const relatedProducts = extractRelatedProducts(relatedProduct);
            console.log(relatedProduct, '-----------------');

            res.status(200).json({ product: mainProduct, relatedProducts });
        } catch (error) {
            console.error("Error fetching product details:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    productByCategory: async (req, res) => {
        try {
            const category_id = req.params.category_id;
            const { sortBy, brands, priceRange, query } = req.query;

            console.log(req.query, category_id, "query params....");

            let searchConditions = {};

            if (category_id !== "all") {
                searchConditions.category = { $regex: new RegExp(category_id, "i") };
            }

            if (query) {
                const searchRegex = new RegExp(query, "i");
                searchConditions.$or = [
                    { product_name: searchRegex },
                    { brand: searchRegex },
                    { tags: { $in: [searchRegex] } },
                    { "meta.title": searchRegex },
                    { "meta.keywords": { $in: [searchRegex] } },
                    { "meta.description": searchRegex },
                    { "variations.color.name": searchRegex },
                    { "variations.weight.name": searchRegex },
                    { "variations.size.name": searchRegex },
                ];
            }
            if (brands) {
                const brandArray = brands.split(",");
                searchConditions.brand = { $in: brandArray };
            }

            if (priceRange) {
                const [min, max] = priceRange.split("-").map(Number);
                searchConditions.selling_cost = { $gte: min, $lte: max };
            }

            console.log(searchConditions, "Final Query Conditions");

            let products = await Product.find(searchConditions).lean();

            console.log("Product sort:", sortBy);

            if (sortBy) {
                switch (sortBy) {
                    case "Low to High":
                        products.sort((a, b) => a.selling_cost - b.selling_cost);
                        break;
                    case "High to Low":
                        products.sort((a, b) => b.selling_cost - a.selling_cost);
                        break;
                    case "Newest to Oldest":
                        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        break;
                    case "Oldest to Newest":
                        products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                        break;
                    default:
                        break;
                }
            }

            res.status(200).json({ status: true, message: "Product Data Fetched", products });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    productByBrand: async (req, res) => {
        try {
            const brand_id = req.params.brand_id;
            const { sortBy, brands, priceRange } = req.query;

            console.log(req.query, brand_id, 'query params....');
            try {
                let query = {
                    brand: brand_id,
                };



                if (priceRange) {
                    const [min, max] = priceRange.split('-').map(Number);
                    query.selling_cost = { $gte: min, $lte: max };
                }
                console.log(query, '................')
                let pipeline = [
                    { $match: query },
                    {
                        $addFields: {
                            brand: {
                                $arrayElemAt: [{ $split: ["$brand", ","] }, 0],
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "product_categories",
                            localField: "product_brand_id",
                            foreignField: "brand_id",
                            as: "product_brand_name",
                        },
                    },
                ];
                console.log(pipeline, '==========')
                let products = await Product.aggregate(pipeline);
                console.log(products, '--------')

                console.log('product sort :', sortBy);
                if (sortBy) {
                    switch (sortBy) {
                        case 'Low to High':
                            products = products.sort((a, b) => a.price - b.price);
                            break;
                        case 'High to Low':
                            products = products.sort((a, b) => b.price - a.price);
                            break;
                        case 'News to Old':
                            products = products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                            break;
                        default:
                            products
                    }
                }

                res.status(200).json({ status: true, message: "Product Data Fetched By Category", products });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Server error" });
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" })
        }

    },

    createProduct: async (req, res) => {
        try {
            let productData = JSON.parse(req.body.productData);
            let allFiles = req.files || [];

            console.log("Received product data:", productData);
            console.log("Received files:", allFiles.length);

            if (!productData.product_name) {
                return res.status(400).json({ message: 'Required fields are missing!' });
            }

            productData.product_id = await generateProductId();

            let formattedVariations = {};

            if (productData.variations && Array.isArray(productData.variations)) {
                productData.variations.forEach((variation, index) => {
                    const variationImages = allFiles.filter(file =>
                        file.fieldname === `variation_images_${index}`
                    );

                    console.log(`Processing variation ${index} (${variation.type}: ${variation.name}), found ${variationImages.length} images`);

                    let formattedVariation = {
                        name: variation.name,
                        value: variation.value,
                        id: variation.id || `${productData.product_id}-${variation.type}-${variation.name}`,
                        quantity: Number(variation.quantity) || 0,
                        price: Number(variation.selling_cost) || 0,
                        images: variationImages.map(file => `${file.filename}`),
                        dimension_length: variation.dimension_length || "",
                        dimension_width: variation.dimension_width || "",
                        dimension_height: variation.dimension_height || "",
                        pages: variation.pages || "",
                        initial_cost: variation.initial_cost || "",
                        selling_cost: variation.selling_cost || ""
                    };

                    if (!formattedVariations[variation.type]) {
                        formattedVariations[variation.type] = {};
                    }

                    formattedVariations[variation.type][variation.name] = formattedVariation;
                });
            }
            console.log(formattedVariations, '===================================')
            productData.variations = productData.variations = {
                color: Object.values(formattedVariations.color || {}),
                weight: Object.values(formattedVariations.weight || {}),
                size: Object.values(formattedVariations.size || {})
            };

            console.log(productData.variations)
            const productImages = allFiles.filter(file => file.fieldname === "product_images");
            if (productImages.length > 0) {
                productData.images = productImages.map(file => `${file.filename}`);
            }
            const meta = {
                title: productData.meta_title,
                keywords: productData.meta_keyword,
                description: productData.meta_description,
            }
            productData.meta = meta
            console.log("Saving product with formatted data");
            const newProduct = new Product(productData);
            console.log(newProduct, '.........')
            await newProduct.save();

            return res.status(201).json({
                success: true,
                message: 'Product created successfully!',
                data: newProduct
            });

        } catch (error) {
            console.error('Error creating product:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    DeleteImage: async (req, res) => {
        const { imageUrl, product_id, variationId } = req.body;

        try {
            const product = await Product.findOne({ product_id });
            if (!product) {
                return res.status(404).json({ status: false, message: "Product not found" });
            }

            let imageDeleted = false;

            for (let key of Object.keys(product.variations)) {
                if (Array.isArray(product.variations[key])) {
                    product.variations[key] = product.variations[key].map(variation => {
                        if (variation.id === variationId) {
                            const initialLength = variation.images.length;
                            variation.images = variation.images.filter(img => img !== imageUrl);

                            if (initialLength !== variation.images.length) {
                                console.log("Image deleted successfully", variation.images);
                                imageDeleted = true;
                            }
                        }
                        return variation;
                    });
                }
            }

            if (!imageDeleted) {
                return res.status(404).json({ message: "Image or variation not found" });
            }

            product.markModified("variations");
            await product.save();

            const imagePath = path.join(__dirname, "..", "public/assets/uploads", path.basename(imageUrl));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            res.json({ status: true, message: "Image deleted successfully", variations: product.variations });
        } catch (error) {
            console.error("Error deleting image:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const productId = req.params.product_id;
            let productData = JSON.parse(req.body.productData);
            let allFiles = req.files || [];

            console.log(`Updating product ${productId}`);
            console.log("Received updated data:", productData);
            console.log("Received files:", allFiles.length);
            console.log('===================================================================================================')
            const existingProduct = await Product.findOne({ product_id: productId });
            if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            // console.log(existingProduct.variations, '................................................')
            // console.log('===================================================================================================')

            let formattedVariations = {
                color: [],
                weight: [],
                size: []
            };

            if (productData.variations && Array.isArray(productData.variations)) {
                productData.variations.forEach((variation, index) => {
                    const variationImages = allFiles.filter(file =>
                        file.fieldname === `variation_images_${index}`
                    );

                    // console.log(`Processing variation ${index} (${variation.type}: ${variation.name}), found ${variationImages.length} images`);
                    // console.log('===================================================================================================')
                    // console.log('Variation Type ', variation.type,)
                    // console.log('===================================================================================================')

                    let existingVariationImages = [];
                    if (variation.type === "color") {
                        const existingVar = existingProduct.variations.color.find(v => v.name === variation.name);
                        if (existingVar && existingVar.images) {
                            existingVariationImages = existingVar.images;
                        }
                    } else if (variation.type === "weight") {
                        const existingVar = existingProduct.variations.weight.find(v => v.name === variation.name);
                        if (existingVar && existingVar.images) {
                            existingVariationImages = existingVar.images;
                        }
                    } else if (variation.type === "size") {
                        const existingVar = existingProduct.variations.size.find(v => v.name === variation.name);
                        if (existingVar && existingVar.images) {
                            existingVariationImages = existingVar.images;
                        }
                    }


                    const newImages = variationImages.map(file => `${file.filename}`);
                    const combinedImages = [...existingVariationImages, ...newImages];
                    // console.log(combinedImages, 'combined images')
                    // console.log("existing Images", existingVariationImages)
                    // console.log("new Images :", newImages)
                    // console.log('===================================================================================================')

                    let formattedVariation = {
                        name: variation.name,
                        value: variation.value,
                        type: variation.type,
                        id: variation.id || `${productId}-${variation.type}-${variation.name}`,
                        quantity: Number(variation.quantity) || 0,
                        price: Number(variation.selling_cost) || 0,
                        images: combinedImages,
                        dimension_length: variation.dimension_length || "",
                        dimension_width: variation.dimension_width || "",
                        dimension_height: variation.dimension_height || "",
                        pages: variation.pages || "",
                        initial_cost: variation.initial_cost || "",
                        selling_cost: variation.selling_cost || ""
                    };
                    // console.log(formattedVariation, 'formatted variations..')
                    // console.log('===================================================================================================')

                    if (variation.type === "color") {
                        formattedVariations.color.push(formattedVariation);
                    } else if (variation.type === "weight") {
                        formattedVariations.weight.push(formattedVariation);
                    } else if (variation.type === "size") {
                        formattedVariations.size.push(formattedVariation);
                    }
                });
            }

            productData.variations = formattedVariations;
            // console.log("Formatted Variations...................", formattedVariations, '...........................')
            // console.log('===================================================================================================')

            // Handle product images
            // const productImages = allFiles.filter(file => file.fieldname === "product_images");
            // if (productImages.length > 0) {
            //     const newImages = productImages.map(file => `/uploads/${file.filename}`);
            //     // Combine with existing images if they should be kept
            //     productData.images = [...(existingProduct.images || []), ...newImages];
            // } else {
            //     // Keep existing images
            //     productData.images = existingProduct.images || [];
            // }

            const updateFields = {
                product_name: productData.product_name,
                product_short_description: productData.product_short_description,
                product_description: productData.product_description,
                product_additional_details: productData.product_additional_details,
                base_price: productData.base_price,
                currency: productData.currency,
                product_category: productData.category,
                product_brand: productData.brand,
                tags: productData.tags,
                product_status: productData.status,
                countryOfOrigin: productData.countryOfOrigin,
                CountryOfManufacturing: productData.CountryOfManufacturing,
                variations: productData.variations,
                // images: productData.images,
                meta: {
                    title: productData.meta_title,
                    keywords: productData.meta_keyword,
                    description: productData.meta_description,
                },
                updated_at: new Date()
            };

            const updatedProduct = await Product.findOneAndUpdate(
                { product_id: productId },
                { $set: updateFields },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: 'Product updated successfully!',
                data: updatedProduct
            });

        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    allProduct: async (req, res) => {
        try {
            let { search, sortBy, sortOrder, page, limit } = req.query;

            let filter = {};


            if (search) {
                filter.$or = [
                    { product_name: { $regex: search, $options: "i" } },
                    { category: { $regex: search, $options: "i" } },
                    { brand: { $regex: search, $options: "i" } }
                ];
            }


            // // Sorting logic
            // let sortOptions = {};
            // if (sortBy) {
            //     sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
            // } else {
            //     sortOptions.createdAt = -1; // Default sorting by newest products
            // }

            // Pagination logic
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const skip = (page - 1) * limit;

            // Fetching products with filters, sorting, and pagination
            const products = await Product.find(filter)
                .skip(skip)
                .limit(limit);

            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
            console.log(products, '===')
            return res.status(200).json({
                status: true,
                message: "Products fetched successfully!",
                data: products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    pageSize: limit,
                }
            });

        } catch (error) {
            console.error("Error fetching products:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product_id = req.params.product_id
            const product = await Product.findOneAndDelete({ product_id: product_id })
            if (!product) {
                return res.status(404).json({ message: "Can't find the product" });
            }
            return res.status(200).json({ status: true, message: "Product Delete Successfull" });

        } catch (error) {
            console.error("Error fetching products:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    searchProducts: async (req, res) => {
        try {
            const { query, page = 1, limit = 10 } = req.query;
            if (!query) {
                return res.status(400).json({ message: "Search query is required" });
            }

            const searchRegex = new RegExp(query, "i");

            const searchConditions = {
                $or: [
                    { product_name: searchRegex },
                    { category: searchRegex },
                    { brand: searchRegex },
                    { tags: { $in: [searchRegex] } },
                    { "meta.title": searchRegex },
                    { "meta.keywords": { $in: [searchRegex] } },
                    { "meta.description": searchRegex },
                    { "variations.color.name": searchRegex },
                    { "variations.weight.name": searchRegex },
                    { "variations.size.name": searchRegex },
                ],
            };

            const products = await Product.find(searchConditions)
                .limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit))
                .sort({ trending_count: -1 });

            res.status(200).json({
                success: true,
                count: products.length,
                products,
            });
        } catch (error) {
            console.error("Error searching products:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}

