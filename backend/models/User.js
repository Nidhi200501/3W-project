const mongoose = require('mongoose');

// User Schema - Collection 1
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a full name'],
      trim: true
    },
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    badge: {
      type: String,
      default: 'Legend'
    },
    badgeLevel: {
      type: Number,
      default: 7
    },
    avatar: {
      type: String,
      default: ''
    },
    points: {
      type: Number,
      default: 100
    },
    balance: {
      type: Number,
      default: 0.00
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);
