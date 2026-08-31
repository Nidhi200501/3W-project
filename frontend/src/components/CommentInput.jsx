import React, { useState } from 'react';
import { Send } from 'lucide-react';

const CommentInput = ({ onAddComment, onOpenAuth, isLoggedIn }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    if (!text.trim()) return;

    setSubmitting(true);
    await onAddComment(text.trim());
    setSubmitting(false);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        style={{
          flex: 1,
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-card)',
          borderRadius: '20px',
          padding: '8px 16px',
          fontSize: '0.85rem',
          color: 'var(--text-dark)',
          outline: 'none'
        }}
      />
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
        style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem' }}
      >
        <Send size={14} /> Post
      </button>
    </form>
  );
};

export default CommentInput;
