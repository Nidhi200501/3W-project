import React, { useState, useEffect, useCallback, useRef } from 'react';
import NavbarHeader from '../components/NavbarHeader';
import SearchBar from '../components/SearchBar';
import CreatePostCard from '../components/CreatePostCard';
import FeedFilters from '../components/FeedFilters';
import SpotlightCard from '../components/SpotlightCard';
import PromoteCard from '../components/PromoteCard';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import BottomNav from '../components/BottomNav';
import FloatingButton from '../components/FloatingButton';
import AuthModal from '../components/AuthModal';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchVal, setSearchVal] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const topRef = useRef(null);

  // Fetch posts with pagination & search filter
  const fetchPosts = useCallback(async (page = currentPage, filter = activeFilter, query = searchVal) => {
    setLoadingPosts(true);
    try {
      const res = await axios.get('/api/posts', {
        params: { page, limit: 5, filter, search: query }
      });
      if (res.data.success) {
        setPosts(res.data.posts);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  }, [currentPage, activeFilter, searchVal]);

  useEffect(() => {
    fetchPosts(currentPage, activeFilter, searchVal);
  }, [currentPage, activeFilter, fetchPosts]);

  // Handle Search submit
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchPosts(1, activeFilter, searchVal);
  };

  // Handle Filter Change
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
    fetchPosts(1, filterId, searchVal);
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    scrollToTop();
  };

  // Handle Create Post
  const handleCreatePost = async (postData) => {
    try {
      const res = await axios.post('/api/posts', postData);
      if (res.data.success) {
        // Optimistically update UI and fetch fresh page 1 feed to synchronize pagination metadata
        setPosts((prev) => [res.data.post, ...prev]);
        await fetchPosts(1, activeFilter, searchVal);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to publish post'
      };
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div ref={topRef} />

      {/* Top Header */}
      <NavbarHeader onOpenAuth={() => setIsAuthModalOpen(true)} />

      {/* Search Bar */}
      <SearchBar
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        onSearchSubmit={handleSearchSubmit}
        onAvatarClick={() => setIsAuthModalOpen(true)}
      />

      {/* Create Post Section */}
      <CreatePostCard
        onCreatePost={handleCreatePost}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Feed Filters Tabs */}
      <FeedFilters
        activeFilter={activeFilter}
        onSelectFilter={handleFilterChange}
      />

      {/* Spotlight Card */}
      <SpotlightCard />

      {/* Promote Platform Banner */}
      <PromoteCard />

      {/* Feed Posts */}
      <main style={{ paddingBottom: '10px' }}>
        {loadingPosts ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            Loading feed...
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            padding: '40px 20px',
            backgroundColor: 'var(--bg-card)',
            margin: '0 16px 20px 16px',
            borderRadius: '16px',
            border: '1px solid var(--border-card)'
          }}>
            No posts found. Be the first to create a post! 🚀
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          ))
        )}
      </main>

      {/* Pagination Controls */}
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Floating Plus Button */}
      <FloatingButton onClick={scrollToTop} />

      {/* Sticky Bottom Navigation */}
      <BottomNav />

      {/* Auth Modal for Login & Register */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Feed;
