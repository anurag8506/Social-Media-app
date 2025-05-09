// const validator = require('../data-creation/validator');
// const cryptoConfig = require("../validator/config");

module.exports = {
//   add_article: async (req, fields, files, res) => {
//     try {
//       console.log("Inside Article Add", fields, '...............', files);

//       const requiredFields = [
//         "token",
//         "article_title",
//         "article_heading",
//         "article_short_description",
//         "article_content",
//       ];

//       const validation = validator.check_required_fields(fields, requiredFields);

//       if (!validation.status) {
//         const missingField = requiredFields[validation.key];
//         return res.status(400).json({
//           status: false,
//           message: `Validation failed. Please fill the required field: ${missingField}`,
//         });
//       }

//       const jwtToken = fields.token.toString();
//       const jwt_verify = cryptoConfig.jwtVerify(jwtToken);

//       if (!jwt_verify) {
//         return res.status(400).json({
//           status: false,
//           message: "Validation failed. Token Expired. Try logging in again.",
//         });
//       }

//       const adminId = jwt_verify.admin_id;
//       const admin_details_res = await admin_details.findOne({ admin_id: adminId });

//       if (!admin_details_res) {
//         return res.status(400).json({
//           status: false,
//           message: "Unauthorized Access. Try again later.",
//         });
//       }

//       var required_images_array = ["images"];
//       var fileSize = 1024 * 1024 * 5;
//       var valid_file_array = ["png", "jpg", "jpeg"];
//       var file_type_data = "image";

//       const imageValidator = validator.check_required_images(
//         files,
//         required_images_array,
//         fileSize,
//         valid_file_array,
//         file_type_data
//       );

//       if (!imageValidator.status) {
//         return res.status(400).json({
//           status: false,
//           message: imageValidator.message,
//         });
//       }

//       var article_images = [];
//       for (var i = 0; i < files.images.length; i++) {
//         article_images.push(validator.uploadImage(files.images[i]));
//       }

//       let reviews = [];
//       Object.keys(fields).forEach((key) => {
//         const match = key.match(/^reviews\[(\d+)\]\[(.*?)\]$/);
//         if (match) {
//           const index = match[1];
//           const fieldName = match[2]; 

//           if (!reviews[index]) {
//             reviews[index] = {};
//           }

//           reviews[index][fieldName] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
//         }
//       });

//       Object.keys(files).forEach((key) => {
//         const match = key.match(/^reviews\[(\d+)\]\[reviewer_image\]$/);
//         if (match) {
//           const index = match[1]; 

//           if (files[key] && Array.isArray(files[key]) && files[key].length > 0) {
//             const file = files[key][0]; 
//             reviews[index].reviewer_image = validator.uploadImage(file); 
//           }
//         }
//       });

//       reviews = reviews.map((review) => ({
//         reviewer_name: review.reviewer_name || "",
//         review_text: review.review_text || "",
//         rating: review.rating ? parseInt(review.rating, 10) : 1,
//         reviewer_image: review.reviewer_image || "", 
//       }));


//       const article_details = {
//         article_id: cryptoConfig.generateUniqid(),
//         article_title: fields.article_title[0].toString(),
//         article_heading: fields.article_heading[0].toString(),
//         article_short_description: fields.article_short_description[0].toString(),
//         articles_content: fields.article_content.toString(),
//         article_image_array: article_images,
//         added_by: adminId,
//         reviews, 
//         average_rating: reviews.length
//           ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//           : 0, 
//       };

//       const article_insert_res = new article_schema(article_details);
//       const InsertRes = await article_insert_res.save();

//       if (InsertRes._id) {
//         return res.status(200).json({
//           status: true,
//           message: "Article Details Saved with Reviews",
//         });
//       } else {
//         return res.status(400).json({
//           status: false,
//           message: "Something went wrong. Try again later.",
//         });
//       }
//     } catch (error) {
//       console.error("Error handling form submission:", error);
//       res.status(500).json({
//         status: false,
//         message: error.message,
//       });
//     }
//   },
   uploadImageHandler : async (req, res) => {
    console.log(req.file)
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }

        const imageUrl = `${process.env.PUBLIC_URL}asset/uploads/${req.file.filename}`;
        return res.status(200).json({ status: true, location: imageUrl });
    } catch (err) {
        console.error('Upload Error:', err);
        return res.status(500).json({ status: false, message: 'Server error during image upload' });
    }
}

}