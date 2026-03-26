import { useState } from 'react';
import API from '../api/api';
import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false); // Can be enriched from a separate API call if needed
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
    const diff = Math.floor((now - d) / 1000); // in seconds
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="post-card card mb-3 slide-up">
      <div className="card-body">
        <div className="post-header flex justify-between items-center mb-2">
          <Link to={`/profile/${post.user.id}`} className="post-author flex items-center gap-1">
            {post.user.avatar ? (
              <img src={post.user.avatar} alt={post.user.name} className="avatar avatar-sm" />
            ) : (
              <div className="avatar avatar-sm avatar-placeholder">{post.user.name[0]}</div>
            )}
            <div>
              <div className="post-author-name">{post.user.name}</div>
              <div className="text-xs text-muted">{post.user.headline || 'Community Member'} • {timeAgo(post.createdAt)}</div>
            </div>
          </Link>

          {user && user.id === post.userId && (
            <button className="btn-icon btn-outline text-muted" onClick={handleDelete} title="Delete Post">
              <span style={{ fontSize: '1rem' }}>🗑️</span>
            </button>
          )}
        </div>

        <div className="post-content mb-2" style={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        {post.imageUrl && (
          <div className="post-image mb-2">
            <img src={post.imageUrl} alt="Post attachment" />
          </div>
        )}

        <div className="post-stats flex justify-between text-sm text-muted mb-2">
          <span>{likesCount} Likes</span>
          <span className="cursor-pointer hover-saffron" onClick={() => setShowComments(!showComments)}>
            {commentsCount} Comments
          </span>
        </div>

        <div className="post-actions flex border-top pt-2">
          <button
            className={`post-action-btn flex-1 ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <span className="mr-1">{isLiked ? '🔶' : '🤍'}</span> Like
          </button>
          <button
            className="post-action-btn flex-1"
            onClick={() => setShowComments(!showComments)}
          >
            <span className="mr-1">💬</span> Comment
          </button>
        </div>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
