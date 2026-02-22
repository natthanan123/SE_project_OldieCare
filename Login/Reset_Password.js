const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const Admin = require('../Model/Admin');
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

    // หาใน User ก่อน
    let account = await User.findOne({
      $or: [
        { email: identifier },
        { name: identifier }
      ]
    }).select('+password');

    let role = "user";

    // ถ้าไม่เจอใน User → หาใน Admin
    if (!account) {
      account = await Admin.findOne({
        $or: [
          { email: identifier },
          { username: identifier },
        ]
      }).select('+password');

      role = "admin";
    }

    // ถ้าไม่เจอทั้ง User และ Admin
    if (!account) {
      return res.status(404).json({
        message: "User or Admin not found"
      });
    }

    // ตั้งรหัสใหม่ (pre('save') จะ hash ให้)
    account.password = newPassword;
    await account.save();

    res.json({
      message: `Password reset successfully for ${role}`
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
