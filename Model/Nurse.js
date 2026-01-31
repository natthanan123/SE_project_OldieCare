const mongoose = require('mongoose');
const { validateImageUrl } = require('../Utils/validators');

// Nurse Schema - extends with professional details
const nurseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // การศึกษา
  education: {
    degree: {
      type: String,
      required: true,
      // เช่น "Bachelor", "Diploma", "Certificate"
    },
    major: {
      type: String,
      required: true,
      // เช่น "Nursing Science", "Healthcare"
    },
    university: {
      type: String,
      required: true
    },
    graduationYear: {
      type: Number,
      required: true
    }
  },
  // ใบจบการศึกษา (รูปภาพ)
  educationDocuments: [{
    documentType: {
      type: String,
      enum: ['diploma', 'certificate', 'degree'],
      required: true
    },
    documentUrl: {
      type: String,
      required: true,
      validate: {
        validator: validateImageUrl,
        message: 'URL ต้องเป็นรูปภาพจริง ๆ (jpg, jpeg, png, gif, webp, bmp, svg, ico)'
      }
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  // สาขาความเชี่ยวชาญ
  specialization: {
    type: String,
    required: true,
    // เช่น "Elderly Care", "Palliative Care", "Critical Care", "General Nursing"
  },
  // ทักษะและความสามารถ
  skills: [{
    skill: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }],
  // ใบอนุญาต
  license: {
    number: {
      type: String,
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    }
  },
  // เอกสารใบอนุญาติ (รูปภาพ)
  licenseDocuments: [{
    licenseType: {
      type: String,
      enum: ['nursing_license', 'specialist_license', 'training_certificate'],
      required: true
    },
    documentUrl: {
      type: String,
      required: true,
      validate: {
        validator: validateImageUrl,
        message: 'URL ต้องเป็นรูปภาพจริง ๆ (jpg, jpeg, png, gif, webp, bmp, svg, ico)'
      }
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  // ประสบการณ์
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  // เวลาเข้างาน
  checkInTime: {
    type: String,
    // เช่น "08:00" หรือ "HH:MM"
  },
  // เวลาออกงาน
  checkOutTime: {
    type: String,
    // เช่น "17:00" หรือ "HH:MM"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Nurse = mongoose.model('Nurse', nurseSchema);

module.exports = Nurse;
