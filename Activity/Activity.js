const mongoose = require('mongoose');

// Activity Schema - เก็บกิจกรรมพร้อมค่า kcal ต่อ นาที
const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  // แคลอรี่ที่ใช้ต่อ 1 นาที
  caloriesPerMinute: {
    type: Number,
    required: true
  },
  // หมวดกิจกรรม เช่น Exercise, DailyLiving, Therapy
  category: {
    type: String,
    default: 'Exercise'
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
