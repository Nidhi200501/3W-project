const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  toggleLikePost,
  addComment
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Post Endpoints
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.post('/:id/like', protect, toggleLikePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;
