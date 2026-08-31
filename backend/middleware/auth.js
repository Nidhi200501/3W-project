const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { memoryUsers } = require('../config/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'taskplanet_super_secret_jwt_key_2026_3w'
      );

      // Memory store fallback if MongoDB is not active
      if (!getIsConnected()) {
        const user = memoryUsers.find(u => u._id.toString() === decoded.id.toString());
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
        const { password: _, ...userData } = user;
        req.user = userData;
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
