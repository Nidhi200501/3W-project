import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Mail, Lock, LogIn, ArrowLeft, Zap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('testuser123@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res && res.success) {
      navigate('/social');
    } else {
      setErrorMsg(res?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickDemo = async () => {
    setEmail('testuser123@example.com');
    setPassword('password123');
    setLoading(true);
    setErrorMsg('');
    const res = await login('testuser123@example.com', 'password123');
    setLoading(false);
    if (res && res.success) {
      navigate('/social');
    } else {
      setErrorMsg(res?.message || 'Demo login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', paddingBottom: '80px' }}>
      <Header onOpenAuth={() => {}} onGoToFeed={() => navigate('/social')} />

      <main style={{ maxWidth: '440px', margin: '30px auto', padding: '0 16px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary-blue)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="post-card-box" style={{ margin: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '6px' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Log in to start posting, liking, and commenting
            </p>
          </div>

          {/* Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 136, 255, 0.15)',
              border: '1px solid var(--primary-blue)',
              color: 'var(--text-dark)',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            <Zap size={16} fill="#0088ff" color="#0088ff" /> 1-Click Demo Login (testuser123)
          </button>

          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
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
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Mail size={18} color="var(--primary-blue)" />
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
                  color: 'var(--text-dark)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Lock size={18} color="var(--primary-blue)" />
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
                  color: 'var(--text-dark)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', marginTop: '6px' }}
            >
              <LogIn size={18} /> {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Don't have an account?{' '}
            </span>
            <Link
              to="/register"
              style={{
                color: 'var(--primary-blue)',
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
    </div>
  );
};

export default Login;
