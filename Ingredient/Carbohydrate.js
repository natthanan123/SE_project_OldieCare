const mongoose = require('mongoose');

// Carbohydrate Schema - คาร์โบไฮเดต (ข้าว, ขนมปัง, มันฝรั่ง เป็นต้น)
const carbohydrateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  caloriesPerGram: {
    type: Number,
    required: true
    // คาร์โบไฮเดต: ประมาณ 4 kcal ต่อ 1 กรัม
  },
  unit: {
    type: String,
    default: 'g'
  },
  type: String,
  // เช่น "Simple", "Complex", "Refined", "Whole Grain"
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Carbohydrate = mongoose.model('Carbohydrate', carbohydrateSchema);

module.exports = Carbohydrate;
