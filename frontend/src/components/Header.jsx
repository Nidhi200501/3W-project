import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Sun, Moon, LogIn } from 'lucide-react';

const Header = ({ onOpenAuth, onGoToFeed }) => {
  const { user, logout } = useContext(AuthContext);

  // Theme state: dark by default for TaskPlanet aesthetic
  const [theme, setTheme] = useState(localStorage.getItem('tp_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 24px',
      backgroundColor: 'var(--header-bg)',
      borderBottom: '1px solid var(--header-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-card)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* App Logo / Title */}
      <h1
        onClick={onGoToFeed}
        style={{
          fontSize: '1.6rem',
          fontWeight: '800',
          color: 'var(--text-dark)',
          cursor: 'pointer',
          letterSpacing: '-0.5px'
        }}
      >
        Social
      </h1>

      {/* Controls & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Bright Mode / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: theme === 'dark' ? '#ffca3a' : '#f59e0b',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease'
          }}
          title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun size={22} color="#ffca3a" />
          ) : (
            <Moon size={22} color="#475569" />
          )}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-input)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border-card)'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#0088ff',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                {user.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="btn-outline"
              style={{
                borderColor: '#ef4444',
                color: '#ef4444',
                padding: '6px 12px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Logout"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-primary"
            style={{ padding: '6px 18px', fontSize: '0.85rem' }}
          >
            <LogIn size={15} /> Login / Register
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
