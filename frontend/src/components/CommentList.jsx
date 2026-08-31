import React from 'react';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', textAlign: 'center', padding: '10px 0' }}>
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
      {comments.map((cmt, idx) => (
        <div
          key={cmt._id || idx}
          style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-card)',
            borderRadius: '12px',
            padding: '10px 14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
              {cmt.name}
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
              {cmt.createdAt ? new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.4' }}>
            {cmt.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
