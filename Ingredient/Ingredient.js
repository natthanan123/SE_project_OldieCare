const mongoose = require('mongoose');

// Ingredient Schema - สำหรับเก็บข้อมูลวัตถุดิบ
const ingredientSchema = new mongoose.Schema({
  // ชื่อวัตถุดิบ
  name: {
    type: String,
    required: true,
    unique: true
  },
  // หมวดหมู่วัตถุดิบ
  category: {
    type: String,
    required: true,
    enum: ['Protein', 'Carbohydrate', 'Fat', 'Vegetable', 'Fruit'],
    // Protein: โปรตีน
    // Carbohydrate: คาร์โบไฮเดต
    // Fat: ไขมัน
    // Vegetable: ผัก
    // Fruit: ผลไม้
  },
  // kcal ต่อ 1 กรัม
  caloriesPerGram: {
    type: Number,
    required: true,
    // เช่น 4 kcal ต่อ 1 กรัม
  },
  // หน่วย (กรัม, ml, ช้อน, ชิ้น เป็นต้น)
  unit: {
    type: String,
    default: 'g'
  },
  // รายละเอียด
  description: {
    type: String
  },
  // วันที่สร้าง
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
