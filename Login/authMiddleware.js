const { verifyToken } = require('./tokenHandler');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId || !decoded.role) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next(); // ✅ สำคัญมาก
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware
};
