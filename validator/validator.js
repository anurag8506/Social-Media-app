const fs = require("fs");
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
       uploadImage:(file)=>{
              var uploadPath = "public/assets/uploads/";
              var image_path = file.filepath;
              var file_extenstion = file.mimetype.split("/")[1];
              var file_name = file.newFilename+"."+file_extenstion;
              var image_new_path = uploadPath+file_name;
              fs.rename(image_path, image_new_path, async function (err) {
                     if (err){
                            console.log(err);
                            return { status: false,message:err};
                     };
              });
              return file_name;
       }
}