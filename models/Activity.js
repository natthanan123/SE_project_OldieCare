// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // เปลี่ยนจาก elderlyId เป็น elderly ให้ตรงกับ MongoDB
  elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'Elderly' }, 
  // เปลี่ยนจาก title เป็น topic ให้ตรงกับ MongoDB
  topic: { type: String, required: true },
  // เปลี่ยนจาก time เป็น startTime ให้ตรงกับ MongoDB
  startTime: { type: String },
  endTime: { type: String }, // เพิ่ม endTime ตามที่ใช้ใน UI
  status: { type: String, default: 'Pending' },
  date: { type: Date }
});

module.exports = mongoose.model('Activity', activitySchema);