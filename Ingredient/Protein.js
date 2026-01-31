const mongoose = require('mongoose');

// Protein Schema - โปรตีน (เนื้อสัตว์, ไข่, นม, ถั่ว เป็นต้น)
const proteinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  caloriesPerGram: {
    type: Number,
    required: true
    // โปรตีน: ประมาณ 4 kcal ต่อ 1 กรัม
  },
  unit: {
    type: String,
    default: 'g'
  },
  source: String,
  // เช่น "Animal", "Plant"
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Protein = mongoose.model('Protein', proteinSchema);

module.exports = Protein;
