import { useState, useEffect } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function CommentSection({ postId, onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get(`/posts/${postId}/comments`)
      .then(({ data }) => setComments(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await API.post(`/posts/${postId}/comments`, { content: newComment });
      setComments((prev) => [...prev, data]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Comment failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-3 text-center text-sm text-muted">Loading comments...</div>;

  return (
    <div className="comment-section" style={{ background: 'var(--gray-50)', padding: '16px', borderTop: '1px solid var(--gray-200)' }}>
      {comments.length > 0 ? (
        <div className="comment-list mb-3">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item flex gap-1 mb-2">
              <Link to={`/profile/${comment.user.id}`}>
                {comment.user.avatar ? (
                  <img src={comment.user.avatar} alt="" className="avatar avatar-sm" style={{ width: 32, height: 32 }} />
                ) : (
                  <div className="avatar avatar-sm avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                    {comment.user.name[0]}
                  </div>
                )}
              </Link>
              <div className="comment-bubble" style={{ background: 'var(--white)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--gray-200)', flex: 1 }}>
                <div className="comment-author font-semibold text-sm mb-1">{comment.user.name}</div>
                <div className="comment-text text-sm">{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-muted mb-3">No comments yet. Be the first to start the discussion!</div>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-1" style={{ alignItems: 'flex-start' }}>
          {user.avatar ? (
            <img src={user.avatar} alt="" className="avatar avatar-sm" style={{ width: 32, height: 32 }} />
          ) : (
            <div className="avatar avatar-sm avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{user.name[0]}</div>
          )}
          <div className="flex-1 flex gap-1">
            <input
              type="text"
              className="form-input"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '20px' }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !newComment.trim()}
              style={{ padding: '8px 16px', borderRadius: '20px' }}
            >
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
