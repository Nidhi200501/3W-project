import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await register(name, username || name.toLowerCase().replace(/\s+/g, ''), email, password);
    setLoading(false);

    if (res && res.success) {
      navigate('/social');
    } else {
      setErrorMsg(res?.message || 'Registration failed. Please try again.');
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
              Create Account
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Join TaskPlanet Social Community
            </p>
          </div>

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
            {/* Full Name */}
            <div style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <User size={18} color="var(--primary-blue)" />
              <input
                type="text"
                placeholder="Full Name (e.g. Nitin Pandey)"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {/* Username */}
            <div style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <User size={18} color="var(--primary-blue)" />
              <input
                type="text"
                placeholder="Username (e.g. nitin3w)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            {/* Email */}
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
                type="email"
                placeholder="Email address"
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

            {/* Password */}
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
                placeholder="Password (min 6 characters)"
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
              <UserPlus size={18} /> {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Already have an account?{' '}
            </span>
            <Link
              to="/login"
              style={{
                color: 'var(--primary-blue)',
                fontWeight: '700',
                textDecoration: 'none',
                fontSize: '0.85rem'
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Signup;
