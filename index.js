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

const safeParse = (data, defaultValue) => {
  try {
    if (!data || data === "undefined") return defaultValue;
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return defaultValue;
  }
};


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
      // ✅ ดึง password จากคำขอ (จะถูกแฮชใน Model ก่อนบันทึก)
      /*
      const { name, email, phone, password, specialization, yearsOfExperience } = req.body;
      */
      const { name, email, phone, specialization, yearsOfExperience } = req.body;

      const education = safeParse(req.body.education, { degree: "", major: "", university: "", graduationYear: 0 });
      const skills = safeParse(req.body.skills, []);
      const license = safeParse(req.body.license, { number: "", expiryDate: new Date() });

      // สร้าง User
      const user = new User({
        name,
        email,
        phone,
        role: 'nurse',
        /* password, */ // 🔒 ปิด password ชั่วคราว
        profileImage: req.files.profileImage?.[0]?.path 
      });

      const savedUser = await user.save();

      // สร้าง Nurse
      const nurse = new Nurse({
        userId: savedUser._id,
        education,
        specialization: specialization || "-", // ✨ [CHANGED] ป้องกันค่าว่าง
        skills,
        license,
        yearsOfExperience: Number(yearsOfExperience) || 0, // ✨ [CHANGED] บังคับเป็น Number
        licenseImage: req.files.licenseImage?.[0]?.path,
        certificateImages: req.files.certificateImages
          ? req.files.certificateImages.map(f => f.path)
          : []
      });

      const savedNurse = await nurse.save();

      const userObj = savedUser.toObject();
      /* delete userObj.password; */ // 🔐 ปิด password ชั่วคราว

      res.status(201).json({
        message: 'Nurse created successfully',
        user: userObj,
        nurse: savedNurse
      });

    } catch (error) {
      console.error("Create Nurse Error:", error); // ✨ [CHANGED] เพิ่ม Log เพื่อให้ Debug ง่ายขึ้น
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
      // ✅ ดึง password จากคำขอ (จะถูกแฮชใน Model ก่อนบันทึก)
      /*
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
      */
      const {
        name,
        email,
        phone,
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
        /* password, */ // 🔒 ปิด password ชั่วคราว
        role: 'relative',
        profileImage: req.files.profileImage?.[0]?.path || null
      });

      const savedUser = await user.save();

      // สร้าง Relative
      const relative = new Relative({
        userId: savedUser._id,
        elderlyId,
        relationship: relationship || "child",
        relationshipDetail: relationshipDetail || "",
        emergencyContact: emergencyContact === 'true' || emergencyContact === true // ✨ [CHANGED] จัดการ boolean จาก FormData
      });

      const savedRelative = await relative.save();

      const userObj = savedUser.toObject();
      /* delete userObj.password; */ // 🔐 ปิด password ชั่วคราว

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
      // ✅ ดึง password จากคำขอ (จะถูกแฮชใน Model ก่อนบันทึก)
      /*
      const {
        name,
        email,
        phone,
        password,
        dateOfBirth,
        nationalId,
        allergies,
        assignedNurse
      } = req.body;
      */
      const {
        name,
        email,
        phone,
        dateOfBirth,
        assignedNurse
      } = req.body;

      const address = safeParse(req.body.address, { street: "", district: "", province: "", postalCode: "" });
      const medicalConditions = safeParse(req.body.medicalConditions, []);
      const medications = safeParse(req.body.medications, []);
      const foodAllergies = safeParse(req.body.foodAllergies, []); // ✨ [CHANGED] เพิ่มเพื่อให้ตรงกับ Model
      const diseaseAllergies = safeParse(req.body.diseaseAllergies, []); // ✨ [CHANGED] เพิ่มเพื่อให้ตรงกับ Model

      // ✅ สร้าง User พร้อม profileImage
      const user = new User({
        name,
        email,
        phone,
        role: 'elderly',
        /* password, */ // 🔒 ปิด password ชั่วคราว
        profileImage: req.files.profileImage?.[0]?.path || null
      });

      const savedUser = await user.save();

      // สร้าง Elderly details
      const elderly = new Elderly({
        userId: savedUser._id,
        dateOfBirth: dateOfBirth || new Date(),
        weight: Number(req.body.weight) || 0, // ✨ [CHANGED] รับค่า weight
        height: Number(req.body.height) || 0, // ✨ [CHANGED] รับค่า height
        address,
        medicalConditions,
        medications,
        foodAllergies, // ✨ [CHANGED]
        diseaseAllergies, // ✨ [CHANGED]
        assignedNurse: assignedNurse || null
      });

      const savedElderly = await elderly.save();

      const userObj = savedUser.toObject();
      /* delete userObj.password; */ // 🔐 ปิด password ชั่วคราว

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

// ==================== UPDATE ROUTES ====================

