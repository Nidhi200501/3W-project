import React from 'react';
import { X, Heart, User } from 'lucide-react';

const LikedUsersModal = ({ likes, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '700' }}>
            <Heart size={18} fill="#ff453a" color="#ff453a" />
            <span>Liked by ({likes ? likes.length : 0})</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User List */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {(!likes || likes.length === 0) ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
              No likes yet. Be the first to like this post!
            </div>
          ) : (
            likes.map((likeItem, idx) => (
              <div
                key={likeItem._id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: idx === likes.length - 1 ? 'none' : '1px solid var(--border-color)'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-blue)'
                }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.9rem' }}>
                    {likeItem.name || 'User'}
                  </div>
                  <div style={{ color: 'var(--accent-blue)', fontSize: '0.78rem' }}>
                    @{likeItem.username || 'user'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedUsersModal;
