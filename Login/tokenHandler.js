const jwt = require('jsonwebtoken');
const TOKEN_CONFIG = require('./tokenConfig');

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET is not defined in .env');
}

const generateToken = (userId, role) => {
  const config = TOKEN_CONFIG[role];

  if (!config) {
    throw new Error('Invalid role for token config');
  }

  const token = jwt.sign(
    { userId, role },
    SECRET_KEY,
    { expiresIn: config.expiresIn }
  );

  return {
    token,
    expiresAt: new Date(Date.now() + config.expiresInSeconds * 1000),
    expiresInSeconds: config.expiresInSeconds,
    idleTimeout: config.idleTimeout
  };
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const refreshToken = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY); // verify จริง
  return generateToken(decoded.userId, decoded.role);
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken
};
