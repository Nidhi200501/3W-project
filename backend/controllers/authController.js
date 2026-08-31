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

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    const cleanEmail = email.trim().toLowerCase();

    // In-memory fallback if MongoDB is not connected
    if (!getIsConnected()) {
      const userExists = memoryUsers.find(
        u => u.email === cleanEmail || u.username === cleanUsername
      );

      if (userExists) {
        return res.status(400).json({ success: false, message: 'Email or Username already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

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
    }

    // Mongoose MongoDB Flow
    const userExists = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }]
    });

    if (userExists) {
      const field = userExists.email === cleanEmail ? 'Email' : 'Username';
      return res.status(400).json({ success: false, message: `${field} already registered` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

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

    res.status(201).json({
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
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide credentials' });
    }

    const cleanIdentifier = loginIdentifier.trim().toLowerCase();

    if (!getIsConnected()) {
      const user = memoryUsers.find(
        u => u.email === cleanIdentifier || u.username === cleanIdentifier
      );

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);
      const { password: _, ...userData } = user;

      return res.json({
        success: true,
        token,
        user: userData
      });
    }

    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
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
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

const getMe = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const user = memoryUsers.find(u => u._id.toString() === req.user._id.toString());
      if (user) {
        const { password: _, ...userData } = user;
        return res.json({ success: true, user: userData });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

module.exports = { registerUser, loginUser, getMe };
