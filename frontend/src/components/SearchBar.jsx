import React, { useContext } from 'react';
import { Search, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SearchBar = ({ searchVal, setSearchVal, onSearchSubmit, onAvatarClick }) => {
  const { user } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px 16px 16px 16px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Search Input Box */}
        <div style={{
          flex: 1,
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: '25px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search promotions, users, posts..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Separate Blue Search Button */}
        <button
          type="submit"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-blue)',
            border: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--accent-blue-glow)',
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }}
          title="Search"
        >
          <Search size={20} />
        </button>

      </div>
    </form>
  );
};

export default SearchBar;


