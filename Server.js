const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { upload } = require('./Utils/imageHandler'); // 👈 สำหรับ upload รูป
const { uploadToCloudinary, uploadMultipleToCloudinary } = require('./Utils/cloudinaryHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Import Models
const User = require('./Model/User');
const Nurse = require('./Model/Nurse');
const Relative = require('./Model/Relative');
const Elderly = require('./Model/Elderly');

// Helper function to clean up uploaded files
const cleanupUploadedFiles = (files) => {
  if (Array.isArray(files)) {
    files.forEach(file => {
      if (file && file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.warn('Failed to delete temp file:', file.path, err.message);
        }
      }
    });
  }
};

// Routes - สร้าง User

// 1. สร้าง Nurse (with Cloudinary upload)
app.post(
  '/api/users/nurse',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'certificateImages', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const { name, email, phone, specialization, yearsOfExperience } = req.body;

      const education = JSON.parse(req.body.education || '{}');
      const skills = JSON.parse(req.body.skills || '[]');
      const license = JSON.parse(req.body.license || '{}');

      // อัพโหลดรูปไป Cloudinary
      let profileImageUrl = null;
      let licenseImageUrl = null;
      let certificateImageUrls = [];

      try {
        // Upload profile image
        if (req.files.profileImage?.[0]) {
          profileImageUrl = await uploadToCloudinary(req.files.profileImage[0].path, 'oldie-care/nurses/profile');
        }

        // Upload license image
        if (req.files.licenseImage?.[0]) {
          licenseImageUrl = await uploadToCloudinary(req.files.licenseImage[0].path, 'oldie-care/nurses/license');
        }

        // Upload certificate images
        if (req.files.certificateImages?.length > 0) {
          const certificatePaths = req.files.certificateImages.map(file => file.path);
          certificateImageUrls = await uploadMultipleToCloudinary(certificatePaths, 'oldie-care/nurses/certificates');
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        throw uploadError;
      } finally {
        // ลบไฟล์ชั่วคราว
        cleanupUploadedFiles(req.files.profileImage);
        cleanupUploadedFiles(req.files.licenseImage);
        cleanupUploadedFiles(req.files.certificateImages);
      }

      // สร้าง User
      const user = new User({
        name,
        email,
        phone,
        role: 'nurse',
        profileImage: profileImageUrl
      });

      const savedUser = await user.save();

      // สร้าง Nurse details
      const nurse = new Nurse({
        userId: savedUser._id,
        education,
        specialization: specialization,
        skills,
        license,
        yearsOfExperience: yearsOfExperience,
        licenseImage: licenseImageUrl,
        certificateImages: certificateImageUrls
      });

      const savedNurse = await nurse.save();

      res.status(201).json({
        message: 'Nurse created successfully',
        user: savedUser,
        nurse: savedNurse
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating nurse',
        error: error.message
      });
    }
  }
);

// 2. สร้าง Relative (รองรับ optional profileImage upload)
app.post(
  '/api/users/relative',
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, email, phone, password, elderlyId, relationship, relationshipDetail, emergencyContact } = req.body;

      // Initialize req.files safely (multer may not set it if JSON is sent)
      req.files = req.files || {};

      // ถ้ามีไฟล์ profileImage ให้ upload ขึ้น Cloudinary
      let profileImageUrl = null;
      try {
        if (req.files.profileImage && req.files.profileImage[0]) {
          profileImageUrl = await uploadToCloudinary(req.files.profileImage[0].path, 'oldie-care/relatives/profile');
        }
      } catch (uploadErr) {
        console.warn('Relative profile upload failed:', uploadErr.message);
      } finally {
        // ลบไฟล์ชั่วคราวถ้ามี
        try {
          if (req.files && req.files.profileImage) cleanupUploadedFiles(req.files.profileImage);
        } catch (e) {
          console.warn('Cleanup failed for relative profileImage', e.message);
        }
      }

      // สร้าง User
      const user = new User({
        name,
        email,
        phone,
        role: 'relative',
        password,
        profileImage: profileImageUrl || null
      });

      const savedUser = await user.save();

      // สร้าง Relative details
      const relative = new Relative({
        userId: savedUser._id,
        elderlyId,
        relationship,
        relationshipDetail,
        emergencyContact
      });

      const savedRelative = await relative.save();

      res.status(201).json({
        message: 'Relative created successfully',
        user: savedUser,
        relative: savedRelative
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating relative',
        error: error.message
      });
    }
  }
);

