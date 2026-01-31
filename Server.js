const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Akeaaswin:TeamCom31507@cluster0.qp5pw.mongodb.net/?appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

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

// 1. สร้าง Nurse
app.post('/api/users/nurse', async (req, res) => {
  try {
    const { name, email, phone, password, education, specialization, skills, license, yearsOfExperience } = req.body;

    // สร้าง User
    const user = new User({
      name,
      email,
      phone,
      role: 'nurse',
      password // ในการใช้งานจริง ควรเข้ารหัส password
    });

    const savedUser = await user.save();

    // สร้าง Nurse details
    const nurse = new Nurse({
      userId: savedUser._id,
      education,
      specialization,
      skills,
      license,
      yearsOfExperience
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
});

// 2. สร้าง Relative
app.post('/api/users/relative', async (req, res) => {
  try {
    const { name, email, phone, password, elderlyId, relationship, relationshipDetail, emergencyContact } = req.body;

    // สร้าง User
    const user = new User({
      name,
      email,
      phone,
      role: 'relative',
      password
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
});

// 3. สร้าง Elderly
app.post('/api/users/elderly', async (req, res) => {
  try {
    const { name, email, phone, password, dateOfBirth, nationalId, address, medicalConditions, medications, allergies, assignedNurse } = req.body;

    // สร้าง User
    const user = new User({
      name,
      email,
      phone,
      role: 'elderly',
      password
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

    res.status(201).json({
      message: 'Elderly person created successfully',
      user: savedUser,
      elderly: savedElderly
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating elderly person',
      error: error.message
    });
  }
});

// Routes - ดึงข้อมูล

// ดึงข้อมูล Nurse ทั้งหมด
app.get('/api/nurses', async (req, res) => {
  try {
    const nurses = await Nurse.find().populate('userId');
    res.json(nurses);
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
