const mongoose = require('mongoose');
const { validateImageUrl, validatePassword } = require('../Utils/validators');
const { hashPassword, comparePassword } = require('../Utils/passwordHelper');

// Base User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['nurse', 'relative', 'elderly'],
    required: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: validatePassword,
      message: 'รหัสผ่านต้อง: ≥8 ตัว, มีตัวใหญ่ (A-Z), มีตัวเลข (0-9), มีสัญลักษณ์ (!@#$%^&* ฯลฯ)'
    }
  },
  profileImage: {
    type: String,
    default: null,
    validate: {
      validator: validateImageUrl,
      message: 'URL ต้องเป็นรูปภาพจริง ๆ (jpg, jpeg, png, gif, webp, bmp, svg, ico)'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password ก่อน save
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    this.password = await hashPassword(this.password);
  } catch (err) {
    throw err;
  }
});

// Method เปรียบเทียบ password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
