import { Link } from 'react-router-dom';

export default function BusinessCard({ biz }) {
  const defaultImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600';

  return (
    <Link to={`/businesses/${biz.id}`} className="card business-card slide-up" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={biz.imageUrl || defaultImage}
          alt={biz.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <span className="badge badge-category">{biz.category}</span>
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 className="mb-1 truncate text-navy">{biz.name}</h3>

        <div className="flex items-center gap-1 mb-2">
          <span className="text-warning">⭐ {biz.avgRating || 'New'}</span>
          <span className="text-muted text-sm">({biz.ratingsCount} reviews)</span>
        </div>

        <p className="text-sm text-muted mb-2 flex-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {biz.description}
        </p>

        <div className="text-xs text-navy font-semibold mt-auto flex items-center gap-1 border-top pt-2">
          <span>📍 {biz.location || 'Location varies'}</span>
        </div>
      </div>
    </Link>
  );
}
