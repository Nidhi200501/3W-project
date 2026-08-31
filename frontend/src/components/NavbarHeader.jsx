import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, User, LogOut, Star } from 'lucide-react';

const NavbarHeader = ({ onOpenAuth }) => {
  const { user, logout } = useContext(AuthContext);

  // Theme state: dark by default for TaskPlanet
  const [theme, setTheme] = useState(localStorage.getItem('tp_theme') || 'dark');
  const [showMenu, setShowMenu] = useState(false);

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
      padding: '16px 20px',
      backgroundColor: 'var(--header-bg)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--header-border)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: '1.6rem',
        fontWeight: '800',
        color: 'var(--text-main)',
        letterSpacing: '-0.5px'
      }}>
        Social
      </h1>

      {/* Right Stats & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Points Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: 'var(--text-main)'
        }}>
          <span>{user ? user.points : 100}</span>
          <Star size={14} fill="#ffb703" color="#ffb703" />
        </div>

        {/* Balance Pill */}
        <div style={{
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: '#00e676'
        }}>
          ₹{user ? user.balance.toFixed(2) : '0.00'}
        </div>

        {/* Theme Toggle Icon */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: theme === 'dark' ? '#ffca3a' : '#f59e0b',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Moon size={22} color="#ffca3a" /> : <Sun size={22} color="#f59e0b" />}
        </button>

        {/* User Profile Avatar / Login Button */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowMenu(!showMenu)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0088ff 0%, #00d2ff 100%)',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-card)',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '45px',
                right: '0',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                minWidth: '180px',
                boxShadow: 'var(--shadow-card)',
                zIndex: 200
              }}>
                <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{user.username}</div>
                </div>

                <button
                  onClick={() => { logout(); setShowMenu(false); }}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 59, 48, 0.1)',
                    border: '1px solid rgba(255, 59, 48, 0.3)',
                    color: '#ff453a',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="glow-btn"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <User size={14} /> Login
          </button>
        )}
      </div>
    </header>
  );
};

export default NavbarHeader;
