const mongoose = require('mongoose');


// Nurse Schema - extends with professional details
  const nurseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // การศึกษา
  education: {
    degree: { type: String, required: true },
    major: { type: String, required: true },
    university: { type: String, required: true },
    graduationYear: { type: Number, required: true }
  },

  // สาขาความเชี่ยวชาญ
  specialization: {
    type: String,
    required: true
  },

  // ทักษะ
  skills: [
    {
      skill: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
      }
    }
  ],

  // ใบอนุญาต (ข้อมูล)
  license: {
    number: { type: String, required: true },
    expiryDate: { type: Date, required: true }
  },

  // ✅ รูปใบอนุญาต (1 รูป)
  licenseImage: {
    type: String // Cloudinary URL
  },

  // ✅ รูป certificate / ใบจบ (หลายรูป)
  certificateImages: [
    {
      type: String // Cloudinary URL
    }
  ],

  yearsOfExperience: {
    type: Number,
    default: 0
  },

  checkInTime: String,
  checkOutTime: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Nurse = mongoose.model('Nurse', nurseSchema);

module.exports = Nurse;
