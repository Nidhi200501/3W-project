const Post = require('../models/Post');
const { getIsConnected } = require('../config/db');
const { memoryPosts } = require('../config/memoryStore');

// @desc    Get public posts feed with pagination
// @route   GET /api/posts?page=1&limit=5
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = req.query.search || '';
    const filter = req.query.filter || 'all';

    const startIndex = (page - 1) * limit;

    // In-memory Fallback if MongoDB service is offline
    if (!getIsConnected()) {
      let filtered = [...memoryPosts];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          p => (p.text && p.text.toLowerCase().includes(q)) ||
               (p.authorName && p.authorName.toLowerCase().includes(q))
        );
      }

      if (filter === 'most_liked') {
        filtered.sort((a, b) => b.likes.length - a.likes.length);
      } else if (filter === 'most_commented') {
        filtered.sort((a, b) => b.comments.length - a.comments.length);
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const totalPosts = filtered.length;
      const totalPages = Math.ceil(totalPosts / limit) || 1;
      const paginatedPosts = filtered.slice(startIndex, startIndex + limit);

      return res.json({
        success: true,
        count: paginatedPosts.length,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        posts: paginatedPosts
      });
    }

    // Mongoose MongoDB Query
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.text = searchRegex;
    }

    let sortOption = { createdAt: -1 };

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    let posts = await Post.find(query)
      .populate('userId', 'name email')
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);

    // Format post response to ensure author details exist
    const formattedPosts = posts.map(post => {
      const p = post.toObject();
      return {
        ...p,
        authorName: p.userId ? p.userId.name : (p.authorName || 'Anonymous'),
        authorUsername: p.userId ? p.userId.email.split('@')[0] : (p.authorUsername || 'user')
      };
    });

    res.json({
      success: true,
      count: formattedPosts.length,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      posts: formattedPosts
    });
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either text or an image for your post'
      });
    }

    if (!getIsConnected()) {
      const newPost = {
        _id: 'post_' + Date.now(),
        userId: req.user._id,
        authorName: req.user.name,
        authorUsername: req.user.email ? req.user.email.split('@')[0] : 'user',
        authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.user.name}`,
        authorBadge: 'Legend',
        authorBadgeLevel: 7,
        text: text || '',
        image: image || '',
        likes: [],
        comments: [],
        createdAt: new Date()
      };

      memoryPosts.unshift(newPost);

      return res.status(201).json({
        success: true,
        post: newPost
      });
    }

    const post = await Post.create({
      userId: req.user._id,
      text: text || '',
      image: image || '',
      likes: [],
      comments: []
    });

    const populatedPost = await Post.findById(post._id).populate('userId', 'name email');

    res.status(201).json({
      success: true,
      post: {
        ...populatedPost.toObject(),
        authorName: req.user.name,
        authorUsername: req.user.email.split('@')[0]
      }
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Toggle like / unlike on a post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const post = memoryPosts.find(p => p._id.toString() === req.params.id.toString());
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }

      const existingIndex = post.likes.findIndex(
        id => id.toString() === req.user._id.toString() || (id.userId && id.userId.toString() === req.user._id.toString())
      );

      if (existingIndex !== -1) {
        post.likes.splice(existingIndex, 1);
      } else {
        post.likes.push(req.user._id);
      }

      return res.json({
        success: true,
        likesCount: post.likes.length,
        likes: post.likes,
        isLiked: existingIndex === -1
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const alreadyLikedIndex = post.likes.findIndex(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyLikedIndex !== -1) {
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      likesCount: post.likes.length,
      likes: post.likes,
      isLiked: alreadyLikedIndex === -1
    });
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    if (!getIsConnected()) {
      const post = memoryPosts.find(p => p._id.toString() === req.params.id.toString());
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }

      const newComment = {
        _id: 'cmt_' + Date.now(),
        userId: req.user._id,
        name: req.user.name,
        text: text.trim(),
        createdAt: new Date()
      };

      post.comments.push(newComment);

      return res.status(201).json({
        success: true,
        commentsCount: post.comments.length,
        comments: post.comments
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const newComment = {
      userId: req.user._id,
      name: req.user.name,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      success: true,
      commentsCount: post.comments.length,
      comments: post.comments
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

module.exports = {
  getPosts,
  createPost,
  toggleLikePost,
  addComment
};
