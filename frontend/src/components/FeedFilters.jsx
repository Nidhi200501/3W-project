import React from 'react';

const FeedFilters = ({ activeFilter, onSelectFilter }) => {
  const filters = [
    { id: 'all', label: 'All Post' },
    { id: 'for_you', label: 'For You' },
    { id: 'most_liked', label: 'Most Liked' },
    { id: 'most_commented', label: 'Most Commented' },
    { id: 'most_shared', label: 'Most Shared' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      overflowX: 'auto',
      padding: '0 16px 16px 16px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onSelectFilter(filter.id)}
            style={{
              whiteSpace: 'nowrap',
              backgroundColor: isActive ? 'var(--bg-input)' : 'var(--bg-card)',
              color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
              border: isActive ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: isActive ? '700' : '500',
              cursor: 'pointer',
              boxShadow: isActive ? 'var(--accent-blue-glow)' : 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default FeedFilters;
