const mongoose = require('mongoose');

// Relative Schema
const relativeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // ความเกี่ยวข้องกับผู้สูงอายุ
  elderlyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Elderly',
    required: true
  },
  // ความสัมพันธ์
  relationship: {
    type: String,
    required: true,
    enum: ['child', 'spouse', 'sibling', 'parent', 'grandchild', 'cousin', 'other'],
    // child = ลูก, spouse = คู่สมรส, sibling = พี่น้อง
    // parent = พ่อแม่, grandchild = หลาน, cousin = ลูกพี่ลูกน้อง, other = อื่นๆ
  },
  // ความสัมพันธ์เป็นข้อความ (ถ้าเลือก other)
  relationshipDetail: {
    type: String,
    default: ''
  },
  // ข้อมูลติดต่อ
  emergencyContact: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Relative = mongoose.model('Relative', relativeSchema);

module.exports = Relative;
