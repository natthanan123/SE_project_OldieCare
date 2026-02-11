const express = require('express');
const router = express.Router();
const { recommendNurses } = require('../test/recommender');
const Nurse = require('../Model/Nurse');
const Elderly = require('../Model/Elderly');
const Relative = require('../Model/Relative');

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
      .populate('userId')
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

// ดึงข้อมูล Relatives ทั้งหมด
router.get('/api/users/relatives', async (req, res) => {
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
router.get('/api/users/elderly/:elderlyId/relatives', async (req, res) => {
  try {
    const relatives = await Relative.find({ elderlyId: req.params.elderlyId })
      .populate('userId')
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

module.exports = router;
