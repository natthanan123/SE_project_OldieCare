const mongoose = require('mongoose');

// Fat Schema - ไขมัน (น้ำมัน, เนย, อะโวคาโด เป็นต้น)
const fatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  caloriesPerGram: {
    type: Number,
    required: true
    // ไขมัน: ประมาณ 9 kcal ต่อ 1 กรัม
  },
  unit: {
    type: String,
    default: 'g'
  },
  type: String,
  // เช่น "Saturated", "Unsaturated", "Trans Fat"
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Fat = mongoose.model('Fat', fatSchema);

module.exports = Fat;
