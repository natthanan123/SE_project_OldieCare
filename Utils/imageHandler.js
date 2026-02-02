const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const generateFilename = (email) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const cleanEmail = email.replace(/[^a-z0-9]/gi, '');
  return `${cleanEmail}-${timestamp}-${randomStr}`;
};

// ================= Cloudinary config =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ================= File filter (เช็คว่าเป็นรูปจริง) =================
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // ผ่าน
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// ================= Multer storage (Cloudinary) =================
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads',
      format: 'jpg', // บังคับเป็น jpg
      public_id: generateFilename(req.body.email || 'user'),
      transformation: [
        { width: 500, height: 500, crop: 'fill' }
      ]
    };
  }
});

// ================= Multer upload =================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// ================= Controller =================
const uploadImages = async (req, res) => {
  try {
    const result = {};

    if (req.files.licenseImage) {
      result.licenseImage = req.files.licenseImage[0].path;
    }

    if (req.files.certificateImages) {
      result.certificateImages = req.files.certificateImages.map(file => file.path);
    }
    
    if (req.files.profileImage) {
    result.profileImage = req.files.profileImage[0].path;
    }

    res.json({
      message: 'Upload success',
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ================= Delete Image =================
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  const publicId = imageUrl.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`uploads/${publicId}`);
};

// ================= Generate filename =================


module.exports = {
  upload,
  uploadImages,
  deleteImage
};
