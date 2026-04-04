import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import './Feed.css';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum = 1) => {
    try {
      const { data } = await API.get(`/posts?page=${pageNum}&limit=10`);
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(data.page < data.totalPages);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchPosts(page + 1);
  };

  return (
    <div className="page" style={{ background: 'var(--gray-100)' }}>
      <div className="container">
        <div className="feed-layout">
          {/* Left Sidebar */}
          <div className="feed-left">
            <div className="card profile-summary-card">
              <div className="profile-cover"></div>
              <div className="profile-summary-info">
                <Link to={`/profile/${user?.id}`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar" />
                  ) : (
                    <div className="avatar avatar-placeholder" style={{ margin: '0 auto 12px' }}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
                <Link to={`/profile/${user?.id}`}>
                  <h4>{user?.name}</h4>
                </Link>
                <p>{user?.headline || 'Community Member'}</p>
              </div>
              <div className="profile-stats">
                <div className="profile-stat-item">
                  <span>Connections</span>
                  <span className="stat-value">{user?.followedBy?.length || 0}</span>
                </div>
                <div className="profile-stat-item">
                  <span>Following</span>
                  <span className="stat-value">{user?.following?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed Content */}
          <div className="feed-main">
            <PostComposer onPostCreated={handlePostCreated} user={user} />

            {loading && page === 1 ? (
              <div className="loading-page"><div className="spinner"></div></div>
            ) : (
              <div className="feed-posts">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onPostDeleted={handlePostDeleted}
                    />
                  ))
                ) : (
                  <div className="empty-state card">
                    <h3>No posts yet</h3>
                    <p>Be the first to share an update with the community!</p>
                  </div>
                )}

                {hasMore && posts.length > 0 && (
                  <div className="text-center mt-3">
                    <button className="btn btn-secondary" onClick={handleLoadMore}>
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="feed-right">
            <div className="news-card">
              <h4>⚡ Trending in North India</h4>
              <div className="news-item">
                <h5>Tech Industry Booms in North India</h5>
                <p>Top news &bull; 10,432 readers</p>
              </div>
              <hr className="news-divider" />
              <div className="news-item">
                <h5>Startups See Unprecedented Growth</h5>
                <p>Business &bull; 8,921 readers</p>
              </div>
              <hr className="news-divider" />
              <div className="news-item">
                <h5>Remote Work Policies Extending Into 2026</h5>
                <p>Career &bull; 5,234 readers</p>
              </div>
              <hr className="news-divider" />
              <div className="news-item">
                <h5>New Networking Events Announced This Week</h5>
                <p>Community &bull; 3,112 readers</p>
              </div>
              <hr className="news-divider" />
              <div className="news-item">
                <h5>NorthIndia Connect Reaches 10k Users</h5>
                <p>Platform &bull; 2,088 readers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
