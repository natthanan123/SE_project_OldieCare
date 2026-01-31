const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// สร้าง directory สำหรับเก็บรูปถ้าไม่มี
const uploadsDir = path.join(__dirname, '../uploads');
const ensureUploadDir = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error('Error creating uploads directory:', err);
  }
};

// Resize รูปภาพและบันทึก
const resizeAndSaveImage = async (buffer, filename) => {
  try {
    await ensureUploadDir();
    
    const filepath = path.join(uploadsDir, filename);
    
    // Resize รูปเป็น 300x300 px
    await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('jpeg', { quality: 80 })
      .toFile(filepath);
    
    // Return URL path ที่จะเก็บใน database
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error resizing image:', err);
    throw err;
  }
};

// ลบรูปเก่า
const deleteImage = async (filepath) => {
  try {
    if (filepath) {
      const fullPath = path.join(__dirname, '..', filepath);
      await fs.unlink(fullPath);
    }
  } catch (err) {
    console.error('Error deleting image:', err);
  }
};

// สร้างชื่อไฟล์ที่ไม่ซ้ำ
const generateFilename = (email) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const cleanEmail = email.replace(/[^a-z0-9]/g, '');
  return `${cleanEmail}-${timestamp}-${randomStr}.jpg`;
};

module.exports = {
  resizeAndSaveImage,
  deleteImage,
  generateFilename,
  uploadsDir
};
