import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function ReviewCard({ review }) {
  return (
    <div className="review-card py-3 border-bottom" style={{ borderBottom: '1px solid var(--gray-200)', marginBottom: '16px' }}>
      <div className="flex gap-2 mb-2">
        <Link to={`/profile/${review.user.id}`}>
          {review.user.avatar ? (
            <img src={review.user.avatar} className="avatar avatar-sm" alt="" />
          ) : (
            <div className="avatar avatar-sm avatar-placeholder">{review.user.name[0]}</div>
          )}
        </Link>
        <div>
          <Link to={`/profile/${review.user.id}`} className="font-semibold text-navy hover-saffron" style={{ display: 'block', textDecoration: 'none' }}>
            {review.user.name}
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <StarRating stars={review.stars} size="sm" />
            <span className="text-xs text-muted ml-2">
              • {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm mt-2" style={{ lineHeight: '1.6' }}>
        {review.review}
      </p>
    </div>
  );
}
