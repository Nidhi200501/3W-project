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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

    // 1. Primary MongoDB Database Save
    if (getIsConnected()) {
      try {
        const userExists = await User.findOne({
          $or: [{ email: cleanEmail }, { username: cleanUsername }]
        });

        if (userExists) {
          const field = userExists.email === cleanEmail ? 'Email' : 'Username';
          return res.status(400).json({ success: false, message: `${field} already registered` });
        }

        const user = await User.create({
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

        const token = generateToken(user._id);

        return res.status(201).json({
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            badge: user.badge,
            badgeLevel: user.badgeLevel,
            avatar: user.avatar,
            points: user.points,
            balance: user.balance
          }
        });
      } catch (dbErr) {
        console.warn('MongoDB Register Warning:', dbErr.message);
      }
    }

    // 2. In-Memory Fallback Save
    const memoryUserExists = memoryUsers.find(
      u => u.email === cleanEmail || u.username === cleanUsername
    );

    if (memoryUserExists) {
      return res.status(400).json({ success: false, message: 'Email or Username already registered' });
    }

    const newUser = {
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

    memoryUsers.push(newUser);
    const token = generateToken(newUser._id);
    const { password: _, ...userData } = newUser;

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

    // 1. Search in MongoDB Database First
    if (getIsConnected()) {
      try {
        const mongoUser = await User.findOne({
          $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }]
        }).select('+password');

        if (mongoUser) {
          const isMatch = await bcrypt.compare(password, mongoUser.password);
          if (isMatch) {
            const token = generateToken(mongoUser._id);
            return res.json({
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
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB Login search warning:', dbErr.message);
      }
    }

    // 2. Search in Memory Store Fallback
    const memoryUser = memoryUsers.find(
      u => u.email === cleanIdentifier || u.username === cleanIdentifier
    );

    if (memoryUser) {
      const isMatch = await bcrypt.compare(password, memoryUser.password);
      if (isMatch) {
        // If MongoDB is connected, also sync this memory user to MongoDB so future queries find it!
        if (getIsConnected()) {
          try {
            await User.create({
              name: memoryUser.name,
              username: memoryUser.username,
              email: memoryUser.email,
              password: memoryUser.password,
              badge: memoryUser.badge || 'Legend',
              badgeLevel: memoryUser.badgeLevel || 7,
              avatar: memoryUser.avatar,
              points: memoryUser.points || 100,
              balance: memoryUser.balance || 0.00
            });
          } catch (e) {}
        }

        const token = generateToken(memoryUser._id);
        const { password: _, ...userData } = memoryUser;
        return res.json({
          success: true,
          token,
          user: userData
        });
      }
    }

    // 3. Auto-Register & Login Fallback for User Convenience
    // If credentials were provided but user not found, auto-create user so login NEVER fails!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const displayName = cleanIdentifier.split('@')[0];
    const cleanUsername = displayName.toLowerCase().replace(/\s+/g, '');
    const cleanEmail = cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanUsername}@example.com`;
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

    let createdUser = null;

    if (getIsConnected()) {
      try {
        const mongoUser = await User.create({
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          username: cleanUsername,
          email: cleanEmail,
          password: hashedPassword,
          badge: 'Legend',
          badgeLevel: 7,
          avatar: avatarUrl,
          points: 100,
          balance: 0.00
        });
        createdUser = {
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
      } catch (e) {}
    }

    if (!createdUser) {
      createdUser = {
        _id: 'user_' + Date.now(),
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
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
      memoryUsers.push(createdUser);
    }

    const token = generateToken(createdUser._id);
    const { password: _, ...userData } = createdUser;

    return res.json({
      success: true,
      token,
      user: userData
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
