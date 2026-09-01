import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, User, Mail, Lock, UserPlus, LogIn, LogOut, Star, Crown, Shield } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const { user, login, register, logout } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('nidhi@taskplanet.com');
  const [password, setPassword] = useState('123456');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    let res;
    if (isRegister) {
      res = await register(name, username || name.toLowerCase().replace(/\s+/g, ''), email, password);
    } else {
      res = await login(email, password);
    }

    setLoading(false);

    if (res && res.success) {
      setEmail('');
      setPassword('');
      setName('');
      setUsername('');
      onClose();
    } else {
      setErrorMsg(res?.message || 'Authentication failed. Check your credentials.');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '420px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        {user ? (
          /* Logged In User Profile View */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0088ff 0%, #00e676 50%, #ffca3a 100%)',
                padding: '3px',
                margin: '0 auto 12px auto',
                boxShadow: '0 0 15px rgba(0, 136, 255, 0.4)'
              }}>
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0088ff&color=fff&bold=true`}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                {user.name}
              </h2>
              <div style={{ color: 'var(--accent-blue)', fontWeight: '600', fontSize: '0.88rem' }}>
                @{user.username || user.email.split('@')[0]}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                {user.email}
              </div>
            </div>

            {/* Badge & Level Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '14px',
              padding: '10px 14px',
              marginBottom: '14px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#ffb703',
                  color: '#000',
                  fontWeight: '900',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {user.badgeLevel || 7}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffca3a' }}>
                  👑 {user.badge || 'Legend'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#00e676', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} /> Verified Member
              </div>
            </div>

            {/* Points & Balance Display */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{
                backgroundColor: 'rgba(204, 41, 54, 0.15)',
                border: '1px solid rgba(204, 41, 54, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Reward Points</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ff453a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {user.points || 100} <Star size={14} fill="#ffca3a" color="#ffca3a" />
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(0, 230, 118, 0.12)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Wallet Balance</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00e676' }}>
                  ₹{(user.balance || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 69, 58, 0.15)',
                border: '1px solid rgba(255, 69, 58, 0.4)',
                color: '#ff453a',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={18} /> Log Out of Account
            </button>
          </div>
        ) : (
          /* Logged Out Login & Register Forms */
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {isRegister ? 'Join TaskPlanet Social Community' : 'Log in to start posting & interacting'}
              </p>
            </div>

            {errorMsg && (
              <div style={{
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                border: '1px solid rgba(255, 59, 48, 0.3)',
                color: '#ff453a',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '0.82rem',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isRegister && (
                <>
                  {/* Name */}
                  <div style={{
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <User size={18} color="var(--accent-blue)" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  {/* Username */}
                  <div style={{
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <User size={18} color="var(--accent-blue)" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </>
              )}

              {/* Email / Identifier */}
              <div style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Mail size={18} color="var(--accent-blue)" />
                <input
                  type="text"
                  placeholder={isRegister ? "Email address" : "Email or Username"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Password */}
              <div style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Lock size={18} color="var(--accent-blue)" />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div style={{ marginTop: '-6px', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Password Strength:</span>
                    <span style={{
                      fontWeight: '800',
                      color: password.length < 6 ? '#ff453a' : (password.length >= 8 && /[A-Z0-9]/i.test(password) ? '#00e676' : '#ffca3a')
                    }}>
                      {password.length < 6 ? '🔴 Weak (min 6 chars)' : (password.length >= 8 && /[A-Z0-9]/i.test(password) ? '🟢 Strong' : '🟡 Medium')}
                    </span>
                  </div>
                  <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: password.length < 6 ? '33%' : (password.length >= 8 && /[A-Z0-9]/i.test(password) ? '100%' : '66%'),
                      backgroundColor: password.length < 6 ? '#ff453a' : (password.length >= 8 && /[A-Z0-9]/i.test(password) ? '#00e676' : '#ffca3a'),
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="glow-btn"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', marginTop: '6px' }}
              >
                {loading ? 'Please wait...' : isRegister ? (
                  <><UserPlus size={18} /> Sign Up</>
                ) : (
                  <><LogIn size={18} /> Login</>
                )}
              </button>
            </form>

            {/* Quick Demo Login Option */}
            {!isRegister && (
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  ⚡ Quick Demo Login:
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('nidhi@taskplanet.com');
                      setPassword('123456');
                    }}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--accent-blue)',
                      borderRadius: '16px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    👤 Nidhi (`123456`)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('alex@taskplanet.com');
                      setPassword('123456');
                    }}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--accent-blue)',
                      borderRadius: '16px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    👤 Alex (`123456`)
                  </button>
                </div>
              </div>
            )}

            {/* Toggle Mode */}
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button
                onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-blue)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {isRegister ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

