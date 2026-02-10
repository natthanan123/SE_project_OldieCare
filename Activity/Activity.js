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

  description: {
        type: String,
        default: ""
    },
  startTime: {
        type: String, 
        required: true
    },
  endTime: {
        type: String,
        required: true
    },
  createdAt: {
        type: Date,
        default: Date.now
    }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
