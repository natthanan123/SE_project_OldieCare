const express = require('express');
const router = express.Router();
const { recommendNurses } = require('../test/recommender');
const Nurse = require('../Model/Nurse');
const Elderly = require('../Model/Elderly');
const Relative = require('../Model/Relative');
const Medication = require('../MED/Medication');
const Admin = require('../Model/Admin');


// ==================== READ ROUTES ====================

// ดึงข้อมูล Nurse ทั้งหมด
router.get('/api/users/nurses', async (req, res) => {
  try {
    const nurses = await Nurse.find().populate('userId', 'name profileImage');

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
router.get('/api/users/nurses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid nurse id' });
    }

    const nurse = await Nurse.findById(id).populate('userId', 'name profileImage');

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
router.get('/api/users/elderly', async (req, res) => {
  try {
    const elderly = await Elderly.find()
      .populate('userId', '-password')
      .populate('assignedNurse');

    res.json(elderly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Elderly คนหนึ่ง
router.get('/api/users/elderly/:id', async (req, res) => {
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

// ดึงข้อมูล Relatives ทั้งหมด
router.get('/api/users/relatives', async (req, res) => {
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
router.get('/api/users/elderly/:elderlyId/relatives', async (req, res) => {
  try {
    const relatives = await Relative.find({ elderlyId: req.params.elderlyId })
      .populate('userId', '-password')
      .populate('elderlyId');

    res.json(relatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Relative คนหนึ่ง
router.get('/api/users/relatives/:id', async (req, res) => {
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

// ดึงรายชื่อพยาบาลที่แนะนำ
router.get('/api/recommend-nurses', async (req, res) => {
  try {
    const nurses = await Nurse.find().populate('userId');

    const result = recommendNurses(nurses);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
router.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ===== Admin read routes =====
// ดึงรายชื่อ Admin ทั้งหมด (ไม่ส่ง password)
router.get('/api/admins', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.status(200).json(admins);
  } catch (err) {
    console.error('GET /api/admins error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ดึง Admin คนหนึ่ง
router.get('/api/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid admin id' });

    const admin = await Admin.findById(id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json(admin);
  } catch (err) {
    console.error('GET /api/admins/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Test route
router.get('/', (req, res) => {
  res.send('hello world');
});
//elderly-card ของพยาบาลที่แสดงข้อมูลใน My Patients
router.get('/api/users/elderly-card', async (req, res) => {
    try {
        const elderlyList = await Elderly.find()
            .populate('userId', 'name profileImage') 
            .sort({ createdAt: -1 });
        const formattedData = elderlyList.map(item => {
            const user = item.userId || {}; 
            return {
                id: item._id,
                name: user.name || item.name,
                image: user.profileImage || null,
                age: item.age,
                conditions: item.medicalConditions || [],
                allergies: item.diseaseAllergies || [],
                room: item.room || "-"
            };
        });

        res.status(200).json(formattedData);

    } catch (err) {
        console.error("Get Elderly Card Error:", err);
        res.status(500).json({ error: err.message });
    }
});
/*
//ดึงรายการยา
router.get('/api/medication', async (req, res) => {
    try {
        const { elderlyId, date } = req.query;

        if (!elderlyId) {
            return res.status(400).json({ message: "Elderly ID is required" });
        }

        //ตั้งเวลา
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const medications = await Medication.find({
            elderly: elderlyId,
            date: {
                $gte: startOfDay, 
                $lte: endOfDay
            }
        }).sort({ time: 1 });

        res.status(200).json(medications);

    } catch (error) {
        console.error("Get Medication Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
*/
// ✅ 1. ดึงข้อมูลกิจกรรม (Activity) ทั้งหมด
// ใช้สำหรับหน้า Home เพื่อคำนวณจำนวนงานค้างรวมของพยาบาล
router.get('/api/activity/all', async (req, res) => {
  try {
    // ดึงงานทั้งหมดและเรียงตามวันที่และเวลา
    const activities = await Activity.find().sort({ date: 1, startTime: 1 });
    res.status(200).json(activities);
  } catch (error) {
    console.error("GET Activity Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ 2. ดึงข้อมูลยา (Medication) ของผู้สูงอายุรายบุคคล
// ใช้สำหรับหน้า NurseTasksScreen และการคำนวณงานป้อนยา
router.get('/api/medication', async (req, res) => {
  try {
    const { elderlyId } = req.query; // รับ ID จาก query parameter

    if (!elderlyId) {
      return res.status(400).json({ message: "Elderly ID is required" });
    }

    // ค้นหายาที่ผูกกับ ID ผู้สูงอายุคนนั้น
    const medications = await Medication.find({ elderly: elderlyId }).sort({ time: 1 });
    res.status(200).json(medications);
  } catch (error) {
    console.error("GET Medication Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ ดึงข้อมูล Activity ตามผู้สูงอายุรายบุคคล
router.get('/api/activity', async (req, res) => {
  try {
    const { elderlyId } = req.query; // รับ ID จาก query

    if (!elderlyId) {
      return res.status(400).json({ message: "Elderly ID is required" });
    }

    const activities = await Activity.find({ elderly: elderlyId })
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error("GET Activity Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
