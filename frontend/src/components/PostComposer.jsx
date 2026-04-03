import { useState } from 'react';
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
    <div className="card mb-3">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-2">
            <div className="avatar avatar-sm avatar-placeholder">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <textarea
              className="form-textarea"
              placeholder="What's happening in your network?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: '80px', marginBottom: 0 }}
            />
          </div>

          <div className="flex justify-end items-center" style={{ marginLeft: '48px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading || !content.trim()}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
