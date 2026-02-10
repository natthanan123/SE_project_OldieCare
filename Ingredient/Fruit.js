const mongoose = require('mongoose');

// Fruit Schema - ผลไม้ (แอปเปิล, กล้วย, ส้ม เป็นต้น)
const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  caloriesPerGram: {
    type: Number,
    required: true
    // ผลไม้: ประมาณ 0.4-0.9 kcal ต่อ 1 กรัม (ผลไม้มีแคลอรี่ปานกลาง)
  },
  unit: {
    type: String,
    default: 'g'
  },
  color: String,
  sweetness: String,
  // เช่น "Low", "Medium", "High"
  season: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
