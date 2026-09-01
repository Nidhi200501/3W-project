import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, User, LogOut, Star, Shield, ChevronDown, CheckCircle, Sparkles } from 'lucide-react';

const NavbarHeader = ({ onOpenAuth }) => {
  const { user, logout } = useContext(AuthContext);

  // Theme state: dark by default for TaskPlanet style
  const [theme, setTheme] = useState(localStorage.getItem('tp_theme') || 'dark');
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tp_theme', theme);
  }, [theme]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    setShowMenu(false);
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 18px',
      backgroundColor: 'var(--header-bg)',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      borderBottom: '1px solid var(--header-border)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: '1.7rem',
        fontWeight: '800',
        color: 'var(--text-main)',
        letterSpacing: '-0.5px',
        margin: 0
      }}>
        Social
      </h1>

      {/* Right Header Stats & Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} ref={dropdownRef}>
        {/* Points Pill (Red Badge Pill with 100 Star) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: '#cc2936',
          borderRadius: '16px',
          padding: '3px 10px',
          fontSize: '0.82rem',
          fontWeight: '800',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(204, 41, 54, 0.4)'
        }}>
          <span>{user ? user.points : 100}</span>
          <Star size={14} fill="#ffca3a" color="#ffca3a" />
        </div>

        {/* Currency Balance Pill */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '4px 10px',
          fontSize: '0.82rem',
          fontWeight: '700',
          color: '#00e676'
        }}>
          ₹{user ? (user.balance ? user.balance.toFixed(2) : '0.00') : '0.00'}
        </div>

        {/* Theme Dark / Light Toggle Icon */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: theme === 'dark' ? '#ffca3a' : '#f59e0b',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease'
          }}
          title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Moon size={22} color="#ffca3a" /> : <Sun size={22} color="#f59e0b" />}
        </button>

        {/* User Profile Avatar Ring Icon at Top Right */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              if (user) {
                setShowMenu(!showMenu);
              } else {
                onOpenAuth();
              }
            }}
            title={user ? `${user.name} - Profile & Logout` : 'Click to Login'}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0088ff 0%, #00e676 50%, #ffca3a 100%)',
              padding: '2px',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 0 12px rgba(0, 136, 255, 0.4)',
              transition: 'transform 0.2s ease'
            }}
          >
            {/* Inner Profile Image */}
            <img
              src={
                user
                  ? (user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`)
                  : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
              }
              alt={user ? user.name : 'Guest User'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
              }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-card)',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Top Right Online Badge Dot (Green status dot with tick) */}
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: user ? '#00e676' : '#ffca3a',
              border: '2px solid var(--header-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.55rem',
              color: '#000000',
              fontWeight: '900'
            }}>
              {user ? '✓' : '!'}
            </div>
          </div>

          {/* Profile Dropdown Card on Avatar Click */}
          {showMenu && user && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: '0',
              width: '260px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              zIndex: 300,
              animation: 'fadeIn 0.2s ease-in-out'
            }}>
              {/* User Header Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0088ff 0%, #00e676 100%)',
                  padding: '2px'
                }}>
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0088ff&color=fff&bold=true`}
                    alt={user.name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {user.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: '600' }}>
                    @{user.username || user.email.split('@')[0]}
                  </div>
                </div>
              </div>

              {/* Badge & Level Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '12px',
                padding: '8px 12px',
                marginBottom: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#ffb703',
                    color: '#000',
                    fontWeight: '900',
                    fontSize: '0.7rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {user.badgeLevel || 7}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffca3a' }}>
                    👑 {user.badge || 'Legend'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Active User
                </div>
              </div>

              {/* Points & Wallet Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(204, 41, 54, 0.15)',
                  border: '1px solid rgba(204, 41, 54, 0.3)',
                  borderRadius: '10px',
                  padding: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Points</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ff453a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                    {user.points || 100} <Star size={12} fill="#ffca3a" color="#ffca3a" />
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 230, 118, 0.12)',
                  border: '1px solid rgba(0, 230, 118, 0.3)',
                  borderRadius: '10px',
                  padding: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Balance</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#00e676' }}>
                    ₹{(user.balance || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={toggleTheme}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {theme === 'dark' ? <Moon size={16} color="#ffca3a" /> : <Sun size={16} color="#f59e0b" />}
                  <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 69, 58, 0.4)',
                    backgroundColor: 'rgba(255, 69, 58, 0.15)',
                    color: '#ff453a',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarHeader;

