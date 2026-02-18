const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { upload, deleteImage } = require('../Utils/imageHandler');
const User = require('../Model/User');
const Nurse = require('../Model/Nurse');
const Elderly = require('../Model/Elderly');
const Relative = require('../Model/Relative');
const Admin = require('../Model/Admin');
const { authMiddleware , roleMiddleware} = require('../Login/authMiddleware');

const safeParse = (data, defaultValue) => {
  try {
    if (!data || data === "undefined") return defaultValue;
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return defaultValue;
  }
};

// ==================== UPDATE ROUTES ====================

// ✏️ อัพเดท Nurse (สำหรับ settings)
router.put('/api/users/nurses/:id', authMiddleware, roleMiddleware(['admin']),
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

      // ✏️ อัพเดท User fields (name, email, phone, address)
      // ❗ ห้ามแก้ไข password ผ่าน route นี้
      const { name, email, phone, address, specialization, yearsOfExperience, password } = req.body;
      
      if (password !== undefined) {
        return res.status(403).json({ message: 'Password cannot be updated here. Please use change-password endpoint.' });
      }
      
      const user = await User.findById(nurse.userId);
      if (user) {
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        await user.save();
      }

      // ✏️ อัพเดท Nurse fields
      if (specialization !== undefined) nurse.specialization = specialization;
      if (yearsOfExperience !== undefined) nurse.yearsOfExperience = Number(yearsOfExperience);

      if (req.files?.profileImage) {
        const user = await User.findById(nurse.userId);
        if (user) {
          // ลบรูปเก่าจาก Cloudinary
          if (user.profileImage) {
            await deleteImage(user.profileImage);
          }
          user.profileImage = req.files.profileImage[0].path;
          await user.save();
        }
      }

      if (req.files?.licenseImage) {
        // ❗ เก็บรูปเก่า ไม่ลบอัตโนมัติ (ให้ user ลบเอง)
        nurse.licenseImage = req.files.licenseImage[0].path;
      }

      if (req.files?.certificateImages) {
        // ❗ เก็บรูปเก่า ไม่ลบอัตโนมัติ (ให้ user ลบเอง)
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
router.put('/api/users/elderly/:id', authMiddleware, roleMiddleware(['admin']),
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
      // ❗ ห้ามแก้ไข password ผ่าน route นี้
      const { name, email, phone, address, dateOfBirth, age, weight, height, allergies, medicalConditions, medications, password } = req.body;
      
      if (password !== undefined) {
        return res.status(403).json({ message: 'Password cannot be updated here. Please use change-password endpoint.' });
      }
      
      // Update User fields
      const user = await User.findById(elderly.userId);
      if (user) {
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        await user.save();
      }
      
      // Update Elderly fields
      if (dateOfBirth !== undefined) elderly.dateOfBirth = dateOfBirth;
      if (age !== undefined) elderly.age = Number(age);
      if (weight !== undefined) elderly.weight = Number(weight);
      if (height !== undefined) elderly.height = Number(height);
      if (allergies !== undefined) elderly.foodAllergies = safeParse(allergies, elderly.foodAllergies);
      if (medicalConditions !== undefined) elderly.medicalConditions = safeParse(medicalConditions, elderly.medicalConditions);
      if (medications !== undefined) elderly.medications = safeParse(medications, elderly.medications);

      if (req.files?.profileImage) {
        const user = await User.findById(elderly.userId);
        if (user) {
          // ลบรูปเก่าจาก Cloudinary
          if (user.profileImage) {
            await deleteImage(user.profileImage);
          }
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
router.put('/api/users/relatives/:id', authMiddleware, roleMiddleware(['admin']),
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
      // ❗ ห้ามแก้ไข password ผ่าน route นี้
      const { name, email, phone, address, relationship, relationshipDetail, password } = req.body;
      
      if (password !== undefined) {
        return res.status(403).json({ message: 'Password cannot be updated here. Please use change-password endpoint.' });
      }
      
      // Update User fields
      const user = await User.findById(relative.userId);
      if (user) {
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        await user.save();
      }
      
      // Update Relative fields
      if (relationship !== undefined) relative.relationship = relationship;
      if (relationshipDetail !== undefined) relative.relationshipDetail = relationshipDetail;

      if (req.files?.profileImage) {
        const user = await User.findById(relative.userId);
        if (user) {
          // ลบรูปเก่าจาก Cloudinary
          if (user.profileImage) {
            await deleteImage(user.profileImage);
          }
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

// ✏️ Assign Nurse ให้ Elderly
router.put('/api/elderly/assign-nurse',authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { elderlyId, nurseId } = req.body;

    const elderly = await Elderly.findById(elderlyId);
    if (!elderly) return res.status(404).json({ message: 'Elderly not found' });

    const newNurse = await Nurse.findById(nurseId);
    if (!newNurse) return res.status(404).json({ message: 'Nurse not found' });

    // ❗ ถ้ามีพยาบาลอยู่แล้ว → เอาออกก่อน
    if (elderly.assignedNurse) {
      const oldNurse = await Nurse.findById(elderly.assignedNurse);

      if (oldNurse) {
        oldNurse.patientCount = Math.max(0, oldNurse.patientCount - 1);
        await oldNurse.save();
      }

      elderly.assignedNurse = null;
    }

    // ❗ เช็ค nurse ใหม่ว่าเต็มไหม
    const MAX_PATIENTS = 3;
    if (newNurse.patientCount >= MAX_PATIENTS) {
      return res.status(400).json({ message: 'Nurse is full' });
    }

    // ✅ assign nurse ใหม่
    elderly.assignedNurse = nurseId;
    await elderly.save();

    newNurse.patientCount = (newNurse.patientCount || 0) + 1;
    await newNurse.save();

    res.status(200).json({
      message: 'Reassigned nurse successfully',
      elderly
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✏️ Deselect Nurse ออกจาก Elderly
router.put('/api/elderly/deselect-nurse',authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { elderlyId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(elderlyId)) {
      return res.status(400).json({ message: 'Invalid elderly id' });
    }

    const elderly = await Elderly.findById(elderlyId);
    if (!elderly) {
      return res.status(404).json({ message: 'Elderly not found' });
    }

    // ถ้าไม่มี nurse อยู่แล้ว
    if (!elderly.assignedNurse) {
      return res.status(400).json({ message: 'Elderly has no assigned nurse' });
    }

    const nurse = await Nurse.findById(elderly.assignedNurse);
    if (nurse) {
      nurse.patientCount = Math.max(0, (nurse.patientCount || 0) - 1);
      await nurse.save();
    }

    // set assignedNurse เป็น null
    elderly.assignedNurse = null;
    await elderly.save();

    res.status(200).json({
      message: 'Nurse deselected successfully',
      elderly
    });

  } catch (err) {
    console.error('Deselect Nurse Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ===== Admin update =====
router.put('/api/admins/:id', authMiddleware, roleMiddleware(['admin']), upload.single('profileImage'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid admin id' });

    const admin = await Admin.findById(id).select('+password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const { username, email, password } = req.body;
    if (username !== undefined) admin.username = username;
    if (email !== undefined) admin.email = email;
    // ❗ ห้ามแก้ไข password ผ่าน route นี้ (ต้องใช้ change-password endpoint แทน)
    if (password !== undefined && password !== '') {
      return res.status(403).json({ message: 'Password cannot be updated here. Please use change-password endpoint.' });
    }

    if (req.file) {
      if (admin.profileImage) {
        try { await deleteImage(admin.profileImage); } catch (e) { console.warn('Failed to delete old admin image:', e.message); }
      }
      admin.profileImage = req.file.path;
    }

    const updated = await admin.save();
    const out = updated.toObject();
    delete out.password;
    res.json({ message: 'Admin updated successfully', admin: out });
  } catch (err) {
    console.error('Update Admin Error:', err);
    res.status(500).json({ message: 'Error updating admin', error: err.message });
  }
});

module.exports = router;