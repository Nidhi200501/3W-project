import React from 'react';
import { Plus } from 'lucide-react';

const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: 'calc(50% - 230px)', // Aligned to right of max 500px mobile container
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#0088ff',
        color: '#ffffff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(0, 136, 255, 0.6)',
        zIndex: 850,
        transition: 'transform 0.2s ease'
      }}
      title="Create New Post"
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
};

export default FloatingButton;
