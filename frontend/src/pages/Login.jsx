import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavbarHeader from '../components/NavbarHeader';
import BottomNav from '../components/BottomNav';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('np1805689@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res && res.success) {
      navigate('/');
    } else {
      setErrorMsg(res?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingBottom: '80px' }}>
      <NavbarHeader onOpenAuth={() => setIsAuthModalOpen(true)} />

      <main style={{ maxWidth: '440px', margin: '30px auto', padding: '0 16px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-blue)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px'
          }}
        >
          <ArrowLeft size={16} /> Back to Feed
        </button>

        <div className="card-box" style={{ margin: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Log in to start posting, liking, and commenting
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
                placeholder="Email address or Username"
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
                placeholder="Password"
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

            <button
              type="submit"
              disabled={loading}
              className="glow-btn"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', marginTop: '6px' }}
            >
              <LogIn size={18} /> {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              ⚡ Quick 1-Click Demo Login:
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('np1805689@gmail.com');
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

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Don't have an account?{' '}
            </span>
            <Link
              to="/register"
              style={{
                color: 'var(--accent-blue)',
                fontWeight: '700',
                textDecoration: 'none',
                fontSize: '0.85rem'
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Login;
