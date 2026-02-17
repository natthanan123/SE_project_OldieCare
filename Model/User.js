const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../Utils/passwordHelper');
const { validatePasswordSchema } = require('../Utils/validators');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['nurse', 'relative', 'elderly'],
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: validatePasswordSchema,
      message: 'Password format invalid'
  }
  },
  profileImage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔐 hash password ก่อน save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await hashPassword(this.password);
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return comparePassword(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);