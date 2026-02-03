const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');

const { upload } = require('./Utils/imageHandler'); // 👈 สำหรับ upload รูป

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;

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


// Routes - สร้าง User

// ================= UPLOAD NURSE DOCUMENTS =================
app.post(
  '/api/upload/nurse-documents',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'certificateImages', maxCount: 5 }
  ]),
  (req, res) => {
    try {
      const data = {};

      if (req.files.profileImage) {
        data.profileImage = req.files.profileImage[0].path;
      }
      
      if (req.files.licenseImage) {
        data.licenseImage = req.files.licenseImage[0].path;
      }

      if (req.files.certificateImages) {
        data.certificateImages = req.files.certificateImages.map(f => f.path);
      }

  

      res.json({
        message: 'Upload nurse documents success',
        data
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// 1. สร้าง Nurse
app.post(
  '/api/users/nurse',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'certificateImages', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const { name, email, phone, password, specialization, yearsOfExperience } = req.body;

      const education = JSON.parse(req.body.education);
      const skills = JSON.parse(req.body.skills);
      const license = JSON.parse(req.body.license);

      // สร้าง User
      const user = new User({
        name,
        email,
        phone,
        role: 'nurse',
        password,
        profileImage: req.files.profileImage?.[0]?.path 
      });

      const savedUser = await user.save();

      // สร้าง Nurse
      const nurse = new Nurse({
        userId: savedUser._id,
        education,
        specialization: req.body.specialization,
        skills,
        license,
        yearsOfExperience: req.body.yearsOfExperience,

        licenseImage: req.files.licenseImage?.[0]?.path,
        certificateImages: req.files.certificateImages
          ? req.files.certificateImages.map(f => f.path)
          : []
      });

      const savedNurse = await nurse.save();

      const userObj = savedUser.toObject();
      delete userObj.password;

      res.status(201).json({
        message: 'Nurse created successfully',
        user: userObj,
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


// 2. สร้าง Relative
app.post(
  '/api/users/relative',
  upload.fields([
    { name: 'profileImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        elderlyId,
        relationship,
        relationshipDetail,
        emergencyContact
      } = req.body;

      // สร้าง User
      const user = new User({
        name,
        email,
        phone,
        password,
        role: 'relative',
        profileImage: req.files.profileImage?.[0]?.path || null
      });

      const savedUser = await user.save();

      // สร้าง Relative
      const relative = new Relative({
        userId: savedUser._id,
        elderlyId,
        relationship,
        relationshipDetail,
        emergencyContact
      });

      const savedRelative = await relative.save();

      const userObj = savedUser.toObject();
      delete userObj.password;

      res.status(201).json({
        message: 'Relative created successfully',
        user: userObj,
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

// 3. สร้าง Elderly
app.post(
  '/api/users/elderly',
  upload.fields([
    { name: 'profileImage', maxCount: 1 }
  ]),
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

      // ✅ สร้าง User พร้อม profileImage
      const user = new User({
        name,
        email,
        phone,
        role: 'elderly',
        password,
        profileImage: req.files.profileImage?.[0]?.path || null
      });

      const savedUser = await user.save();

      // สร้าง Elderly details
      const elderly = new Elderly({
        userId: savedUser._id,
        dateOfBirth,
        nationalId,
        address,
        medicalConditions,
        medications,
        allergies,
        assignedNurse
      });

      const savedElderly = await elderly.save();

      const userObj = savedUser.toObject();
      delete userObj.password;

      res.status(201).json({
        message: 'Elderly person created successfully',
        user: userObj,
        elderly: savedElderly
      });

    } catch (error) {
      res.status(500).json({
        message: 'Error creating elderly person',
        error: error.message
      });
    }
  }
);


// Routes - ดึงข้อมูล
/*
// ดึงข้อมูล Nurse ทั้งหมด
app.get('/api/nurses', async (req, res) => {
  try {
    const nurses = await Nurse.find().populate('userId' , '-password');

    if (!nurses || nurses.length === 0) {
      return res.status(404).json({ message: 'No nurses found' });
    }

    res.status(200).json(nurses);
  } catch (error) {
    console.error('GET /api/nurses error:', error);
    res.status(500).json({ error: error.message });
  }
});
// ดึงข้อมูล Nurse คนหนึ่ง
app.get('/api/nurses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ เช็คว่า id เป็น ObjectId ไหม
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid nurse id' });
    }

    const nurse = await Nurse.findById(id).populate('userId', '-password');

    // ✅ ถ้าไม่เจอ
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    res.status(200).json(nurse);
  } catch (error) {
    console.error('GET /api/nurses/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Elderly ทั้งหมด
app.get('/api/elderly', async (req, res) => {
  try {
    const elderly = await Elderly.find()
      .populate('userId', '-password')          // เอาข้อมูล User (ชื่อ, profileImage, email)
      .populate('assignedNurse');  // เอาข้อมูล Nurse

    res.json(elderly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ดึงข้อมูล Elderly คนหนึ่ง
app.get('/api/elderly/:id', async (req, res) => {
  try {
    const elderly = await Elderly.findById(req.params.id)
      .populate('userId', '-password')
      .populate('assignedNurse');

    if (!elderly) {
      return res.status(404).json({ message: 'Elderly not found' });
    }

    res.json(elderly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ดึงข้อมูล Relatives คนหนึ่ง
app.get('/api/relatives', async (req, res) => {
  try {
    const relatives = await Relative.find()
      .populate('userId', '-password')
      .populate('elderlyId');

    res.json(relatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ดึงข้อมูล Relatives ของ Elderly คนหนึ่ง
app.get('/api/elderly/:elderlyId/relatives', async (req, res) => {
  try {
    const relatives = await Relative.find({ elderlyId: req.params.elderlyId })
      .populate('userId', '-password')
      .populate('elderlyId');

    res.json(relatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ดึงข้อมูล Relative คนหนึ่ง
app.get('/api/relatives/:id', async (req, res) => {
  try {
    const relative = await Relative.findById(req.params.id)
      .populate('userId', '-password')
      .populate('elderlyId');

    if (!relative) {
      return res.status(404).json({ message: 'Relative not found' });
    }

    res.json(relative);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/

//test เดี๋ยวลบ
app.get('/api/users/nurses', async (req, res) => {
  try {
    const nurses = await Nurse.find().populate('userId');

    if (!nurses || nurses.length === 0) {
      return res.status(404).json({ message: 'No nurses found' });
    }

    res.status(200).json(nurses);
  } catch (error) {
    console.error('GET /api/nurses error:', error);
    res.status(500).json({ error: error.message });
  }
});
// ดึงข้อมูล Nurse คนหนึ่ง
app.get('/api/users/nurses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ เช็คว่า id เป็น ObjectId ไหม
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid nurse id' });
    }

    const nurse = await Nurse.findById(id).populate('userId');

    // ✅ ถ้าไม่เจอ
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    res.status(200).json(nurse);
  } catch (error) {
    console.error('GET /api/nurses/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Elderly ทั้งหมด
app.get('/api/users/elderly', async (req, res) => {
  try {
    const elderly = await Elderly.find()
      .populate('userId')          // เอาข้อมูล User (ชื่อ, profileImage, email)
      .populate('assignedNurse');  // เอาข้อมูล Nurse

    res.json(elderly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ดึงข้อมูล Elderly คนหนึ่ง
app.get('/api/users/elderly/:id', async (req, res) => {
  try {
    const elderly = await Elderly.findById(req.params.id)
      .populate('userId')
      .populate('assignedNurse');

    if (!elderly) {
      return res.status(404).json({ message: 'Elderly not found' });
    }

    res.json(elderly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ดึงข้อมูล Relatives คนหนึ่ง
app.get('/api/users/relatives', async (req, res) => {
  try {
    const relatives = await Relative.find()
      .populate('userId')
      .populate('elderlyId');

    res.json(relatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ดึงข้อมูล Relatives ของ Elderly คนหนึ่ง
app.get('/api/users/elderly/:elderlyId/relatives', async (req, res) => {
  try {
    const relatives = await Relative.find({ elderlyId: req.params.elderlyId })
      .populate('userId')
      .populate('elderlyId');

    res.json(relatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ดึงข้อมูล Relative คนหนึ่ง
app.get('/api/users/relatives/:id', async (req, res) => {
  try {
    const relative = await Relative.findById(req.params.id)
      .populate('userId')
      .populate('elderlyId');

    if (!relative) {
      return res.status(404).json({ message: 'Relative not found' });
    }

    res.json(relative);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Test route
app.get('/', (req, res) => {
  res.send('hello world');
});
/*
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
*/

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Only image')) {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'Server error' });
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
