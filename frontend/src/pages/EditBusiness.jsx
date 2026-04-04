import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import ImageCropperModal from '../components/ImageCropperModal';
import './Business.css';

const CATEGORIES = [
  'Food & Restaurant', 'Real Estate', 'IT & Tech', 'Travel & Tours',
  'Finance & Accounting', 'Education', 'Health & Wellness', 'Fashion & Clothing',
  'Grocery', 'Legal Services',
];

export default function EditBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '', category: CATEGORIES[0], description: '',
    location: '', phone: '', email: '', website: '', openingHours: '',
  });
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [cropModal, setCropModal] = useState({ isOpen: false, src: null });

  useEffect(() => {
    API.get(`/businesses/${id}`)
      .then(({ data }) => {
        if (data.ownerId !== user?.id) {
          navigate(`/businesses/${id}`);
          return;
        }
        setBiz(data);
        setForm({
          name: data.name || '',
          category: data.category || CATEGORIES[0],
          description: data.description || '',
          location: data.location || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          openingHours: data.openingHours || '',
        });
      })
      .catch(() => navigate('/businesses'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await API.put(`/businesses/${id}`, form);
      setMessage({ type: 'success', text: 'Business updated successfully!' });
      setTimeout(() => navigate(`/businesses/${id}`), 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setMessage({ type: 'error', text: 'Logo must be under 500KB.' });
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => setCropModal({ isOpen: true, src: reader.result }));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLogoCropComplete = async (croppedBlob) => {
    setCropModal({ isOpen: false, src: null });
    if (croppedBlob.size > 500 * 1024) {
      setMessage({ type: 'error', text: 'Cropped logo exceeds 500KB.' });
      return;
    }
    const fd = new FormData();
    fd.append('logo', croppedBlob, 'logo.jpg');
    try {
      const { data } = await API.post(`/businesses/${id}/logo`, fd);
      setBiz(data);
      setMessage({ type: 'success', text: 'Logo updated!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to upload logo.' });
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div style={{ background: 'var(--gray-100)', minHeight: '100vh', padding: '24px 0 60px' }}>
      <div className="container-sm">
        {/* Back link */}
        <Link to={`/businesses/${id}`} style={{ fontSize: '0.85rem', color: 'var(--saffron)', marginBottom: 16, display: 'inline-block' }}>
          ← Back to Listing
        </Link>

        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: 28 }}>
          <h2 style={{ marginBottom: 20 }}>Edit Business Listing</h2>

          {message.text && (
            <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: 20 }}>
              {message.text}
            </div>
          )}

          {/* Business Logo Upload */}
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 12,
              border: '2px solid var(--gray-200)',
              overflow: 'hidden', flexShrink: 0,
              background: 'var(--gray-50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {biz?.imageUrl ? (
                <img src={biz.imageUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem' }}>🏢</span>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Business Logo</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: 8 }}>Square · max 500KB · will be cropped</div>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                {biz?.imageUrl ? 'Replace Logo' : 'Upload Logo'}
                <input type="file" accept="image/*" onChange={handleLogoSelect} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <form onSubmit={handleSave} className="grid-2">
            <div className="form-group">
              <label>Business Name *</label>
              <input required type="text" className="form-input" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select className="form-select" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea className="form-textarea" rows={4} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your business..." />
            </div>

            <div className="form-group">
              <label>Location / Address</label>
              <input type="text" className="form-input" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" className="form-input" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-input" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Website URL</label>
              <input type="url" className="form-input" value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Opening Hours</label>
              <input type="text" className="form-input" value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                placeholder="e.g. Mon–Fri 9AM–8PM" />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-secondary"
                onClick={() => navigate(`/businesses/${id}`)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {cropModal.isOpen && (
        <ImageCropperModal
          imageSrc={cropModal.src}
          title="Crop Business Logo"
          aspect={1}
          onCropComplete={handleLogoCropComplete}
          onCancel={() => setCropModal({ isOpen: false, src: null })}
        />
      )}
    </div>
  );
}
