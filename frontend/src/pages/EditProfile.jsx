import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import ImageCropperModal from '../components/ImageCropperModal';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', headline: '', location: '', about: '', website: '', phone: '', skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [cropModalInfo, setCropModalInfo] = useState({ isOpen: false, src: null, type: null });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        headline: user.headline || '',
        location: user.location || '',
        about: user.about || '',
        website: user.website || '',
        phone: user.phone || '',
        skills: user.skills ? user.skills.join(', ') : '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const payload = {
      ...form,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const { data } = await API.put('/users/me', payload);
      updateUser(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => navigate(`/profile/${user.id}`), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setMessage({ type: 'error', text: 'Image cannot exceed 500KB limit.' });
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropModalInfo({ isOpen: true, src: reader.result?.toString(), type });
    });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedBlob) => {
    const { type } = cropModalInfo;
    setCropModalInfo({ isOpen: false, src: null, type: null });

    if (croppedBlob.size > 500 * 1024) {
      setMessage({ type: 'error', text: 'Cropped image exceeds 500KB limit.' });
      return;
    }

    const formData = new FormData();
    formData.append(type, croppedBlob, `${type}.jpg`);

    try {
      const { data } = await API.post(`/users/me/${type}`, formData);
      updateUser(data);
      setMessage({ type: 'success', text: `${type === 'avatar' ? 'Avatar' : 'Cover photo'} updated!` });
    } catch {
      setMessage({ type: 'error', text: `Failed to upload ${type}.` });
    }
  };

  const closeCropModal = () => {
    setCropModalInfo({ isOpen: false, src: null, type: null });
  };

  return (
    <div className="page" style={{ background: 'var(--gray-50)' }}>
      <div className="container-sm">
        <div className="card fade-in">
          <div className="card-body">
            <h2 className="mb-3">Edit Profile</h2>

            {message.text && (
              <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {message.text}
              </div>
            )}

            <div className="mb-4 flex gap-3 flex-wrap">
              <div>
                <label className="block text-sm font-semibold mb-1">Avatar</label>
                <div className="flex items-center gap-2">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="avatar avatar-lg" />
                  ) : (
                    <div className="avatar avatar-lg avatar-placeholder">{user?.name?.[0]}</div>
                  )}
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    Upload Avatar
                    <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'avatar')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Cover Photo</label>
                <div className="flex items-center gap-2">
                  <div style={{ width: '120px', height: '64px', background: 'var(--gray-200)', borderRadius: '8px', overflow: 'hidden' }}>
                    {user?.cover ? <img src={user.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                  </div>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    Upload Cover
                    <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'cover')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-input" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Professional Headline</label>
                  <input className="form-input" type="text" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Software Engineer at Tech Corp" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input className="form-input" type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Delhi, India" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input className="form-input" type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Website / Portfolio URL</label>
                  <input className="form-input" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Skills (comma separated)</label>
                  <input className="form-input" type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Marketing, Sales" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>About Me</label>
                  <textarea className="form-textarea" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} placeholder="Tell the community about yourself..."></textarea>
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/profile/${user.id}`)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {cropModalInfo.isOpen && (
        <ImageCropperModal
          imageSrc={cropModalInfo.src}
          title={`Crop ${cropModalInfo.type === 'avatar' ? 'Avatar' : 'Cover Photo'}`}
          aspect={cropModalInfo.type === 'avatar' ? 1 : 120 / 64}
          onCropComplete={handleCropComplete}
          onCancel={closeCropModal}
        />
      )}
    </div>
  );
}
