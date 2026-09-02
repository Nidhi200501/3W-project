const Post = require('../models/Post');
const { isDbConnected } = require('../config/db');
const { getInMemoryPosts, createInMemoryPost } = require('../utils/inMemoryStore');

// @desc    Get public posts feed from MongoDB Atlas or In-Memory fallback
// @route   GET /api/posts?page=1&limit=5
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = (req.query.search || '').trim().toLowerCase();

    if (!isDbConnected()) {
      const allPosts = getInMemoryPosts(search);
      const totalPosts = allPosts.length;
      const totalPages = Math.ceil(totalPosts / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedPosts = allPosts.slice(startIndex, startIndex + limit);

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

    const startIndex = (page - 1) * limit;

    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.text = searchRegex;
    }

    let sortOption = { createdAt: -1 };

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    let posts = await Post.find(query)
      .populate('userId', 'name email username avatar')
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);

    // Format post response
    const formattedPosts = posts.map(post => {
      const p = post.toObject();
      return {
        ...p,
        authorName: p.userId ? p.userId.name : (p.authorName || 'Anonymous'),
        authorUsername: p.userId ? (p.userId.username || p.userId.email.split('@')[0]) : (p.authorUsername || 'user')
      };
    });

    return res.json({
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

// @desc    Create a new post in MongoDB Atlas
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

    const username = req.user.username || (req.user.email ? req.user.email.split('@')[0] : req.user.name.toLowerCase().replace(/\s+/g, ''));
    const userAvatar = req.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.user.name}`;

    if (!isDbConnected()) {
      const newMemPost = createInMemoryPost({
        userId: req.user._id,
        authorName: req.user.name,
        authorUsername: username,
        authorAvatar: userAvatar,
        text,
        image
      });

      return res.status(201).json({
        success: true,
        post: newMemPost
      });
    }

    const post = await Post.create({
      userId: req.user._id,
      authorName: req.user.name,
      authorUsername: username,
      authorAvatar: userAvatar,
      text: text || '',
      image: image || '',
      likes: [],
      comments: []
    });

    const populatedPost = await Post.findById(post._id).populate('userId', 'name email username avatar');

    return res.status(201).json({
      success: true,
      post: {
        ...populatedPost.toObject(),
        authorName: req.user.name,
        authorUsername: username,
        authorAvatar: userAvatar
      }
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Toggle like / unlike on a post in MongoDB Atlas
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res) => {
  try {
    const username = req.user.username || (req.user.email ? req.user.email.split('@')[0] : req.user.name.toLowerCase().replace(/\s+/g, ''));

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const alreadyLikedIndex = post.likes.findIndex(
      (like) => (like.userId && like.userId.toString() === req.user._id.toString()) || like.toString() === req.user._id.toString()
    );

    if (alreadyLikedIndex !== -1) {
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      post.likes.push({
        userId: req.user._id,
        username: username,
        name: req.user.name
      });
    }

    await post.save();

    return res.json({
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

// @desc    Add comment to a post in MongoDB Atlas
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const username = req.user.username || (req.user.email ? req.user.email.split('@')[0] : req.user.name.toLowerCase().replace(/\s+/g, ''));
    const userAvatar = req.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.user.name}`;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const newComment = {
      userId: req.user._id,
      name: req.user.name,
      username: username,
      userAvatar: userAvatar,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(201).json({
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
