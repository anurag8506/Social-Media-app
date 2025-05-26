const Project = require('../models/projects');
const path = require('path');
const fs = require('fs');


// Generate project ID
const generateProjectId = async () => {
  const count = await Project.countDocuments();
  return `project_${(count + 1).toString().padStart(2, '0')}`;
};

// Helper function to process uploaded files
const processUploadedFiles = (files, fieldName) => {
  if (!files || !files[fieldName]) return [];
  return files[fieldName].map(file => file.path);
};


exports.createProject = async (req, res) => {
  try {
    const projectId = await generateProjectId();
    console.log(req.file, req.files)
    
    // Function to process files and remove the path prefix
    const processUploadedFiles = (files, fieldName) => {
      if (!files || !files[fieldName]) return [];
      
      return files[fieldName].map(file => {
        // Remove "public\\assets\\uploads\\" from the path
        return file.path.replace('public\\assets\\uploads\\', '');
      });
    };
    
    // Process file paths by removing the prefix
    const processSingleFilePath = (file) => {
      if (!file) return null;
      return file.path.replace('public\\assets\\uploads\\', '');
    };
    
    // Process all file uploads
    const mainBannerImages = processUploadedFiles(req.files, 'mainBanner');
    const projectImages = processUploadedFiles(req.files, 'projectImages');
    const teamImages = processUploadedFiles(req.files, 'teamImages');
    
    // Process single file uploads
    const companyLogo = req.files?.companyLogo?.[0] ? 
      processSingleFilePath(req.files.companyLogo[0]) : null;
    
    const reviewPersonImage = req.files?.reviewPersonImage?.[0] ? 
      processSingleFilePath(req.files.reviewPersonImage[0]) : null;
    
    // Handle team members array
    const teamMembers = Array.isArray(req.body.projectTeamMembers) 
      ? req.body.projectTeamMembers 
      : req.body.projectTeamMembers 
        ? [req.body.projectTeamMembers] 
        : [];
    
    const projectData = {
      projects_id: projectId,
      companyName: req.body.companyName,
      projectName: req.body.projectName,
      projectLink: req.body.projectLink,
      projectType: req.body.projectType,
      companyLogo,
      mainBanner: mainBannerImages,
      projectImages,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      mainDescription: req.body.mainDescription,
      reviewText: req.body.reviewText,
      reviewPersonName: req.body.reviewPersonName,
      reviewPersonImage,
      projectTeamMembers: teamMembers,
      teamImages
    };
    
    const project = new Project(projectData);
    await project.save();
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};



exports.fetchProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;        // default page
    const limit = parseInt(req.query.limit) || 6;     // default items per page
    const skip = (page - 1) * limit;

    const total = await Project.countDocuments();
    const projects = await Project.find()
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const projects_id = req.params.projects_id; // Make sure this matches your route param
    
    // Option 1: If you're using a custom string ID field (recommended)
    const project = await Project.findOne({ projects_id: projects_id});
    
    // Option 2: If you must use _id but with strings
    // const project = await Project.findById(projectId); // Only works if _id is ObjectId
    
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Update project

exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.projects_id;

    // Find the existing project
    const existingProject = await Project.findOne({ projects_id: projectId });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Function to remove 'public/assets/uploads/' from file paths
    const removeUploadPrefix = (filePath) => {
      const normalizedPath = filePath.split(path.sep).join('/'); // Normalize slashes
      return normalizedPath.replace('public/assets/uploads/', '');
    };

    const processUploadedFiles = (files, fieldName) => {
      if (!files || !files[fieldName]) return [];
      return files[fieldName].map(file => removeUploadPrefix(file.path));
    };

    const processSingleFilePath = (file) => {
      if (!file) return null;
      return removeUploadPrefix(file.path);
    };

    // Process new file uploads
    const mainBannerImages = processUploadedFiles(req.files, 'mainBanner');
    const projectImages = processUploadedFiles(req.files, 'projectImages');
    const teamImages = processUploadedFiles(req.files, 'teamImages');

    const companyLogo = req.files?.companyLogo?.[0]
      ? processSingleFilePath(req.files.companyLogo[0])
      : null;

    const reviewPersonImage = req.files?.reviewPersonImage?.[0]
      ? processSingleFilePath(req.files.reviewPersonImage[0])
      : null;

    // Handle existing + new files
    const updatedMainBanner = mainBannerImages.length > 0
      ? mainBannerImages
      : req.body.existingMainBanner
        ? Array.isArray(req.body.existingMainBanner)
          ? req.body.existingMainBanner
          : [req.body.existingMainBanner]
        : existingProject.mainBanner;

    const updatedProjectImages = projectImages.length > 0
      ? projectImages
      : req.body.existingProjectImages
        ? Array.isArray(req.body.existingProjectImages)
          ? req.body.existingProjectImages
          : [req.body.existingProjectImages]
        : existingProject.projectImages;

    const updatedTeamImages = teamImages.length > 0
      ? teamImages
      : req.body.existingTeamImages
        ? Array.isArray(req.body.existingTeamImages)
          ? req.body.existingTeamImages
          : [req.body.existingTeamImages]
        : existingProject.teamImages;

    const updatedCompanyLogo = companyLogo || req.body.existingCompanyLogo || existingProject.companyLogo;
    const updatedReviewPersonImage = reviewPersonImage || req.body.existingReviewPersonImage || existingProject.reviewPersonImage;

    const teamMembers = Array.isArray(req.body.projectTeamMembers)
      ? req.body.projectTeamMembers
      : req.body.projectTeamMembers
        ? [req.body.projectTeamMembers]
        : existingProject.projectTeamMembers;

    // Prepare update data
    const projectData = {
      companyName: req.body.companyName || existingProject.companyName,
      projectName: req.body.projectName || existingProject.projectName,
      projectLink: req.body.projectLink || existingProject.projectLink,
      projectType: req.body.projectType || existingProject.projectType,
      companyLogo: updatedCompanyLogo,
      mainBanner: updatedMainBanner,
      projectImages: updatedProjectImages,
      shortDescription: req.body.shortDescription || existingProject.shortDescription,
      description: req.body.description || existingProject.description,
      mainDescription: req.body.mainDescription || existingProject.mainDescription,
      reviewText: req.body.reviewText || existingProject.reviewText,
      reviewPersonName: req.body.reviewPersonName || existingProject.reviewPersonName,
      reviewPersonImage: updatedReviewPersonImage,
      projectTeamMembers: teamMembers,
      teamImages: updatedTeamImages,
      updatedAt: Date.now()
    };

    // Update in DB
    const updatedProject = await Project.findOneAndUpdate(
      { projects_id: projectId },
      { $set: projectData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// exports.updateProject = async (req, res) => {
//   try {
//     const projectId = req.params.projects_id; // Get project ID from URL parameters
    
//     // Find the existing project
//     const existingProject = await Project.findOne({ projects_id: projectId });
    
//     if (!existingProject) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found'
//       });
//     }

//     // Function to process files and remove the path prefix
//     const processUploadedFiles = (files, fieldName) => {
//       if (!files || !files[fieldName]) return [];
      
//       return files[fieldName].map(file => {
//         // Remove "public\\assets\\uploads\\" from the path
//         return file.path.replace('public\\assets\\uploads\\', '');
//       });
//     };
    
//     // Process single file path
//     const processSingleFilePath = (file) => {
//       if (!file) return null;
//       return file.path.replace('public\\assets\\uploads\\', '');
//     };
    
//     // Process all new file uploads
//     const mainBannerImages = processUploadedFiles(req.files, 'mainBanner');
//     const projectImages = processUploadedFiles(req.files, 'projectImages');
//     const teamImages = processUploadedFiles(req.files, 'teamImages');
    
//     // Process single file uploads
//     const companyLogo = req.files?.companyLogo?.[0] ?
//       processSingleFilePath(req.files.companyLogo[0]) : null;
    
//     const reviewPersonImage = req.files?.reviewPersonImage?.[0] ?
//       processSingleFilePath(req.files.reviewPersonImage[0]) : null;
    
//     // Handle existing files
//     const updatedMainBanner = mainBannerImages.length > 0 
//       ? mainBannerImages 
//       : req.body.existingMainBanner 
//         ? Array.isArray(req.body.existingMainBanner) 
//           ? req.body.existingMainBanner 
//           : [req.body.existingMainBanner]
//         : existingProject.mainBanner;
        
//     const updatedProjectImages = projectImages.length > 0 
//       ? projectImages 
//       : req.body.existingProjectImages 
//         ? Array.isArray(req.body.existingProjectImages) 
//           ? req.body.existingProjectImages 
//           : [req.body.existingProjectImages]
//         : existingProject.projectImages;
        
//     const updatedTeamImages = teamImages.length > 0 
//       ? teamImages 
//       : req.body.existingTeamImages 
//         ? Array.isArray(req.body.existingTeamImages) 
//           ? req.body.existingTeamImages 
//           : [req.body.existingTeamImages]
//         : existingProject.teamImages;
        
//     const updatedCompanyLogo = companyLogo || req.body.existingCompanyLogo || existingProject.companyLogo;
//     const updatedReviewPersonImage = reviewPersonImage || req.body.existingReviewPersonImage || existingProject.reviewPersonImage;
    
//     // Handle team members array
//     const teamMembers = Array.isArray(req.body.projectTeamMembers)
//       ? req.body.projectTeamMembers
//       : req.body.projectTeamMembers
//         ? [req.body.projectTeamMembers]
//         : existingProject.projectTeamMembers;
    
//     // Update project data
//     const projectData = {
//       companyName: req.body.companyName || existingProject.companyName,
//       projectName: req.body.projectName || existingProject.projectName,
//       projectLink: req.body.projectLink || existingProject.projectLink,
//       projectType: req.body.projectType || existingProject.projectType,
//       companyLogo: updatedCompanyLogo,
//       mainBanner: updatedMainBanner,
//       projectImages: updatedProjectImages,
//       shortDescription: req.body.shortDescription || existingProject.shortDescription,
//       description: req.body.description || existingProject.description,
//       mainDescription: req.body.mainDescription || existingProject.mainDescription,
//       reviewText: req.body.reviewText || existingProject.reviewText,
//       reviewPersonName: req.body.reviewPersonName || existingProject.reviewPersonName,
//       reviewPersonImage: updatedReviewPersonImage,
//       projectTeamMembers: teamMembers,
//       teamImages: updatedTeamImages,
//       updatedAt: Date.now()
//     };
    
//     // Update the project
//     const updatedProject = await Project.findOneAndUpdate(
//       { projects_id: projectId },
//       { $set: projectData },
//       { new: true }
//     );
    
//     res.status(200).json({
//       success: true,
//       data: updatedProject,
//       message: 'Project updated successfully'
//     });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };
// exports.updateProject = async (req, res) => {
//   try {
//     const project = await Project.findOne({ projects_id: req.params.projects_id });
//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found'
//       });
//     }
//     console.log('Project ID:', req.params.projects_id);
//     console.log('Request body:', JSON.stringify(req.body, null, 2));

//     // Initialize update data with existing values
//     const updateData = {};
    
//     // Directly check and assign each field from req.body
//     if (req.body.companyName !== undefined) updateData.companyName = req.body.companyName;
//     if (req.body.projectName !== undefined) updateData.projectName = req.body.projectName;
//     if (req.body.projectType !== undefined) updateData.projectType = req.body.projectType;
//     if (req.body.shortDescription !== undefined) updateData.shortDescription = req.body.shortDescription;
//     if (req.body.description !== undefined) updateData.description = req.body.description;
//     if (req.body.mainDescription !== undefined) updateData.mainDescription = req.body.mainDescription;
//     if (req.body.reviewText !== undefined) updateData.reviewText = req.body.reviewText;
//     if (req.body.reviewPersonName !== undefined) updateData.reviewPersonName = req.body.reviewPersonName;
    
//     // Always update the updatedAt field
//     updateData.updatedAt = Date.now();
    
//     console.log('Update data initial:', JSON.stringify(updateData, null, 2));

//     // Fix the projectLink field
//     if (req.body.projectLink !== undefined) {
//       // Extract the last valid URL from the concatenated string
//       const urlPattern = /(https?:\/\/[^\s]+)/g;
//       const matches = req.body.projectLink.match(urlPattern);
      
//       if (matches && matches.length > 0) {
//         // Take the last valid URL
//         updateData.projectLink = matches[matches.length - 1];
//       } else if (req.body.projectLink.includes('localhost')) {
//         // Handle case when regex didn't match but contains localhost
//         const parts = req.body.projectLink.split('localhost');
//         if (parts.length > 1) {
//           updateData.projectLink = `http://localhost${parts[parts.length - 1]}`;
//         } else {
//           updateData.projectLink = req.body.projectLink;
//         }
//       } else {
//         updateData.projectLink = req.body.projectLink;
//       }
      
//       console.log('Processed projectLink:', updateData.projectLink);
//     }

//     // Handle team members array
//     if (req.body.projectTeamMembers !== undefined) {
//       updateData.projectTeamMembers = Array.isArray(req.body.projectTeamMembers)
//         ? req.body.projectTeamMembers
//         : [req.body.projectTeamMembers];
//     }

//     // Handle file updates - existing vs new files
//     const handleFileUpdates = () => {
//       // Company Logo
//       if (req.files?.companyLogo) {
//         // Delete old logo if exists
//         if (project.companyLogo && fs.existsSync(project.companyLogo)) {
//           fs.unlinkSync(project.companyLogo);
//         }
//         updateData.companyLogo = req.files.companyLogo[0].path;
//       } else if (req.body.existingCompanyLogo !== undefined) {
//         updateData.companyLogo = req.body.existingCompanyLogo;
//       }

//       // Review Person Image
//       if (req.files?.reviewPersonImage) {
//         if (project.reviewPersonImage && fs.existsSync(project.reviewPersonImage)) {
//           fs.unlinkSync(project.reviewPersonImage);
//         }
//         updateData.reviewPersonImage = req.files.reviewPersonImage[0].path;
//       } else if (req.body.existingReviewPersonImage !== undefined) {
//         updateData.reviewPersonImage = req.body.existingReviewPersonImage;
//       }

//       // Main Banner (array)
//       if (req.files?.mainBanner) {
//         // Delete old banners
//         if (project.mainBanner) {
//           project.mainBanner.forEach(file => {
//             if (fs.existsSync(file)) fs.unlinkSync(file);
//           });
//         }
//         updateData.mainBanner = req.files.mainBanner.map(f => f.path);
//       } else {
//         // Handle existing main banners
//         const existingBanners = [];
//         Object.keys(req.body).forEach(key => {
//           if (key.startsWith('existingMainBanner')) {
//             existingBanners.push(req.body[key]);
//           }
//         });
        
//         if (existingBanners.length > 0) {
//           updateData.mainBanner = existingBanners;
//         }
//       }

//       // Project Images (array)
//       if (req.files?.projectImages) {
//         if (project.projectImages) {
//           project.projectImages.forEach(file => {
//             if (fs.existsSync(file)) fs.unlinkSync(file);
//           });
//         }
//         updateData.projectImages = req.files.projectImages.map(f => f.path);
//       } else {
//         // Handle existing project images
//         const existingProjectImages = [];
//         Object.keys(req.body).forEach(key => {
//           if (key.startsWith('existingProjectImages')) {
//             existingProjectImages.push(req.body[key]);
//           }
//         });
        
//         if (existingProjectImages.length > 0) {
//           updateData.projectImages = existingProjectImages;
//         }
//       }

//       // Team Images (array)
//       if (req.files?.teamImages) {
//         if (project.teamImages) {
//           project.teamImages.forEach(file => {
//             if (fs.existsSync(file)) fs.unlinkSync(file);
//           });
//         }
//         updateData.teamImages = req.files.teamImages.map(f => f.path);
//       } else {
//         // Handle existing team images
//         const existingTeamImages = [];
//         Object.keys(req.body).forEach(key => {
//           if (key.startsWith('existingTeamImages')) {
//             existingTeamImages.push(req.body[key]);
//           }
//         });
        
//         if (existingTeamImages.length > 0) {
//           updateData.teamImages = existingTeamImages;
//         }
//       }
      
//       console.log('Update data after file handling:', JSON.stringify(updateData, null, 2));
//     };

//     handleFileUpdates();
    
//     console.log('Final update data:', JSON.stringify(updateData, null, 2));

//     // Update the project
//     const updatedProject = await Project.findOneAndUpdate(
//       { projects_id: req.params.projects_id },
//       updateData,
//       { new: true }
//     );

//     console.log('Updated project result:', JSON.stringify(updatedProject, null, 2));

//     res.status(200).json({
//       success: true,
//       data: updatedProject
//     });
//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during update',
//       error: error.message,
//       stack: error.stack
//     });
//   }
// };
// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ projects_id: req.params.projects_id });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete all associated files
    const filesToDelete = [
      project.companyLogo,
      project.reviewPersonImage,
      ...project.mainBanner,
      ...project.projectImages,
      ...project.teamImages
    ].filter(filePath => filePath && fs.existsSync(filePath));

    filesToDelete.forEach(filePath => {
      fs.unlinkSync(filePath);
    });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};