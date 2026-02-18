const mongoose = require('mongoose');

// Elderly Schema
const elderlySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: { 
    type: String,
     default: "-" 
  },
  // วันเกิด
  dateOfBirth: {
    type: Date,
    required: true
  },
  // อายุ (ปี)
  age: {
    type: Number,
    required: true
  },
  // น้ำหนัก (กิโลกรัม)
  weight: {
    type: Number,
    required: true
  },
  // ส่วนสูง (เซนติเมตร)
  height: {
    type: Number,
    required: true
  },
  // ที่อยู่
  address: {
    street: String,
    district: String,
    province: String,
    postalCode: String
  },
  // โรคประจำตัว
  medicalConditions: [{
    disease: {
      type: String,
      required: true,
      // เช่น "Diabetes", "Hypertension", "Heart Disease"
    },
    diagnosisDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'controlled', 'resolved'],
      default: 'active'
    }
  }],
  // ยาที่ใช้อยู่
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      amount: Number,
      unit: {
        type: String,
        // เช่น "mg", "ml", "tablet"
      }
    },
    frequency: {
      type: String,
      required: true,
      // เช่น "once daily", "twice daily", "3 times daily", "as needed"
    },
    reason: String,
    // ผลข้างเคียง
    sideEffects: [String],
    startDate: Date,
    endDate: {
      type: Date,
      default: null
    }
  }],
  // ความเสี่ยง/โรคแพ้
  foodAllergies: [{
    allergen: String,
    reaction: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    }
  }],
  // โรคอื่นที่แพ้
  diseaseAllergies: [{
    allergen: String,
    reaction: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    }
  }],
  // พยาบาลที่ดูแล
  assignedNurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

   // 🔹 Base TDEE (คำนวณจาก weight/height/age)
  baseTDEE: {
    type: Number
  },


  // 🔹 New TDEE (BaseTDEE * activityFactor)
  newTDEE: {
    type: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});



const Elderly = mongoose.model('Elderly', elderlySchema);

module.exports = Elderly;
