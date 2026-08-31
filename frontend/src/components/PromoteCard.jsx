import React from 'react';
import { Rocket, Plus } from 'lucide-react';

const PromoteCard = () => {
  return (
    <div style={{
      backgroundColor: '#0d1326',
      border: '1px solid #1c274c',
      borderRadius: '16px',
      padding: '12px 16px',
      margin: '0 16px 16px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#1b0f38',
          border: '1px solid #4c1d95',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#a78bfa'
        }}>
          <Rocket size={18} />
        </div>

        <div>
          <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.85rem' }}>
            Promote an earning platform...
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            Share it with the community and earn...
          </div>
        </div>
      </div>

      <button style={{
        backgroundColor: '#1c0f38',
        border: '1px solid #6b21a8',
        color: '#c4b5fd',
        borderRadius: '12px',
        padding: '6px 12px',
        fontSize: '0.78rem',
        fontWeight: '700',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <Plus size={14} /> Add Your Platform
      </button>
    </div>
  );
};

export default PromoteCard;