// 3. สร้าง Elderly (ปรับปรุงใหม่ตามโครงสร้างที่ต้องการ)
app.post(
  '/api/users/elderly',
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        dateOfBirth,
        nationalId,
        address,
        medicalConditions,
        medications,
        allergies,
        assignedNurse
      } = req.body;

      // 1. จัดการอัปโหลดรูปภาพไปยัง Cloudinary (เพื่อให้ได้ URL ที่ใช้งานได้จริง)
      let profileImageUrl = null;
      if (req.files && req.files.profileImage?.[0]) {
        try {
          profileImageUrl = await uploadToCloudinary(req.files.profileImage[0].path, 'oldie-care/elderly/profile');
        } catch (uploadErr) {
          console.warn('Cloudinary upload failed, falling back to local path:', uploadErr.message);
          profileImageUrl = req.files.profileImage[0].path;
        } finally {
          // ลบไฟล์ Temp ทันทีหลังอัปโหลดเสร็จ
          cleanupUploadedFiles(req.files.profileImage);
        }
      }

      // 2. แปลงข้อมูลที่เป็น String (จาก FormData) กลับเป็น Object/Array
      let parsedAddress = address;
      try { if (typeof address === 'string') parsedAddress = JSON.parse(address); } catch (e) { /* keep as is */ }

      let parsedMedications = medications;
      try { if (typeof medications === 'string') parsedMedications = JSON.parse(medications); } catch (e) { /* keep as is */ }

      // 3. สร้าง User พร้อม profileImage
      const user = new User({
        name,
        email,
        phone,
        role: 'elderly',
        password, // ในระบบจริงควร hash password ก่อน save นะครับ (เช่น bcrypt)
        profileImage: profileImageUrl
      });

      const savedUser = await user.save();

      // 4. สร้าง Elderly details โดยผูกกับ userId ที่เพิ่งสร้าง
      const elderly = new Elderly({
        userId: savedUser._id,
        dateOfBirth,
        nationalId,
        address: parsedAddress,
        medicalConditions,
        medications: parsedMedications,
        allergies,
        assignedNurse: assignedNurse || null
      });

      const savedElderly = await elderly.save();

      // 5. เตรียมข้อมูลส่งกลับ (ลบ password ออกเพื่อความปลอดภัย)
      const userObj = savedUser.toObject();
      delete userObj.password;

      res.status(201).json({
        message: 'Elderly person created successfully',
        user: userObj,
        elderly: savedElderly
      });

    } catch (error) {
      console.error('Error in /api/users/elderly:', error);
      res.status(500).json({
        message: 'Error creating elderly person',
        error: error.message
      });
    }
  }
);

// Routes - ดึงข้อมูล

// ดึงข้อมูล Nurses ทั้งหมด
app.get('/api/nurses', async (req, res) => {
  try {
    const nurses = await Nurse.find()
      .populate('userId');
    res.json(nurses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Nurse คนหนึ่ง
app.get('/api/nurses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid nurse id' });
    const nurse = await Nurse.findById(id).populate('userId');
    if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
    res.json(nurse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Elderly ทั้งหมด
app.get('/api/elderly', async (req, res) => {
  try {
    const elderly = await Elderly.find()
      .populate('userId')
      .populate('assignedNurse');
    res.json(elderly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Elderly คนหนึ่ง
app.get('/api/elderly/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid elderly id' });
    const elderly = await Elderly.findById(id).populate('userId').populate('assignedNurse');
    if (!elderly) return res.status(404).json({ message: 'Elderly not found' });
    res.json(elderly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Relatives ของ Elderly คนหนึ่ง
app.get('/api/elderly/:elderlyId/relatives', async (req, res) => {
  try {
    const relatives = await Relative.find({ elderlyId: req.params.elderlyId })
      .populate('userId')
      .populate('elderlyId');
    res.json(relatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Relatives ทั้งหมด
app.get('/api/relatives', async (req, res) => {
  try {
    const relatives = await Relative.find().populate('userId').populate('elderlyId');
    res.json(relatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Relative คนหนึ่ง
app.get('/api/relatives/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid relative id' });
    const relative = await Relative.findById(id).populate('userId').populate('elderlyId');
    if (!relative) return res.status(404).json({ message: 'Relative not found' });
    res.json(relative);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Proxy endpoint to fetch from external API
app.get('/api/proxy/:endpoint', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const externalUrl = `https://se-project-oldiecare.onrender.com/api/${endpoint}`;
    
    const response = await fetch(externalUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `External API returned ${response.status}` 
      });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;