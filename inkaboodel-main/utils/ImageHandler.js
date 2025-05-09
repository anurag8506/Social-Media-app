const fs = require("fs");
const path = require("path");
module.exports = {
       imageValidator: (image_file) => {
              console.log(image_file);
       },
       check_required_fields: (fields, required_data_array) => {
              for (var i = 0; i < required_data_array.length; i++) {
                     if ((fields[required_data_array[i]] == '')||(fields[required_data_array[i]] == undefined)) {
                            return { status: false, key_value: i };
                     }
              }
              return { status: true, key_value: 0 };
       },
       check_required_images: (files, required_images_array,fileSize,valid_file_array,file_type_data) => {
              // console.log(files);
              for (var i = 0; i < required_images_array.length; i++) {
                     if (files[required_images_array[i]] == undefined) {
                            return { status: false, key_value: i };
                     }
                     var FileType = files[required_images_array[i]][0].mimetype.split("/");
                     console.log(FileType);
                     var FileSize = files[required_images_array[i]][0].size;
                     if(fileSize<FileSize){
                            return { status: false, key_value: i,message:"File size must be less then 5MB"};
                     } if(!(FileType[0]== file_type_data)){
                            return { status: false, key_value: i,message:"File must be a Image"};
                     }
                     if(!(valid_file_array.includes(FileType[1]))){
                            return { status: false, key_value: i,message:"File must be a Image"};
                     }
              }
              return { status: true, key_value: 0 };
       },
       uploadImage : (file) => {
              return new Promise((resolve, reject) => {
                  if (!file) return resolve(""); // No file uploaded
          
                  const uploadPath = path.join(__dirname, "../public/assets/uploads/");
                  const file_ext = file.mimetype.split("/")[1];
                  const file_name = file.filename + "." + file_ext;
                  const image_new_path = path.join(uploadPath, file_name);
          
                  // Ensure the directory exists
                  if (!fs.existsSync(uploadPath)) {
                      fs.mkdirSync(uploadPath, { recursive: true });
                  }
          
                  fs.rename(file.filepath, image_new_path, (err) => {
                      if (err) {
                          console.error("File rename error:", err);
                          return reject(err);
                      }
                      resolve(file_name);
                  });
              });
       }
}