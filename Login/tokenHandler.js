const jwt = require('jsonwebtoken');
const TOKEN_CONFIG = require('./tokenConfig');

const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (userId, role) => {
  const config = TOKEN_CONFIG[role];

  const token = jwt.sign({ userId, role }, SECRET_KEY, {
    expiresIn: config.expiresIn
  });

  return {
    token,
    expiresAt: new Date(Date.now() + config.expiresInSeconds * 1000),
    expiresInSeconds: config.expiresInSeconds,
    idleTimeout: config.idleTimeout
  };
};

const verifyToken = (token) => jwt.verify(token, SECRET_KEY);

const refreshToken = (token) => {
  const decoded = jwt.decode(token);
  return generateToken(decoded.userId, decoded.role);
};

module.exports = { generateToken, verifyToken, refreshToken };
