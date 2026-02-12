const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Path to file (from multer)
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadToCloudinary = async (filePath, folder = 'oldie-care') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array<string>} filePaths - Array of file paths
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array<string>>} - Array of Cloudinary URLs
 */
const uploadMultipleToCloudinary = async (filePaths, folder = 'oldie-care') => {
  try {
    const uploadPromises = filePaths.map(filePath =>
      cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto'
      })
    );
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    throw new Error(`Failed to upload multiple files: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary
};
