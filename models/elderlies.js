// OldieCare-Backend/models/elderlies.js
const mongoose = require('mongoose');

const elderlySchema = new mongoose.Schema({
  name: { type: String, required: true }, //
  room: { type: String }, //
  age: { type: Number }, //
  weight: { type: Number }, // เพิ่มตาม MongoDB
  height: { type: Number }, // เพิ่มตาม MongoDB
  medicalConditions: [String], // ใน DB ใช้ชื่อนี้ (ไม่ใช่ conditions)
  
  // ฟิลด์สำคัญสำหรับเชื่อมโยงพยาบาล
  // เปลี่ยนเป็น String เพื่อเทสก่อนตามที่ตกลงกัน
  assignedNurse: { type: mongoose.Schema.Types.ObjectId, default: null } 
}, { collection: 'elderlies' }); // 👈 เปลี่ยนเป็น elderlies ให้ตรงกับ DB

// เปลี่ยนชื่อ Model เป็น Elderly เพื่อให้สื่อความหมาย
module.exports = mongoose.model('Elderly', elderlySchema);