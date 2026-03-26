export default function StarRating({ stars, size = 'md' }) {
  const fullStars = Math.floor(stars || 0);
  const partStar = (stars || 0) % 1;
  const emptyStars = 5 - Math.ceil(stars || 0);

  const fontSize = size === 'lg' ? '1.4rem' : size === 'sm' ? '0.9rem' : '1.1rem';

  return (
    <div className="stars" style={{ fontSize }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`f${i}`} className="star-full">★</span>
      ))}
      {partStar > 0 && (
        // Simple approximation for half star using characters or just rendering half width, for now using ★ but styled differently maybe, let's just use ★ for half visually or a specific char.
        // Easiest is to render a partial star visually with CSS or just full for >0.5
        <span key="p" style={{ opacity: 0.5 }}>★</span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`e${i}`} className="star-empty">★</span>
      ))}
    </div>
  );
}
