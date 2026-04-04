import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

export default function PostComposer({ onPostCreated, user }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');

    try {
      // Backend uses @Body('content') — must send JSON, NOT FormData
      const { data } = await API.post('/posts', { content: trimmed });
      setContent('');
      if (onPostCreated) onPostCreated(data);
    } catch (err) {
      console.error('Failed to create post', err);
      setError(err?.response?.data?.message || 'Failed to post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card composer-linkedin bg-white slide-up">
      <div className="composer-top">
        <Link to={`/profile/${user?.id}`}>
          {user?.avatar ? (
            <img src={user.avatar} className="avatar avatar-sm" alt="User" />
          ) : (
            <div className="avatar avatar-sm avatar-placeholder">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </Link>
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <textarea
              className="composer-textarea w-full"
              placeholder="Start a post, try writing or sharing…"
              value={content}
              onChange={(e) => { setContent(e.target.value); if (error) setError(''); }}
              rows={content ? 4 : 1}
              style={{ width: '100%' }}
              id="post-composer-textarea"
            />
            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: 4 }}>
                ⚠️ {error}
              </div>
            )}
            {content.trim() && (
              <div className="flex justify-end items-center" style={{ marginTop: '8px', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', color: content.length > 2800 ? 'var(--danger)' : 'var(--gray-400)' }}>
                  {content.length}/3000
                </span>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={loading || content.trim().length === 0}
                  id="post-submit-btn"
                >
                  {loading ? 'Posting…' : 'Post'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="composer-actions">
        <button className="action-btn disabled" title="Photo uploads currently disabled">
          <span className="action-icon text-saffron" style={{ color: '#378fe9' }}>🖼️</span>
          <span>Photo</span>
        </button>
        <button className="action-btn disabled" title="Video uploads currently disabled">
          <span className="action-icon" style={{ color: '#5f9b41' }}>📹</span>
          <span>Video</span>
        </button>
        <button className="action-btn disabled" title="Event creation currently disabled">
          <span className="action-icon" style={{ color: '#c37d16' }}>📅</span>
          <span>Event</span>
        </button>
        <button className="action-btn disabled" title="Article writing currently disabled">
          <span className="action-icon" style={{ color: '#e16745' }}>📝</span>
          <span>Write article</span>
        </button>
      </div>
    </div>
  );
}
