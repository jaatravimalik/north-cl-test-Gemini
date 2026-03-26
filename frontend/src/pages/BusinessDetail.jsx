import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';

export default function BusinessDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review state
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, [id]);

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
      fetchBusiness(); // refresh to show new review
    } catch (err) {
      console.error(err);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!biz) return <div className="empty-state card mt-4 container-sm"><h3>Business not found</h3></div>;

  const defaultImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="page" style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        {/* Cover Photo */}
        <div style={{ height: '300px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', position: 'relative' }}>
          <img src={biz.imageUrl || defaultImage} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <span className="badge badge-category" style={{ fontSize: '1rem', padding: '6px 16px' }}>{biz.category}</span>
          </div>
        </div>

        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
          <div className="main-content">
            <div className="card mb-4 slide-up">
              <div className="card-body">
                <h1 className="mb-1" style={{ fontSize: '2.5rem' }}>{biz.name}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating stars={biz.avgRating} size="lg" />
                  <span className="text-muted font-medium">({biz.avgRating || 0} average • {biz.ratingsCount} reviews)</span>
                </div>
                <h3 className="mb-2">About the Business</h3>
                <p className="text-muted" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {biz.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="card slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-body">
                <h3 className="mb-3">Reviews</h3>

                {/* Leave Review Form */}
                {user && (
                  <form onSubmit={handleReviewSubmit} className="mb-4 pt-3 border-top">
                    <h4 className="mb-2 text-sm">Write a Review</h4>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold">Your Rating:</span>
                      <select className="form-select" style={{ width: 'auto', padding: '6px 12px' }} value={ratingVal} onChange={(e) => setRatingVal(Number(e.target.value))}>
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                      </select>
                    </div>
                    <textarea
                      required
                      className="form-textarea mb-2"
                      placeholder="Share your experience..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" disabled={btnLoading}>
                      {btnLoading ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                )}

                {/* Review List */}
                <div className="reviews-list">
                  {biz.ratings?.length > 0 ? (
                    biz.ratings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-muted text-sm text-center py-4">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-body">
                <h3 className="mb-3 border-bottom pb-2">Business Info</h3>
                <div className="flex flex-col gap-3">
                  {biz.location && (
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.2rem' }}>📍</span>
                      <div>
                        <div className="text-xs text-muted">Location</div>
                        <div className="font-semibold">{biz.location}</div>
                      </div>
                    </div>
                  )}
                  {biz.phone && (
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.2rem' }}>📞</span>
                      <div>
                        <div className="text-xs text-muted">Phone</div>
                        <div className="font-semibold">{biz.phone}</div>
                      </div>
                    </div>
                  )}
                  {biz.email && (
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.2rem' }}>✉️</span>
                      <div>
                        <div className="text-xs text-muted">Email</div>
                        <div className="font-semibold">{biz.email}</div>
                      </div>
                    </div>
                  )}
                  {biz.website && (
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.2rem' }}>🔗</span>
                      <div>
                        <div className="text-xs text-muted">Website</div>
                        <a href={biz.website.startsWith('http') ? biz.website : `https://${biz.website}`} target="_blank" rel="noreferrer" className="font-semibold hover-saffron">
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                  {biz.openingHours && (
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.2rem' }}>🕒</span>
                      <div>
                        <div className="text-xs text-muted">Hours</div>
                        <div className="font-semibold">{biz.openingHours}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-body text-center">
                <h4 className="mb-2">Listed By</h4>
                {biz.owner && (
                  <>
                    <Link to={`/profile/${biz.owner.id}`} style={{ display: 'inline-block', marginBottom: '8px' }}>
                      {biz.owner.avatar ? (
                        <img src={biz.owner.avatar} alt="" className="avatar avatar-lg mx-auto" />
                      ) : (
                        <div className="avatar avatar-lg avatar-placeholder mx-auto">{biz.owner.name[0]}</div>
                      )}
                    </Link>
                    <div className="font-bold">{biz.owner.name}</div>
                    <Link to={`/profile/${biz.owner.id}`} className="text-sm text-saffron">View Profile</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
