const { verifyToken } = require('./tokenHandler');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next(); // ⭐ สำคัญ
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
