import React from 'react';
import { Flame, Star, Users, MessageSquare, ArrowRight } from 'lucide-react';

const SpotlightCard = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #190c33 0%, #100624 100%)',
      border: '1px solid #5821c4',
      borderRadius: '16px',
      padding: '16px',
      margin: '0 16px 16px 16px',
      position: 'relative',
      boxShadow: '0 4px 20px rgba(88, 33, 196, 0.2)'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{
          backgroundColor: '#2e105e',
          border: '1px solid #7c3aed',
          borderRadius: '12px',
          padding: '3px 10px',
          fontSize: '0.7rem',
          fontWeight: '700',
          color: '#d8b4fe',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Flame size={12} color="#ff8533" fill="#ff8533" />
          EARNING PLATFORM SPOTLIGHT
        </div>
        <div style={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
          See All &gt;
        </div>
      </div>

      {/* Main Info Box */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: '#2e105e',
          border: '1px solid #6b21a8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          flexShrink: 0
        }}>
          💎
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700' }}>Media Rewards</h4>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '4px' }}>
            Earning • Survey
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#d8b4fe' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '700', color: '#ffb703' }}>
              <Star size={13} fill="#ffb703" color="#ffb703" /> 5
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Users size={13} /> 1 Members
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MessageSquare size={13} /> 15 Messages
            </span>
          </div>
        </div>
      </div>

      <p style={{ color: '#c4b5fd', fontSize: '0.82rem', marginBottom: '14px', lineHeight: '1.4' }}>
        Per survey 220 rupees per refer 242 rupees no investment required.
      </p>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button style={{
          backgroundColor: '#6d28d9',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          padding: '8px',
          fontWeight: '600',
          fontSize: '0.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <MessageSquare size={14} /> Join Discussion
        </button>

        <button style={{
          backgroundColor: 'transparent',
          color: '#ffffff',
          border: '1px solid #6d28d9',
          borderRadius: '12px',
          padding: '8px',
          fontWeight: '600',
          fontSize: '0.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          View Platform <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default SpotlightCard;
