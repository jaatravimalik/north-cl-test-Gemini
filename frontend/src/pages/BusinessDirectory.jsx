import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import './Business.css';

const INDUSTRIES = [
  { label: 'All', icon: '🏬' },
  { label: 'Food & Restaurant', icon: '🍽️' },
  { label: 'Real Estate', icon: '🏠' },
  { label: 'IT & Tech', icon: '💻' },
  { label: 'Travel & Tours', icon: '✈️' },
  { label: 'Finance & Accounting', icon: '💰' },
  { label: 'Education', icon: '🎓' },
  { label: 'Health & Wellness', icon: '🏥' },
  { label: 'Fashion & Clothing', icon: '👗' },
  { label: 'Grocery', icon: '🛒' },
  { label: 'Legal Services', icon: '⚖️' },
];

function renderStars(avg) {
  const filled = Math.round(avg || 0);
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

export default function BusinessDirectory() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState('All');
  const [search, setSearch] = useState('');
  const [inputVal, setInputVal] = useState('');

  const fetchBusinesses = async (cat, q) => {
    setLoading(true);
    try {
      let url = '/businesses?';
      if (cat && cat !== 'All') url += `category=${encodeURIComponent(cat)}&`;
      if (q) url += `q=${encodeURIComponent(q)}`;
      const { data } = await API.get(url);
      setBusinesses(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses(industry, search);
  }, [industry]); // re-fetch on industry change

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(inputVal);
    fetchBusinesses(industry, inputVal);
  };

  const handleClear = () => {
    setIndustry('All');
    setSearch('');
    setInputVal('');
    fetchBusinesses('All', '');
  };

  const defaultThumb = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600';

  return (
    <div style={{ background: 'var(--gray-100)', minHeight: '100vh' }}>
      {/* Hero search bar */}
      <div className="biz-dir-hero">
        <h1>Business <span style={{ color: 'var(--saffron)' }}>Directory</span></h1>
        <p>Discover and support local North Indian businesses</p>
        <form onSubmit={handleSearch} className="biz-search-bar">
          <input
            id="biz-search-input"
            type="text"
            className="biz-search-input"
            placeholder="Search businesses by name…"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="biz-search-btn">🔍 Search</button>
        </form>
      </div>

      {/* Industry filter chips */}
      <div className="industry-filters">
        {INDUSTRIES.map(({ label, icon }) => (
          <button
            key={label}
            id={`filter-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`industry-chip ${industry === label ? 'active' : ''}`}
            onClick={() => setIndustry(label)}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--navy)' }}>
              {loading ? 'Loading…' : `${businesses.length} result${businesses.length !== 1 ? 's' : ''}`}
            </strong>
            {(industry !== 'All' || search) && (
              <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginLeft: 8 }}>
                {industry !== 'All' && `in "${industry}"`}
                {search && ` for "${search}"`}
              </span>
            )}
          </div>
          <div className="flex gap-1 items-center">
            {(industry !== 'All' || search) && (
              <button className="btn btn-secondary btn-sm" onClick={handleClear}>✕ Clear</button>
            )}
            <Link to="/businesses/new" className="btn btn-primary btn-sm" id="list-business-btn">
              + List Your Business
            </Link>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading-page"><div className="spinner"></div></div>
        ) : businesses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {businesses.map((biz) => (
              <Link key={biz.id} to={`/businesses/${biz.id}`} className="gmb-card slide-up" id={`biz-card-${biz.id}`}>
                <img
                  src={biz.imageUrl || defaultThumb}
                  alt={biz.name}
                  className="gmb-card-thumb"
                />
                <div className="gmb-card-body">
                  <div className="gmb-card-name">{biz.name}</div>
                  <div className="gmb-card-cat">{biz.category}</div>
                  <div className="gmb-card-rating">
                    <span className="gmb-stars">{renderStars(biz.avgRating)}</span>
                    <span style={{ color: 'var(--gray-600)', fontWeight: 600 }}>
                      {biz.avgRating ? Number(biz.avgRating).toFixed(1) : 'New'}
                    </span>
                    <span style={{ color: 'var(--gray-400)' }}>
                      ({biz.ratingsCount} review{biz.ratingsCount !== 1 ? 's' : ''})
                    </span>
                  </div>
                  {biz.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 8,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {biz.description}
                    </p>
                  )}
                  <div className="gmb-card-location">
                    <span>📍</span>
                    <span>{biz.location || 'Location varies'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state card slide-up" style={{ margin: '40px auto', maxWidth: 480 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
            <h3>No businesses found</h3>
            <p>Try adjusting your search or clearing the industry filter.</p>
            <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={handleClear}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
