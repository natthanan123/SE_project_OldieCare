const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { deleteImage } = require('../Utils/imageHandler');
const User = require('../Model/User');
const Nurse = require('../Model/Nurse');
const Elderly = require('../Model/Elderly');
const Relative = require('../Model/Relative');

// ==================== DELETE ROUTES ====================

// 🗑️ ลบ licenseImage ของ Nurse
router.delete('/api/users/nurses/:id/license-image', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid nurse id' });
    }

    const nurse = await Nurse.findById(id);
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    if (!nurse.licenseImage) {
      return res.status(400).json({ message: 'No license image to delete' });
    }

    // ลบจาก Cloudinary
    await deleteImage(nurse.licenseImage);

    // ลบจาก Database
    nurse.licenseImage = null;
    await nurse.save();

    res.json({
      message: 'License image deleted successfully',
      nurse
    });

  } catch (error) {
    console.error('Delete License Image Error:', error);
    res.status(500).json({
      message: 'Error deleting license image',
      error: error.message
    });
  }
});

// 🗑️ ลบ certificateImages ตัวใดตัวหนึ่งของ Nurse
router.delete('/api/users/nurses/:id/certificate-image/:index', async (req, res) => {
  try {
    const { id, index } = req.params;
    const imageIndex = Number(index);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid nurse id' });
    }

    const nurse = await Nurse.findById(id);
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    if (!nurse.certificateImages || !nurse.certificateImages[imageIndex]) {
      return res.status(400).json({ message: 'Certificate image not found' });
    }

    // ลบจาก Cloudinary
    const imageUrl = nurse.certificateImages[imageIndex];
    await deleteImage(imageUrl);

    // ลบจาก Database (เอาออกจาก array)
    nurse.certificateImages = nurse.certificateImages.filter((_, i) => i !== imageIndex);
    await nurse.save();

    res.json({
      message: 'Certificate image deleted successfully',
      nurse
    });

  } catch (error) {
    console.error('Delete Certificate Image Error:', error);
    res.status(500).json({
      message: 'Error deleting certificate image',
      error: error.message
    });
  }
});

// 🗑️ ลบ Nurse (ลบ user ไปด้วย)
router.delete('/api/users/nurses/:id', async (req, res) => {
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
router.delete('/api/users/elderly/:id', async (req, res) => {
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
router.delete('/api/users/relatives/:id', async (req, res) => {
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

module.exports = router;
