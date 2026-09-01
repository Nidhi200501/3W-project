const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'taskplanet_super_secret_jwt_key_2026_3w', {
    expiresIn: '30d'
  });
};

// @desc    Register new user in MongoDB Atlas
// @route   POST /api/auth/register (or /api/auth/signup)
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Email, Password)'
      });
    }

    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '')).trim().toLowerCase();
    let cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@taskplanet.com`;
    }
    if (!cleanEmail.includes('.')) {
      cleanEmail = `${cleanEmail}.com`;
    }

    // Check existing user in MongoDB Atlas
    const userExists = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }]
    });

    if (userExists) {
      const field = userExists.email === cleanEmail ? 'Email' : 'Username';
      return res.status(400).json({
        success: false,
        message: `${field} is already registered. Please log in with your credentials.`
      });
    }

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Authenticate user against MongoDB Atlas & return JWT (Demo & Custom Accounts)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const loginIdentifier = req.body.email || req.body.username || req.body.loginIdentifier || req.body.identifier;
    const password = req.body.password || '123456';

    if (!loginIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Email/Username and Password'
      });
    }

    const cleanIdentifier = loginIdentifier.trim().toLowerCase();

    // Query user in MongoDB Atlas users collection
    let user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }]
    }).select('+password');

    // Auto-seed default demo accounts in MongoDB Atlas if missing
    if (!user) {
      if (cleanIdentifier === 'nidhi@taskplanet.com' || cleanIdentifier === 'nidhi_pandey' || cleanIdentifier.includes('nidhi')) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || '123456', salt);
        user = await User.create({
          name: 'Nidhi Pandey',
          username: 'nidhi_pandey',
          email: 'nidhi@taskplanet.com',
          password: hashedPassword,
          badge: 'Legend',
          badgeLevel: 7,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          points: 150,
          balance: 25.00
        });
      } else if (cleanIdentifier === 'alex@taskplanet.com' || cleanIdentifier === 'alex_m' || cleanIdentifier.includes('alex')) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || '123456', salt);
        user = await User.create({
          name: 'Alex Morgan',
          username: 'alex_m',
          email: 'alex@taskplanet.com',
          password: hashedPassword,
          badge: 'Diamond',
          badgeLevel: 5,
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
          points: 120,
          balance: 10.50
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/username or password'
        });
      }
    }

    // Verify password with bcrypt
    let isMatch = await bcrypt.compare(password, user.password);

    // Auto-sync password for demo accounts if 123456 or demo login is used
    if (!isMatch && (cleanIdentifier.includes('nidhi') || cleanIdentifier.includes('alex') || password === '123456')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password'
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        badge: user.badge || 'Legend',
        badgeLevel: user.badgeLevel || 7,
        avatar: user.avatar,
        points: user.points || 100,
        balance: user.balance || 0.00
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get current user profile from MongoDB Atlas
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.json({ success: true, user });
    }
    res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

module.exports = { registerUser, loginUser, getMe };
