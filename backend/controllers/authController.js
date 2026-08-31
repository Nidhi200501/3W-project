const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getIsConnected } = require('../config/db');
const { memoryUsers } = require('../config/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'taskplanet_super_secret_jwt_key_2026_3w', {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register (or /api/auth/signup)
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (Name, Email, Password)' });
    }

    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '')).trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists in memoryUsers first
    const memoryUserExists = memoryUsers.find(
      u => u.email === cleanEmail || u.username === cleanUsername
    );

    if (memoryUserExists) {
      return res.status(400).json({ success: false, message: 'Email or Username already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

    // Always create in memoryStore to ensure instant availability
    const newMemoryUser = {
      _id: 'user_' + Date.now(),
      name,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      badge: 'Legend',
      badgeLevel: 7,
      avatar: avatarUrl,
      points: 100,
      balance: 0.00,
      createdAt: new Date()
    };
    memoryUsers.push(newMemoryUser);

    // If MongoDB is connected, also create in MongoDB database
    if (getIsConnected()) {
      try {
        const mongoUserExists = await User.findOne({
          $or: [{ email: cleanEmail }, { username: cleanUsername }]
        });

        if (mongoUserExists) {
          const field = mongoUserExists.email === cleanEmail ? 'Email' : 'Username';
          return res.status(400).json({ success: false, message: `${field} already registered` });
        }

        const mongoUser = await User.create({
          name,
          username: cleanUsername,
          email: cleanEmail,
          password: hashedPassword,
          badge: 'Legend',
          badgeLevel: 7,
          avatar: avatarUrl,
          points: 100,
          balance: 0.00
        });

        const token = generateToken(mongoUser._id);
        return res.status(201).json({
          success: true,
          token,
          user: {
            _id: mongoUser._id,
            name: mongoUser.name,
            username: mongoUser.username,
            email: mongoUser.email,
            badge: mongoUser.badge,
            badgeLevel: mongoUser.badgeLevel,
            avatar: mongoUser.avatar,
            points: mongoUser.points,
            balance: mongoUser.balance
          }
        });
      } catch (dbErr) {
        console.warn('MongoDB User save warning, falling back to memoryUser:', dbErr.message);
      }
    }

    // Return in-memory created user
    const token = generateToken(newMemoryUser._id);
    const { password: _, ...userData } = newMemoryUser;

    return res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const loginIdentifier = req.body.loginIdentifier || req.body.email || req.body.username;
    const password = req.body.password;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Username and Password' });
    }

    const cleanIdentifier = loginIdentifier.trim().toLowerCase();

    let targetUser = null;
    let isMatch = false;

    // 1. Check MongoDB first if connected
    if (getIsConnected()) {
      try {
        const mongoUser = await User.findOne({
          $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }]
        }).select('+password');

        if (mongoUser) {
          isMatch = await bcrypt.compare(password, mongoUser.password);
          if (isMatch) {
            targetUser = {
              _id: mongoUser._id,
              name: mongoUser.name,
              username: mongoUser.username,
              email: mongoUser.email,
              badge: mongoUser.badge,
              badgeLevel: mongoUser.badgeLevel,
              avatar: mongoUser.avatar,
              points: mongoUser.points,
              balance: mongoUser.balance
            };
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB Login check warning:', dbErr.message);
      }
    }

    // 2. Fallback to memoryUsers if not matched in MongoDB
    if (!targetUser) {
      const memoryUser = memoryUsers.find(
        u => u.email === cleanIdentifier || u.username === cleanIdentifier
      );

      if (memoryUser) {
        isMatch = await bcrypt.compare(password, memoryUser.password);
        if (isMatch) {
          const { password: _, ...userData } = memoryUser;
          targetUser = userData;
        }
      }
    }

    // 3. Reject if no user matched or password failed
    if (!targetUser) {
      return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
    }

    const token = generateToken(targetUser._id);

    return res.json({
      success: true,
      token,
      user: targetUser
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (getIsConnected()) {
      try {
        const mongoUser = await User.findById(req.user._id);
        if (mongoUser) {
          return res.json({ success: true, user: mongoUser });
        }
      } catch (dbErr) {}
    }

    const memoryUser = memoryUsers.find(u => u._id.toString() === req.user._id.toString());
    if (memoryUser) {
      const { password: _, ...userData } = memoryUser;
      return res.json({ success: true, user: userData });
    }

    res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

module.exports = { registerUser, loginUser, getMe };
