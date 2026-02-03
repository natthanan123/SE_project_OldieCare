const mongoose = require('mongoose');/*
const { hashPassword, comparePassword } = require('../Utils/passwordHelper');
const { validatePassword } = require('../Utils/validators');
*/
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
  },/*
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: validatePassword,
      message: 'รหัสผ่านต้อง: ≥8 ตัว, มีตัวใหญ่ (A-Z), มีตัวเลข (0-9), มีสัญลักษณ์ (!@#$%^&* ฯลฯ)'
    }
  },*/
  profileImage: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
/*
// Hash password ก่อน save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});


// Method เปรียบเทียบ password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};
*/
const User = mongoose.model('User', userSchema);

module.exports = User;
