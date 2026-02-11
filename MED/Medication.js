const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  // 1. เชื่อมโยงกับผู้สูงอายุ
  elderly: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Elderly',
    required: true
  },
  
  // 2. ข้อมูลยา
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['Tablet', 'Capsule', 'Sachet', 'CC', 'Spoon'], // บังคับค่าตามหน้า UI
    required: true
  },
  
  // 3. เวลาที่ต้องกิน (จากหน้า UI 18:19)
  time: {
    type: String, 
    required: true
  },
  
  // 4. วันที่กินยา (เพื่อให้เป็นระบบวันต่อวัน)
  date: {
    type: Date,
    required: true,
    default: Date.now 
  },
  
  // 5. สถานะ (Upcoming, Taken, Missed)
  status: {
    type: String,
    enum: ['Upcoming', 'Taken', 'Missed'],
    default: 'Upcoming'
  },
  
  // 6. เวลากินจริง (Timestamp)
  takenAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;