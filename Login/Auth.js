const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const { generateToken, refreshToken } = require('../Login/tokenHandler');

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier and password required' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    }).select('+password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    const tokenData = generateToken(user._id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: 'Login success',
      user: userObj,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
      expiresInSeconds: tokenData.expiresInSeconds,
      idleTimeout: tokenData.idleTimeout
    });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

router.post('/refresh-token', (req, res) => {
  try {
    const { token } = req.body;
    const newTokenData = refreshToken(token);
    res.json(newTokenData);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
