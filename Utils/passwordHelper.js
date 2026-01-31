const bcrypt = require('bcryptjs');

// Hash password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw err;
  }
};

// เปรียบเทียบ password
const comparePassword = async (candidatePassword, hashedPassword) => {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  hashPassword,
  comparePassword
};
