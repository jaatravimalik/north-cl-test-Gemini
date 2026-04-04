import { useState } from 'react';
import API from '../api/api';
import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const handleLike = async () => {
    try {
      const { data } = await API.post(`/posts/${post.id}/like`);
      setIsLiked(data.liked);
      setLikesCount((prev) => (data.liked ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${post.id}`);
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const timeAgo = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="post-card slide-up">
      {/* Header */}
      <div className="post-header">
        <Link to={`/profile/${post.user?.id}`} className="post-author">
          {post.user?.avatar ? (
            <img src={post.user.avatar} alt={post.user?.name} className="avatar avatar-sm" />
          ) : (
            <div className="avatar avatar-sm avatar-placeholder">
              {post.user?.name?.[0] || 'U'}
            </div>
          )}
          <div className="post-author-info">
            <span className="post-author-name">{post.user?.name}</span>
            <span className="post-author-meta">
              {post.user?.headline || 'Community Member'} &bull; {timeAgo(post.createdAt)}
            </span>
          </div>
        </Link>

        {user && user.id === post.userId && (
          <button className="post-delete-btn" onClick={handleDelete} title="Delete Post">
            ✕
          </button>
        )}
      </div>

      {/* Post text content */}
      <div className="post-content-text">{post.content}</div>

      {/* Post image if present */}
      {post.imageUrl && (
        <div className="post-image-block">
          <img src={post.imageUrl} alt="Post attachment" />
        </div>
      )}

      {/* Social proof / stats */}
      {(likesCount > 0 || commentsCount > 0) && (
        <div className="post-stats-bar">
          {likesCount > 0 ? (
            <span className="post-stat-likes">
              <span className="reaction-dot">👍</span>
              {likesCount}
            </span>
          ) : (
            <span />
          )}
          {commentsCount > 0 && (
            <span onClick={() => setShowComments(!showComments)}>
              {commentsCount} comment{commentsCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="post-actions">
        <button
          className={`post-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          id={`like-btn-${post.id}`}
        >
          <span className="action-icon">👍</span>
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
          id={`comment-btn-${post.id}`}
        >
          <span className="action-icon">💬</span>
          <span>Comment</span>
        </button>

        <button className="post-action-btn" id={`repost-btn-${post.id}`}>
          <span className="action-icon">🔄</span>
          <span>Repost</span>
        </button>

        <button className="post-action-btn" id={`send-btn-${post.id}`}>
          <span className="action-icon">📤</span>
          <span>Send</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
