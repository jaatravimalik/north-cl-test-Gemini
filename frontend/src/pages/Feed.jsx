import { useState, useEffect } from 'react';
import API from '../api/api';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

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
    <div className="page" style={{ background: 'var(--gray-50)' }}>
      <div className="container-sm">
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
    </div>
  );
}
