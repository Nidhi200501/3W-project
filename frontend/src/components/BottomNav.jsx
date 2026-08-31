import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Globe, Trophy, MessageCircle } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSocial = location.pathname === '/social' || location.pathname === '/';
  const isHome = location.pathname === '/';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '600px',
      backgroundColor: 'var(--header-bg)',
      borderTop: '1px solid var(--header-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '10px 0 12px 0',
      zIndex: 900,
      boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.05)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Home */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: isHome ? '#0088ff' : 'var(--text-dim)',
          cursor: 'pointer',
          gap: '3px'
        }}
      >
        <Home size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: isHome ? '800' : '600' }}>Home</span>
      </div>

      {/* Tasks */}
      <div
        onClick={() => navigate('/social')}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-dim)', cursor: 'pointer', gap: '3px' }}
      >
        <ClipboardList size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>Tasks</span>
      </div>

      {/* Social Feed - ACTIVE BLUE */}
      <div
        onClick={() => navigate('/social')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#0088ff',
          cursor: 'pointer',
          gap: '3px',
          position: 'relative'
        }}
      >
        <Globe size={22} color="#0088ff" />
        <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#0088ff' }}>Social</span>
        <div style={{
          position: 'absolute',
          top: '-10px',
          width: '24px',
          height: '2px',
          backgroundColor: '#0088ff',
          borderRadius: '2px',
          boxShadow: '0 0 8px #0088ff'
        }} />
      </div>

      {/* Leader Board */}
      <div
        onClick={() => navigate('/social')}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-dim)', cursor: 'pointer', gap: '3px' }}
      >
        <Trophy size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>Leaderboard</span>
      </div>

      {/* Chat */}
      <div
        onClick={() => navigate('/social')}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-dim)', cursor: 'pointer', gap: '3px' }}
      >
        <MessageCircle size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>Chat</span>
      </div>
    </nav>
  );
};

export default BottomNav;
