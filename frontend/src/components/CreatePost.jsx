import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Image, Send, X } from 'lucide-react';

const CreatePost = ({ onCreatePost, onOpenAuth }) => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!text.trim() && !image.trim()) {
      setErrorMsg('Please enter text or attach an image to post!');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await onCreatePost({ text, image });
    setSubmitting(false);

    if (res && res.success) {
      setText('');
      setImage('');
    } else {
      setErrorMsg(res?.message || 'Failed to create post');
    }
  };

  const handleImageFileChange = (e) => {
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
    <div className="post-card-box" style={{ margin: '20px 20px 24px 20px' }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '14px' }}>
        Create Post
      </h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setErrorMsg(''); }}
          placeholder="What's on your mind?"
          rows={3}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-card)',
            borderRadius: '12px',
            padding: '12px 14px',
            color: 'var(--text-dark)',
            fontSize: '0.95rem',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.5',
            marginBottom: '12px'
          }}
        />

        {image && (
          <div style={{ position: 'relative', marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-card)' }}>
            <img src={image} alt="Upload Preview" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', backgroundColor: 'var(--bg-input)' }} />
            <button
              type="button"
              onClick={() => setImage('')}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(0,0,0,0.6)',
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
          <div style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '10px', fontWeight: '600' }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-card)' }}>
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#0088ff',
            fontSize: '0.88rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-card)'
          }}>
            <Image size={18} />
            <span>Add Image</span>
            <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ display: 'none' }} />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
          >
            <Send size={15} />
            <span>{submitting ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
