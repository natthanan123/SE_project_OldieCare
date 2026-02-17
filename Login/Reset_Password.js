// ⏳ COMMENTED: ระบบลืมรหัส (Forgot Password) ยังไม่เสร็จ - temporarily disabled

// const mongoose = require('mongoose');
// const { hashPassword } = require('../Utils/passwordHelper');
//
// const resetPasswordSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: false,
//     select: false
//   },
//   resetPasswordToken: {
//     type: String,
//     default: null
//   },
//   resetPasswordExpire: {
//     type: Date,
//     default: null
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });
//
// // Hash password if modified
// resetPasswordSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   try {
//     this.password = await hashPassword(this.password);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });
//
// module.exports = mongoose.model('ResetPassword', resetPasswordSchema);

module.exports = null; // Disabled
