import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavbarHeader from '../components/NavbarHeader';
import BottomNav from '../components/BottomNav';
import AuthModal from '../components/AuthModal';
import { Globe, Trophy, ArrowRight, UserPlus, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingBottom: '80px' }}>
      {/* Top Header */}
      <NavbarHeader onOpenAuth={() => setIsAuthModalOpen(true)} />

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px' }}>
        {/* Welcome Banner Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0088ff 0%, #0040aa 100%)',
          borderRadius: '20px',
          padding: '24px 20px',
          color: '#ffffff',
          marginBottom: '20px',
          boxShadow: '0 8px 24px rgba(0, 136, 255, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              <Star size={14} fill="#ffca3a" color="#ffca3a" /> Welcome to TaskPlanet
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', lineHeight: '1.2' }}>
              Earn, Share & Connect with the Community 🚀
            </h2>

            <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '20px', lineHeight: '1.5' }}>
              Create posts, share your thoughts, upload images, like and comment on community updates in real-time.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0066cc',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '10px 20px',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <Globe size={18} /> Go to Social Feed <ArrowRight size={16} />
              </button>

              {!user && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '24px',
                    padding: '10px 18px',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <UserPlus size={16} /> Create Account / Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
          Explore TaskPlanet Hub
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
          {/* Social Card */}
          <div
            onClick={() => navigate('/')}
            className="card-box"
            style={{ margin: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#0088ff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>Social Feed</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Post text, images, like & comment.
              </p>
            </div>
          </div>

          {/* Leaderboard Card */}
          <div
            onClick={() => navigate('/')}
            className="card-box"
            style={{ margin: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#ffb703',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>Leaderboard</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Track top active earners & badges.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Navigation */}
      <BottomNav />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Home;