// ✏️ อัพเดท Nurse (สำหรับ settings)
app.put('/api/users/nurses/:id', 
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'certificateImages', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid nurse id' });
      }

      const nurse = await Nurse.findById(id);
      if (!nurse) {
        return res.status(404).json({ message: 'Nurse not found' });
      }

      // ✏️ อัพเดท Nurse fields
      const { specialization, yearsOfExperience } = req.body;
      if (specialization !== undefined) nurse.specialization = specialization;
      if (yearsOfExperience !== undefined) nurse.yearsOfExperience = Number(yearsOfExperience);

      if (req.files?.profileImage) {
        const user = await User.findById(nurse.userId);
        if (user) {
          user.profileImage = req.files.profileImage[0].path;
          await user.save();
        }
      }

      if (req.files?.licenseImage) {
        nurse.licenseImage = req.files.licenseImage[0].path;
      }

      if (req.files?.certificateImages) {
        nurse.certificateImages = req.files.certificateImages.map(f => f.path);
      }

      const updatedNurse = await nurse.save();

      res.json({
        message: 'Nurse updated successfully',
        nurse: updatedNurse
      });

    } catch (error) {
      console.error('Update Nurse Error:', error);
      res.status(500).json({
        message: 'Error updating nurse',
        error: error.message
      });
    }
  }
);

// ✏️ อัพเดท Elderly (สำหรับ settings)
app.put('/api/users/elderly/:id',
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid elderly id' });
      }

      const elderly = await Elderly.findById(id);
      if (!elderly) {
        return res.status(404).json({ message: 'Elderly not found' });
      }

      // ✏️ อัพเดท Elderly fields
      const { dateOfBirth, weight, height, allergies, medicalConditions, medications } = req.body;
      if (dateOfBirth !== undefined) elderly.dateOfBirth = dateOfBirth;
      if (weight !== undefined) elderly.weight = Number(weight);
      if (height !== undefined) elderly.height = Number(height);
      if (allergies !== undefined) elderly.foodAllergies = safeParse(allergies, elderly.foodAllergies);
      if (medicalConditions !== undefined) elderly.medicalConditions = safeParse(medicalConditions, elderly.medicalConditions);
      if (medications !== undefined) elderly.medications = safeParse(medications, elderly.medications);

      if (req.files?.profileImage) {
        const user = await User.findById(elderly.userId);
        if (user) {
          user.profileImage = req.files.profileImage[0].path;
          await user.save();
        }
      }

      const updatedElderly = await elderly.save();

      res.json({
        message: 'Elderly updated successfully',
        elderly: updatedElderly
      });

    } catch (error) {
      console.error('Update Elderly Error:', error);
      res.status(500).json({
        message: 'Error updating elderly',
        error: error.message
      });
    }
  }
);

// ✏️ อัพเดท Relative (สำหรับ settings)
app.put('/api/users/relatives/:id',
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid relative id' });
      }

      const relative = await Relative.findById(id);
      if (!relative) {
        return res.status(404).json({ message: 'Relative not found' });
      }

      // ✏️ อัพเดท Relative fields
      const { relationship, relationshipDetail } = req.body;
      if (relationship !== undefined) relative.relationship = relationship;
      if (relationshipDetail !== undefined) relative.relationshipDetail = relationshipDetail;

      if (req.files?.profileImage) {
        const user = await User.findById(relative.userId);
        if (user) {
          user.profileImage = req.files.profileImage[0].path;
          await user.save();
        }
      }

      const updatedRelative = await relative.save();

      res.json({
        message: 'Relative updated successfully',
        relative: updatedRelative
      });

    } catch (error) {
      console.error('Update Relative Error:', error);
      res.status(500).json({
        message: 'Error updating relative',
        error: error.message
      });
    }
  }
);

// ==================== DELETE ROUTES ====================

// 🗑️ ลบ Nurse (ลบ user ไปด้วย)
app.delete('/api/users/nurses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid nurse id' });
    }

    const nurse = await Nurse.findById(id);
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    // 🗑️ ลบ User ด้วย
    const userId = nurse.userId;
    await User.findByIdAndDelete(userId);
    await Nurse.findByIdAndDelete(id);

    res.json({
      message: 'Nurse and associated user deleted successfully'
    });

  } catch (error) {
    console.error('Delete Nurse Error:', error);
    res.status(500).json({
      message: 'Error deleting nurse',
      error: error.message
    });
  }
});

// 🗑️ ลบ Elderly (ลบ user ไปด้วย)
app.delete('/api/users/elderly/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid elderly id' });
    }

    const elderly = await Elderly.findById(id);
    if (!elderly) {
      return res.status(404).json({ message: 'Elderly not found' });
    }

    // 🗑️ ลบ User ด้วย
    const userId = elderly.userId;
    await User.findByIdAndDelete(userId);
    await Elderly.findByIdAndDelete(id);

    res.json({
      message: 'Elderly and associated user deleted successfully'
    });

  } catch (error) {
    console.error('Delete Elderly Error:', error);
    res.status(500).json({
      message: 'Error deleting elderly',
      error: error.message
    });
  }
});

// 🗑️ ลบ Relative (ลบ user ไปด้วย)
app.delete('/api/users/relatives/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid relative id' });
    }

    const relative = await Relative.findById(id);
    if (!relative) {
      return res.status(404).json({ message: 'Relative not found' });
    }

    // 🗑️ ลบ User ด้วย
    const userId = relative.userId;
    await User.findByIdAndDelete(userId);
    await Relative.findByIdAndDelete(id);

    res.json({
      message: 'Relative and associated user deleted successfully'
    });

  } catch (error) {
    console.error('Delete Relative Error:', error);
    res.status(500).json({
      message: 'Error deleting relative',
      error: error.message
    });
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
