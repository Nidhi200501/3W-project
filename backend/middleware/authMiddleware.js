const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const { findUserById } = require('../utils/inMemoryStore');

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

      let user = null;
      if (isDbConnected() && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          user = await User.findById(decoded.id).select('-password');
          if (!user) {
            user = await User.findOne({ _id: decoded.id }).select('-password');
          }
        } catch (err) {
          user = null;
        }
      }

      if (!user) {
        const memUser = findUserById(decoded.id);
        if (memUser) {
          const { password, ...userWithoutPass } = memUser;
          user = userWithoutPass;
        }
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ success: false, message: `Not authorized, token failed: ${error.message}` });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };

