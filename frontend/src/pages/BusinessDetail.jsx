import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Business.css';

function renderStars(n) {
  const count = Math.round(n || 0);
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= (hovered || value) ? 'active' : ''}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          title={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function BusinessDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => { fetchBusiness(); }, [id]);

  const fetchBusiness = async () => {
    try {
      const { data } = await API.get(`/businesses/${id}`);
      setBiz(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to leave a review');
    setBtnLoading(true);
    try {
      await API.post(`/businesses/${id}/ratings`, { stars: ratingVal, review: reviewText });
      setReviewText('');
      setRatingVal(5);
      fetchBusiness();
    } catch (err) {
      console.error(err);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!biz) return <div className="empty-state card container-sm mt-4"><h3>Business not found</h3></div>;

  const defaultImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';
  const avgRating = Number(biz.avgRating || 0);
  const ratings = biz.ratings || [];

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((n) => {
    const count = ratings.filter((r) => r.stars === n).length;
    const pct = ratings.length ? Math.round((count / ratings.length) * 100) : 0;
    return { n, pct };
  });

  const isOwner = user?.id === biz.ownerId;

  return (
    <div className="biz-detail-page" style={{ minHeight: '100vh' }}>

      {/* ── Business Name Banner (no cover image) ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1a3a5c 100%)',
        padding: '40px 24px 0',
        position: 'relative',
        overflow: 'visible',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 0 }}>
          {/* Square Logo */}
          <div style={{
            width: 100, height: 100,
            borderRadius: 16,
            border: '4px solid white',
            overflow: 'hidden',
            background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            flexShrink: 0,
            marginBottom: -20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}>
            {biz.imageUrl ? (
              <img src={biz.imageUrl} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>🏢</span>
            )}
          </div>
          {/* Business name in the banner */}
          <div style={{ paddingBottom: 24, flex: 1 }}>
            <span style={{
              background: 'rgba(255,255,255,0.15)', color: 'white',
              padding: '2px 12px', borderRadius: 20, fontSize: '0.75rem',
              marginBottom: 6, display: 'inline-block',
            }}>
              {biz.category}
            </span>
            <h1 style={{ color: 'white', fontSize: '1.8rem', margin: '4px 0 0' }}>{biz.name}</h1>
          </div>
          {/* Edit button — owner only */}
          {isOwner && (
            <div style={{ paddingBottom: 24, flexShrink: 0 }}>
              <Link
                to={`/businesses/${biz.id}/edit`}
                className="btn btn-secondary btn-sm"
                id="edit-biz-btn"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                ✏️ Edit Listing
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="biz-detail-layout">

        {/* ── Left column ── */}
        <div className="biz-main">

          {/* Actions + rating card */}
          <div className="biz-section slide-up" style={{ marginTop: 28 }}>
            {/* Compact rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{avgRating.toFixed(1)}</span>
              <span className="gmb-stars">{renderStars(avgRating)}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                ({biz.ratingsCount} review{biz.ratingsCount !== 1 ? 's' : ''})
              </span>
            </div>

            {/* GMB-style pill actions */}
            <div className="biz-actions-row">
              {biz.phone && (
                <a href={`tel:${biz.phone}`} className="biz-action-pill primary">
                  📞 Call
                </a>
              )}
              {biz.website && (
                <a
                  href={biz.website.startsWith('http') ? biz.website : `https://${biz.website}`}
                  target="_blank" rel="noreferrer"
                  className="biz-action-pill"
                >
                  🌐 Website
                </a>
              )}
              <button className="biz-action-pill" onClick={() => document.getElementById('write-review').scrollIntoView({ behavior: 'smooth'})}>
                ✏️ Write Review
              </button>
              <button className="biz-action-pill">
                🔖 Save
              </button>
            </div>
          </div>

          {/* About */}
          {biz.description && (
            <div className="biz-section slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="biz-section-title">About</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--gray-600)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {biz.description}
              </p>
            </div>
          )}

          {/* Reviews + Rating breakdown */}
          <div className="biz-section slide-up" id="reviews-section" style={{ animationDelay: '0.2s' }}>
            <h3 className="biz-section-title">Reviews & Ratings</h3>

            {/* Rating showcase */}
            <div className="biz-rating-showcase" style={{ marginBottom: 16 }}>
              <div className="biz-rating-number">{avgRating.toFixed(1)}</div>
              <div className="biz-rating-details">
                <span className="biz-big-stars">{renderStars(avgRating)}</span>
                <span className="biz-review-count">{biz.ratingsCount} reviews</span>
                <div className="rating-bars">
                  {dist.map(({ n, pct }) => (
                    <div key={n} className="rating-bar-row">
                      <span style={{ width: 12 }}>{n}</span>
                      <div className="rating-bar-track">
                        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span style={{ width: 28, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Write review */}
            {user && (
              <div className="review-form-card" id="write-review">
                <h4 style={{ fontSize: '0.95rem', marginBottom: 10 }}>Write a Review</h4>
                <form onSubmit={handleReviewSubmit}>
                  <StarPicker value={ratingVal} onChange={setRatingVal} />
                  <textarea
                    className="form-textarea"
                    placeholder="Share your experience with this business…"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    style={{ marginBottom: 10, minHeight: 90 }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={btnLoading}>
                    {btnLoading ? 'Submitting…' : 'Post Review'}
                  </button>
                </form>
              </div>
            )}

            {/* Review list */}
            {ratings.length > 0 ? (
              ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review) => (
                <div key={review.id} className="gmb-review-card">
                  <div className="gmb-reviewer-row">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt="" className="avatar" style={{ width: 36, height: 36 }} />
                    ) : (
                      <div className="avatar avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                        {review.user?.name?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="gmb-reviewer-name">{review.user?.name || 'Anonymous'}</div>
                      <div className="gmb-review-date">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="gmb-review-stars">{renderStars(review.stars)}</div>
                  {review.review && <p className="gmb-review-text" style={{ marginTop: 6 }}>{review.review}</p>}
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.88rem', padding: '20px 0' }}>
                No reviews yet. Be the first to share your experience!
              </p>
            )}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="biz-sidebar">
          {/* Business Info */}
          <div className="biz-info-card slide-up">
            <h4 style={{ fontSize: '1rem', marginBottom: 4, color: 'var(--navy)' }}>Business Info</h4>
            {biz.location && (
              <div className="biz-info-row">
                <span className="biz-info-icon">📍</span>
                <div>
                  <div className="biz-info-label">Address</div>
                  <div className="biz-info-value">{biz.location}</div>
                </div>
              </div>
            )}
            {biz.phone && (
              <div className="biz-info-row">
                <span className="biz-info-icon">📞</span>
                <div>
                  <div className="biz-info-label">Phone</div>
                  <a href={`tel:${biz.phone}`} className="biz-info-value" style={{ color: 'var(--saffron)' }}>{biz.phone}</a>
                </div>
              </div>
            )}
            {biz.email && (
              <div className="biz-info-row">
                <span className="biz-info-icon">✉️</span>
                <div>
                  <div className="biz-info-label">Email</div>
                  <div className="biz-info-value" style={{ wordBreak: 'break-all' }}>{biz.email}</div>
                </div>
              </div>
            )}
            {biz.website && (
              <div className="biz-info-row">
                <span className="biz-info-icon">🌐</span>
                <div>
                  <div className="biz-info-label">Website</div>
                  <a
                    href={biz.website.startsWith('http') ? biz.website : `https://${biz.website}`}
                    target="_blank" rel="noreferrer"
                    className="biz-info-value"
                    style={{ color: 'var(--saffron)', wordBreak: 'break-all' }}
                  >
                    {biz.website.replace(/https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
            {biz.openingHours && (
              <div className="biz-info-row">
                <span className="biz-info-icon">🕒</span>
                <div>
                  <div className="biz-info-label">Hours</div>
                  <div className="biz-info-value">{biz.openingHours}</div>
                </div>
              </div>
            )}
            <div className="biz-info-row">
              <span className="biz-info-icon">🏷️</span>
              <div>
                <div className="biz-info-label">Industry</div>
                <div className="biz-info-value">{biz.category}</div>
              </div>
            </div>
          </div>

          {/* Listed By */}
          {biz.owner && (
            <div className="listed-by-card slide-up" style={{ animationDelay: '0.1s' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: 10 }}>LISTED BY</p>
              <Link to={`/profile/${biz.owner.id}`} style={{ textDecoration: 'none' }}>
                {biz.owner.avatar ? (
                  <img src={biz.owner.avatar} alt="" className="avatar" style={{ width: 52, height: 52, margin: '0 auto 8px' }} />
                ) : (
                  <div className="avatar avatar-placeholder" style={{ width: 52, height: 52, margin: '0 auto 8px', fontSize: '1.2rem' }}>
                    {biz.owner.name?.[0]}
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)', marginBottom: 4 }}>
                  {biz.owner.name}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--saffron)' }}>View Profile →</span>
              </Link>
            </div>
          )}

          {/* Back to directory */}
          <Link to="/businesses" className="btn btn-secondary" style={{ textAlign: 'center', display: 'block' }}>
            ← Back to Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
