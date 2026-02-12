const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'Elderly' }, // เชื่อมกับ ID สมเกียรติ
  name: { type: String, required: true },     // เช่น "horse pill"
  quantity: { type: Number },                 // เช่น 2
  unit: { type: String },                     // เช่น "Capsule"
  time: { type: String },                     // เช่น "18:00"
  status: { type: String, default: 'Upcoming' }, //
  date: { type: Date }
});

module.exports = mongoose.model('Medication', medicationSchema);