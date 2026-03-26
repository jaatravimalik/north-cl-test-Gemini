import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../api/api';
import BusinessCard from '../components/BusinessCard';

const CATEGORIES = [
  'All', 'Food & Restaurant', 'Real Estate', 'IT & Tech', 'Travel & Tours',
  'Finance & Accounting', 'Education', 'Health & Wellness', 'Fashion & Clothing',
  'Grocery', 'Legal Services'
];

export default function BusinessDirectory() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const initialSearch = queryParams.get('q') || '';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      let url = '/businesses?';
      if (category !== 'All') url += `category=${encodeURIComponent(category)}&`;
      if (search) url += `q=${encodeURIComponent(search)}`;

      const { data } = await API.get(url);
      setBusinesses(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [category]); // re-fetch when category changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBusinesses();
  };

  return (
    <div className="page" style={{ background: 'var(--gray-50)' }}>
      <div className="container" style={{ padding: '0 24px' }}>
        <div className="page-header flex justify-between items-center flex-wrap gap-2">
          <div>
            <h1 className="page-title">Business <span className="text-saffron">Directory</span></h1>
            <p className="page-subtitle">Discover and support local North Indian businesses</p>
          </div>
          <Link to="/businesses/new" className="btn btn-primary">
            + List Your Business
          </Link>
        </div>

        <div className="card mb-4 slide-up">
          <div className="card-body">
            <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
              <div className="flex-1" style={{ minWidth: '200px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search businesses by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div style={{ flex: '0 0 200px' }}>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-secondary">Search</button>
            </form>

            <div className="flex gap-1 mt-3" style={{ flexWrap: 'wrap' }}>
              {CATEGORIES.slice(1, 6).map((c) => (
                <button
                  key={c}
                  className={`badge ${category === c ? 'badge-category' : ''}`}
                  onClick={() => setCategory(c)}
                  style={{ border: 'none', cursor: 'pointer', background: category === c ? 'var(--navy)' : 'var(--saffron-glow)', color: category === c ? 'var(--white)' : 'var(--saffron-dark)' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-page"><div className="spinner"></div></div>
        ) : businesses.length > 0 ? (
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {businesses.map((biz) => (
              <div key={biz.id} style={{ height: '100%' }}>
                <BusinessCard biz={biz} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state card slide-up">
            <h3>No businesses found</h3>
            <p>Try adjusting your search or category filter.</p>
            <button className="btn btn-secondary mt-2" onClick={() => { setCategory('All'); setSearch(''); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
