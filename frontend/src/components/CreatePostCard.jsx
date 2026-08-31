import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, Smile, Menu, Megaphone, Send, Image, X } from 'lucide-react';

const CreatePostCard = ({ onCreatePost, onOpenAuth }) => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!text.trim() && !image.trim()) {
      setErrorMsg('Please enter post text or attach an image!');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await onCreatePost({ text, image });
    setSubmitting(false);

    if (res.success) {
      setText('');
      setImage('');
      setShowImageInput(false);
    } else {
      setErrorMsg(res.message || 'Failed to create post');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card-box" style={{ margin: '0 16px 20px 16px' }}>
      {/* Top Title & Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>Create Post</h3>

        {/* All Posts / Promotions Pill Toggle */}
        <div style={{
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '2px',
          display: 'flex',
          gap: '2px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              background: activeTab === 'all' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'all' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '18px',
              padding: '4px 12px',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: activeTab === 'all' ? '0 0 10px rgba(0,136,255,0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            All Posts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('promotions')}
            style={{
              background: activeTab === 'promotions' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'promotions' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '18px',
              padding: '4px 12px',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Promotions
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Text Area */}
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setErrorMsg(''); }}
          placeholder="What's on your mind?"
          rows={3}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.5'
          }}
        />

        {/* Optional Image URL Input Section */}
        {showImageInput && (
          <div style={{
            margin: '10px 0',
            padding: '12px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste Image URL or pick local file..."
                style={{
                  flex: 1,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.85rem'
                }}
              />
              <label style={{
                background: 'var(--accent-blue)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Image size={14} /> Upload
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        )}

        {/* Live Image Preview */}
        {image && (
          <div style={{ position: 'relative', margin: '10px 0', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={image} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => setImage('')}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {errorMsg && (
          <div style={{ color: '#ff453a', fontSize: '0.8rem', margin: '6px 0' }}>
            {errorMsg}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />

        {/* Bottom Toolbar Icons & Post Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer' }}
              title="Add Image"
            >
              <Camera size={20} />
            </button>
            <button
              type="button"
              onClick={() => setText((prev) => prev + ' 😊')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer' }}
              title="Add Emoji"
            >
              <Smile size={20} />
            </button>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer' }}
              title="Options"
            >
              <Menu size={20} />
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--accent-blue)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              <Megaphone size={16} />
              <span>Promote</span>
            </div>
          </div>

          {/* Large ➤ Post button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              border: '1.5px solid var(--accent-blue)',
              borderRadius: '25px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--accent-blue-glow)',
              transition: 'all 0.2s ease'
            }}
          >
            <Send size={16} style={{ fill: 'var(--accent-blue)', color: 'var(--accent-blue)' }} />
            <span>{submitting ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostCard;
