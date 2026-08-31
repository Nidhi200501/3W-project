const mongoose = require('mongoose');

// Comment Sub-schema
const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Like Sub-schema
const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Post Schema - Collection 2
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String
    },
    authorUsername: {
      type: String
    },
    authorAvatar: {
      type: String,
      default: ''
    },
    authorBadge: {
      type: String,
      default: 'Legend'
    },
    authorBadgeLevel: {
      type: Number,
      default: 7
    },
    text: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    likes: [LikeSchema],
    comments: [CommentSchema],
    sharesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', PostSchema);
