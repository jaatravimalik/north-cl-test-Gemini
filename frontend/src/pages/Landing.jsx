import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';
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
  { title: 'Community Feed', desc: 'Share updates, connect with peers, and grow your professional network.', icon: '📰' },
  { title: 'Business Directory', desc: 'List your business and discover services from the North Indian community.', icon: '🏢' },
  { title: 'Ratings & Reviews', desc: 'Find trusted businesses through authentic community reviews.', icon: '⭐' },
];

const TESTIMONIALS = [
  { text: 'NorthIndia Connect helped me find incredible clients within my own community. Highly recommend!', name: 'Ravi Kumar', role: 'Freelance Developer, Lucknow' },
  { text: 'Got my restaurant listed and saw a 40% increase in footfall within the first month!', name: 'Priya Sharma', role: 'Restaurant Owner, Delhi' },
  { text: 'Finally a platform that truly understands North Indian professionals and businesses.', name: 'Amit Singh', role: 'CA, Agra' },
  { text: 'The feed keeps me connected with my professional network in Uttar Pradesh without any noise.', name: 'Neha Gupta', role: 'Marketing Manager, Kanpur' },
  { text: 'Found an interior designer through the directory — excellent quality and trust!', name: 'Suresh Yadav', role: 'Homeowner, Varanasi' },
  { text: 'Best community platform for small business owners in North India. Period.', name: 'Kavita Mishra', role: 'Boutique Owner, Allahabad' },
];

// Scroll-reveal hook
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, delay = 0, className = '' }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();

  // Double testimonials for seamless loop
  const allTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div className="hero-orb hero-orb-3" aria-hidden="true" />

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
              <Link to="/feed" className="btn btn-primary btn-lg" id="go-to-feed-btn">
                Go to Feed →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="join-btn">
                  Join the Community Free
                </Link>
                <Link to="/businesses" className="btn btn-secondary btn-lg" id="explore-btn">
                  Explore Directory
                </Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">10K+</span>
              <span className="stat-label">Members</span>
            </div>
            <div className="stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Businesses</span>
            </div>
            <div className="stat">
              <span className="stat-num">50K+</span>
              <span className="stat-label">Connections</span>
            </div>
          </div>
        </div>

        {/* Wave SVG divider */}
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="wave-divider" preserveAspectRatio="none" style={{ fill: 'var(--gray-100)' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* ── Features ── */}
      <section className="section section-gray">
        <div className="container">
          <RevealSection className="section-header text-center">
            <h2>Everything You Need to <span className="text-saffron">Grow</span></h2>
            <p className="text-muted">Powerful tools designed for the North Indian community</p>
          </RevealSection>

          <div className="features-grid">
            {features.map((f, i) => (
              <RevealSection key={i} delay={i * 100}>
                <div className="feature-card">
                  <span className="feature-icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section section-cream">
        <div className="container">
          <RevealSection className="section-header text-center">
            <h2>Browse by <span className="text-saffron">Industry</span></h2>
            <p className="text-muted">Find exactly what you need from our business directory</p>
          </RevealSection>

          <div className="categories-grid">
            {categories.map((c, i) => (
              <RevealSection key={i} delay={i * 60}>
                <Link
                  to={`/businesses?category=${encodeURIComponent(c.name)}`}
                  className="category-card"
                  id={`cat-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <span className="category-icon">{c.icon}</span>
                  <span className="category-name">{c.name}</span>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Auto-scroll Testimonials ── */}
      <div className="testimonials-strip">
        <div className="container text-center">
          <RevealSection>
            <h2 style={{ color: 'white', marginBottom: 32 }}>
              Loved by the <span className="text-saffron">Community</span>
            </h2>
          </RevealSection>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="testimonial-track">
            {allTestimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p>"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <RevealSection>
            <h2 className="cta-title">Ready to Connect?</h2>
            <p className="cta-subtitle">Join thousands of North Indian professionals and entrepreneurs today</p>
            {!user && (
              <Link to="/register" className="btn btn-primary btn-lg" id="cta-join-btn">
                Get Started — It's Free
              </Link>
            )}
          </RevealSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container text-center">
          <p className="brand-text" style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            🔶 NorthIndia<span className="text-saffron">Connect</span>
          </p>
          <p className="text-muted text-sm">
            Apna Network, Apni Pehchaan &bull; &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
