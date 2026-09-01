import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LikedUsersModal from './LikedUsersModal';
import { Heart, MessageSquare, Share2, MoreHorizontal, Send, Crown } from 'lucide-react';
import axios from 'axios';

const PostCard = ({ post, onOpenAuth }) => {
  const { user } = useContext(AuthContext);

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(
    user ? (post.likes || []).some(l => l === user._id || l.userId === user._id || l.username === user.username) : false
  );
  const [showComments, setShowComments] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isExpandedText, setIsExpandedText] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleLike = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    let updatedLikes = [...likes];
    if (newIsLiked) {
      updatedLikes.push({
        userId: user._id,
        username: user.username || user.name.toLowerCase().replace(/\s+/g, ''),
        name: user.name
      });
    } else {
      updatedLikes = updatedLikes.filter(
        l => (l._id !== user._id && l.userId !== user._id && l.username !== user.username)
      );
    }
    setLikes(updatedLikes);

    try {
      const res = await axios.post(`/api/posts/${post._id}/like`);
      if (res.data.success) {
        setLikes(res.data.likes);
        setIsLiked(res.data.isLiked);
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!commentText.trim()) return;

    setSubmittingComment(true);

    const tempComment = {
      _id: Date.now().toString(),
      userId: user._id,
      username: user.username || user.name.toLowerCase().replace(/\s+/g, ''),
      name: user.name,
      userAvatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    setComments((prev) => [...prev, tempComment]);
    const textToSend = commentText.trim();
    setCommentText('');

    try {
      const res = await axios.post(`/api/posts/${post._id}/comment`, { text: textToSend });
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const isLongText = post.text && post.text.length > 180;
  const displayText = isLongText && !isExpandedText ? `${post.text.slice(0, 180)}...` : post.text;

  const authorName = post.authorName || (post.userId && post.userId.name) || 'Nitin Pandey';
  const authorUsername = post.authorUsername || (post.userId && post.userId.email ? post.userId.email.split('@')[0] : 'nitin3w');

  return (
    <div className="card-box" style={{ margin: '0 16px 16px 16px' }}>
      {/* Author Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0088ff&color=fff&bold=true`}
            alt={authorName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0088ff&color=fff&bold=true`;
            }}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-input)',
              objectFit: 'cover'
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem' }}>
                {authorName}
              </span>
              
              <div className={`badge-pill ${post.authorBadge === 'Gold' ? 'badge-gold' : 'badge-gold'}`}>
                <span className="level-circle">{post.authorBadgeLevel || 7}</span>
                <Crown size={12} fill="#ffb703" />
                <span>{post.authorBadge || 'Legend'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                @{authorUsername}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>•</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Follow & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className="outline-btn"
            style={{
              backgroundColor: isFollowing ? 'rgba(0, 136, 255, 0.2)' : 'transparent',
              color: 'var(--accent-blue)'
            }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Post Text Content */}
      {post.text && (
        <div style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '12px', whiteSpace: 'pre-line' }}>
          {displayText}
          {isLongText && (
            <button
              onClick={() => setIsExpandedText(!isExpandedText)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-blue)',
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: '6px',
                fontSize: '0.88rem'
              }}
            >
              {isExpandedText ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Post Image Content */}
      {post.image && (
        <div style={{
          margin: '10px 0 14px 0',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)'
        }}>
          <img
            src={post.image}
            alt="Post content"
            style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', display: 'block' }}
          />
        </div>
      )}

      {/* Likes, Comments & Shares Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-color)'
      }}>
        {/* Like Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleLike}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: isLiked ? '#ff453a' : 'var(--text-muted)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Heart size={20} fill={isLiked ? '#ff453a' : 'none'} color={isLiked ? '#ff453a' : 'var(--text-muted)'} />
          </button>
          <span
            onClick={() => setShowLikesModal(true)}
            style={{
              color: isLiked ? '#ff453a' : 'var(--text-muted)',
              fontSize: '0.88rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="View who liked this post"
          >
            {likes.length}
          </span>
        </div>

        {/* Comment Action */}
        <div
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <MessageSquare size={19} color="var(--text-muted)" />
          <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>
            {comments.length}
          </span>
        </div>

        {/* Share Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          color: 'var(--text-muted)'
        }}>
          <Share2 size={19} color="var(--text-muted)" />
          <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>
            {post.sharesCount || 0}
          </span>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div style={{
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px dashed var(--border-color)'
        }}>
          {/* Add Comment Input Form */}
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '8px 14px',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={submittingComment}
              style={{
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={15} />
            </button>
          </form>

          {/* Comment List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {comments.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center', padding: '6px' }}>
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((cmt, idx) => (
                <div
                  key={cmt._id || idx}
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <img
                      src={cmt.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cmt.name || 'User')}&background=0088ff&color=fff&bold=true`}
                      alt={cmt.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cmt.name || 'User')}&background=0088ff&color=fff&bold=true`;
                      }}
                      style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--bg-card)' }}
                    />
                    <span style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.8rem' }}>{cmt.name}</span>
                    <span style={{ color: 'var(--accent-blue)', fontSize: '0.72rem' }}>@{cmt.username || cmt.name.toLowerCase().replace(/\s+/g, '')}</span>
                  </div>
                  <div style={{ color: 'var(--text-main)', fontSize: '0.82rem', paddingLeft: '30px' }}>
                    {cmt.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Liked Users Modal */}
      {showLikesModal && (
        <LikedUsersModal
          likes={likes}
          onClose={() => setShowLikesModal(false)}
        />
      )}
    </div>
  );
};

export default PostCard;
