import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const categories = [
  { name: 'Food & Restaurant', icon: '🍛' },
  { name: 'Real Estate', icon: '🏠' },
  { name: 'IT & Tech', icon: '💻' },
  { name: 'Travel & Tours', icon: '✈️' },
  { name: 'Finance & Accounting', icon: '💰' },
  { name: 'Education', icon: '🎓' },
  { name: 'Health & Wellness', icon: '🏥' },
  { name: 'Fashion & Clothing', icon: '👗' },
  { name: 'Grocery', icon: '🛒' },
  { name: 'Legal Services', icon: '⚖️' },
];

const features = [
  { title: 'Professional Profiles', desc: 'Build your LinkedIn-style profile with experience, skills, and education.', icon: '👤' },
  { title: 'Community Feed', desc: 'Share updates, connect with others, and grow your professional network.', icon: '📰' },
  { title: 'Business Directory', desc: 'List your business and discover services from the North Indian community.', icon: '🏢' },
  { title: 'Ratings & Reviews', desc: 'Find trusted businesses through authentic community reviews and ratings.', icon: '⭐' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <div className="hero-badge">🔶 North India's #1 Community Platform</div>
          <h1 className="hero-title">
            Apna Network,<br />
            <span className="text-saffron">Apni Pehchaan</span>
          </h1>
          <p className="hero-subtitle">
            Connect with North Indian professionals, discover local businesses,
            and build meaningful relationships within our vibrant community.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/feed" className="btn btn-primary btn-lg">Go to Feed →</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Join the Community</Link>
                <Link to="/businesses" className="btn btn-secondary btn-lg">Explore Directory</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Members</span></div>
            <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Businesses</span></div>
            <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Connections</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Everything You Need to <span className="text-saffron">Grow</span></h2>
            <p className="text-muted">Powerful tools designed for the North Indian community</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card card slide-up" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="section-header text-center">
            <h2>Browse by <span className="text-saffron">Category</span></h2>
            <p className="text-muted">Find exactly what you need from our business directory</p>
          </div>
          <div className="categories-grid">
            {categories.map((c, i) => (
              <Link
                to={`/businesses?category=${encodeURIComponent(c.name)}`}
                className="category-card"
                key={i}
              >
                <span className="category-icon">{c.icon}</span>
                <span className="category-name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container text-center">
          <h2 className="cta-title">Ready to Connect?</h2>
          <p className="cta-subtitle">Join thousands of North Indian professionals and entrepreneurs</p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg">Get Started — It's Free</Link>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container text-center">
          <p className="brand-text" style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            🔶 NorthIndia<span className="text-saffron">Connect</span>
          </p>
          <p className="text-muted text-sm">
            Apna Network, Apni Pehchaan • © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
