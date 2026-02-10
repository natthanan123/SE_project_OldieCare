const mongoose = require('mongoose');

// Activity Schema - เก็บกิจกรรมพร้อมค่า kcal ต่อ นาที
const activitySchema = new mongoose.Schema({
  elderly: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Elderly',
    required: true
  },
  //หัวข้อ
  topic: {
        type: String,
        required: true
    },
  //รายละเอียด
  description: {
        type: String,
        default: ""
    },
  //เวลาเริ่ม
  startTime: {
        type: String, 
        required: true
    },
  //เวลาเสร็จ
  endTime: {
        type: String,
        required: true
    },
  //วันที่ของกิจกรรม
  date: {
    type: Date,
    required: true,
    default: Date.now 
  },
  //สถานะงาน
  status: {
    type: String,
    enum: ['Upcoming', 'completed'],
    default: 'Upcoming'
  },
  //Timestamp
  completedAt: {
    type: Date,
    default: null
  },

  createdAt: {
        type: Date,
        default: Date.now
    }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
