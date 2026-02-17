const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const { validatePasswordSchema } = require('../Utils/validators');

/**
 * POST /api/reset-password
 * body:
 * {
 *   "identifier": "username หรือ email",
 *   "newPassword": "Password123!"
 * }
 */
router.post('/api/reset-password', async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;

    if (!identifier || !newPassword) {
      return res.status(400).json({
        message: "identifier and newPassword are required"
      });
    }

    // validate password format
    if (!validatePasswordSchema(newPassword)) {
      return res.status(400).json({
        message: "Password format invalid"
      });
    }

    // หา user จาก username หรือ email
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { name: identifier } // name = username
      ]
    }).select('+password');

    if (!user) {
      return res.status(404).json({
        message: "User not found (invalid email or username)"
      });
    }

    // ตั้งรหัสใหม่
    user.password = newPassword; // pre('save') จะ hash ให้
    await user.save();

    res.json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;

