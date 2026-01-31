const mongoose = require('mongoose');

// Vegetable Schema - ผัก (บรอคโคลี่, กะหล่ำ, แครอท เป็นต้น)
const vegetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  caloriesPerGram: {
    type: Number,
    required: true
    // ผัก: ประมาณ 0.2-0.5 kcal ต่อ 1 กรัม (ผักส่วนใหญ่มีแคลอรี่ต่ำ)
  },
  unit: {
    type: String,
    default: 'g'
  },
  color: String,
  // เช่น "Green", "Red", "Orange"
  nutritionType: String,
  // เช่น "Leafy Green", "Root Vegetable", "Cruciferous"
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Vegetable = mongoose.model('Vegetable', vegetableSchema);

module.exports = Vegetable;
