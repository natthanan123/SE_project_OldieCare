const express = require('express');
const router = express.Router();
const User = require('../Model/User');

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  // 1. หา user จาก email หรือ name
  const user = await User.findOne({
    $or: [
      { email: identifier },
      { name: identifier }
    ]
  }).select('+password');

  // 2. ถ้าไม่เจอ
  if (!user) return res.status(404).json({ message: 'User not found' });

  // 3. compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

  // 4. ลบ password ก่อนส่งกลับ
  const userObj = user.toObject();
  delete userObj.password;

  res.json({
    message: 'Login success',
    user: userObj
  });
});

module.exports = router;
