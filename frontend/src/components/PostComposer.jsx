import { useState } from 'react';
import API from '../api/api';

export default function PostComposer({ onPostCreated, user }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const { data } = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContent('');
      setImage(null);
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

          {image && (
            <div className="mb-2" style={{ marginLeft: '48px' }}>
              <span className="text-sm text-saffron">Image attached: {image.name}</span>
            </div>
          )}

          <div className="flex justify-between items-center" style={{ marginLeft: '48px' }}>
            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
              📷 Add Photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading || (!content.trim() && !image)}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
