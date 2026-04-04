import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Business.css';

function renderStars(avg) {
  const n = Math.round(avg || 0);
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

export default function MyBusinessDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    API.get('/businesses/my')
      .then(({ data }) => setListings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const defaultThumb = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600';

  return (
    <div style={{ background: 'var(--gray-100)', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Dashboard header */}
      <div style={{
        background: 'var(--navy)',
        padding: '40px 24px 32px',
        color: 'white',
      }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', marginBottom: 4 }}>
                🏢 My Business Listings
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Manage your business profiles on NorthIndia Connect
              </p>
            </div>
            <Link to="/businesses/new" className="btn btn-primary" id="add-listing-btn">
              + Add New Listing
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1000, padding: '24px 20px' }}>
        {loading ? (
          <div className="loading-page"><div className="spinner"></div></div>
        ) : listings.length === 0 ? (
          <div style={{
            background: 'var(--white)', border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-md)', padding: 48, textAlign: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🏬</div>
            <h3 style={{ marginBottom: 8 }}>No listings yet</h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>
              List your business to reach the North Indian community.
            </p>
            <Link to="/businesses/new" className="btn btn-primary">
              + List Your Business
            </Link>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 24,
            }}>
              {[
                { label: 'Total Listings', value: listings.length, icon: '🏢' },
                { label: 'Total Reviews', value: listings.reduce((s, b) => s + b.ratingsCount, 0), icon: '⭐' },
                { label: 'Avg Rating', value: listings.length ? (listings.reduce((s, b) => s + (b.avgRating || 0), 0) / listings.length).toFixed(1) : '—', icon: '📊' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: 'var(--white)', border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: '1.6rem' }}>{stat.icon}</span>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Listings table/cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {listings.map((biz) => (
                <div key={biz.id} style={{
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                }}>
                  {/* Logo */}
                  <div style={{
                    width: 64, height: 64, borderRadius: 12,
                    overflow: 'hidden', flexShrink: 0,
                    border: '1px solid var(--gray-200)',
                    background: 'var(--gray-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {biz.imageUrl ? (
                      <img src={biz.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>🏢</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: 2 }}>
                      {biz.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 4 }}>
                      {biz.category} {biz.location ? `· ${biz.location}` : ''}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#FBBC04', fontWeight: 600 }}>
                      {renderStars(biz.avgRating)} {biz.avgRating ? biz.avgRating.toFixed(1) : 'No ratings'}
                      <span style={{ color: 'var(--gray-400)', fontWeight: 400, marginLeft: 4 }}>
                        ({biz.ratingsCount} review{biz.ratingsCount !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Link
                      to={`/businesses/${biz.id}`}
                      className="btn btn-secondary btn-sm"
                      id={`view-biz-${biz.id}`}
                    >
                      👁 View
                    </Link>
                    <Link
                      to={`/businesses/${biz.id}/edit`}
                      className="btn btn-primary btn-sm"
                      id={`edit-biz-${biz.id}`}
                    >
                      ✏️ Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
