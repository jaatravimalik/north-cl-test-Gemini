import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

export default function PostComposer({ onPostCreated, user }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);

    try {
      const { data } = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContent('');
      if (onPostCreated) onPostCreated(data);
    } catch (err) {
      console.error('Failed to create post', err);
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
              onChange={(e) => setContent(e.target.value)}
              rows={content ? 3 : 1}
              style={{ width: '100%' }}
            />
            {content.trim() && (
              <div className="flex justify-end" style={{ marginTop: '8px', paddingRight: '0' }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                  {loading ? 'Posting...' : 'Post'}
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
