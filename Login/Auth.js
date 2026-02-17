const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const Admin = require('../Model/Admin');
const { generateToken, refreshToken } = require('./tokenHandler');


// ================= User LOGIN =================
router.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier and password required' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    }).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const tokenData = generateToken(user._id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      message: 'Login success',
      user: userObj,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
      expiresInSeconds: tokenData.expiresInSeconds,
      idleTimeout: tokenData.idleTimeout
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// ================= ADMIN LOGIN =================
router.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier and password required' });
    }

    // login ด้วย username หรือ email
    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    }).select('+password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    // role เป็น admin
    const tokenData = generateToken(admin._id, 'admin');

    const adminObj = admin.toObject();
    delete adminObj.password;

    return res.json({
      message: 'Admin login success',
      admin: adminObj,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
      expiresInSeconds: tokenData.expiresInSeconds,
      idleTimeout: tokenData.idleTimeout
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Admin login failed', error: err.message });
  }
});

// ================= REFRESH TOKEN =================
router.post('/api/auth/refresh-token', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }

    const newTokenData = refreshToken(token);
    return res.json(newTokenData);

  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});

module.exports = router;
