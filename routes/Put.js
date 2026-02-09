const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { upload, deleteImage } = require('../Utils/imageHandler');
const User = require('../Model/User');
const Nurse = require('../Model/Nurse');
const Elderly = require('../Model/Elderly');
const Relative = require('../Model/Relative');

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
router.put('/api/users/nurses/:id', 
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
      const { name, email, phone, address, specialization, yearsOfExperience } = req.body;
      
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
router.put('/api/users/elderly/:id',
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
      const { name, email, phone, address, dateOfBirth, weight, height, allergies, medicalConditions, medications } = req.body;
      
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
router.put('/api/users/relatives/:id',
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
      const { name, email, phone, address, relationship, relationshipDetail } = req.body;
      
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
router.put('/api/elderly/assign-nurse', async (req, res) => {
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

module.exports = router;
