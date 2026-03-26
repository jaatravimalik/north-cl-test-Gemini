import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const CATEGORIES = [
  'Food & Restaurant', 'Real Estate', 'IT & Tech', 'Travel & Tours',
  'Finance & Accounting', 'Education', 'Health & Wellness', 'Fashion & Clothing',
  'Grocery', 'Legal Services'
];

export default function CreateBusiness() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', category: CATEGORIES[0], description: '', location: '', phone: '', email: '', website: '', openingHours: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (image) formData.append('image', image);

    try {
      const { data } = await API.post('/businesses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/businesses/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list business. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ background: 'var(--gray-50)' }}>
      <div className="container-sm">
        <div className="page-header text-center">
          <h1 className="page-title">List Your <span className="text-saffron">Business</span></h1>
          <p className="page-subtitle">Showcase your products or services to the community</p>
        </div>

        <div className="card fade-in">
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="grid-2">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Cover Image</label>
                <div className="flex items-center gap-2">
                  <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                    Choose File
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'none' }} />
                  </label>
                  <span className="text-sm text-muted">{image ? image.name : 'No file chosen (Optional but recommended)'}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Business Name*</label>
                <input required type="text" className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. Sharma Sweets" />
              </div>

              <div className="form-group">
                <label>Category*</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Describe your business..." rows="4" />
              </div>

              <div className="form-group">
                <label>Location / Address</label>
                <input type="text" className="form-input" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="e.g. Sector 18, Noida" />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" className="form-input" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Website URL</label>
                <input type="url" className="form-input" value={form.website} onChange={(e) => setForm({...form, website: e.target.value})} />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Opening Hours</label>
                <input type="text" className="form-input" value={form.openingHours} onChange={(e) => setForm({...form, openingHours: e.target.value})} placeholder="e.g. Mon-Fri 9AM - 8PM" />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Create Business Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
