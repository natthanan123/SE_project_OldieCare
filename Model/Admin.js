const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../Utils/passwordHelper');

// Admin Schema - เก็บข้อมูลผู้ดูแลระบบพื้นฐาน
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
  ,
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before save
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

// compare password helper
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
