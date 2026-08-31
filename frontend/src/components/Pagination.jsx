import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      margin: '20px 20px 30px 20px',
      padding: '12px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderRadius: '16px',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Previous Button */}
      <button
        onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        style={{
          backgroundColor: hasPrevPage ? 'var(--bg-input)' : 'transparent',
          color: hasPrevPage ? '#0088ff' : 'var(--text-dim)',
          border: hasPrevPage ? '1px solid #0088ff' : '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '6px 14px',
          fontSize: '0.82rem',
          fontWeight: '700',
          cursor: hasPrevPage ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronLeft size={16} /> Previous
      </button>

      {/* Page Info Indicator */}
      <div style={{
        color: 'var(--text-dark)',
        fontSize: '0.85rem',
        fontWeight: '700',
        padding: '0 8px'
      }}>
        Page <span style={{ color: '#0088ff' }}>{currentPage}</span> of {totalPages}
      </div>

      {/* Next Button */}
      <button
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        style={{
          backgroundColor: hasNextPage ? 'var(--bg-input)' : 'transparent',
          color: hasNextPage ? '#0088ff' : 'var(--text-dim)',
          border: hasNextPage ? '1px solid #0088ff' : '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '6px 14px',
          fontSize: '0.82rem',
          fontWeight: '700',
          cursor: hasNextPage ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.2s ease'
        }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
