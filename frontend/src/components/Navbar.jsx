import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔶</span>
          <span className="brand-text">NorthIndia<span className="brand-accent">Connect</span></span>
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <Link to="/feed" className="nav-link" onClick={() => setMenuOpen(false)}>Feed</Link>
          <Link to="/businesses" className="nav-link" onClick={() => setMenuOpen(false)}>Directory</Link>

          {user ? (
            <div className="nav-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="avatar avatar-sm" />
              ) : (
                <div className="avatar avatar-sm avatar-placeholder">{getInitials(user.name)}</div>
              )}
              <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
              <span className="nav-arrow">▾</span>

              {dropdownOpen && (
                <div className="nav-dropdown">
                  <Link to={`/profile/${user.id}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    👤 My Profile
                  </Link>
                  <Link to="/profile/edit" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    ✏️ Edit Profile
                  </Link>
                  <Link to="/businesses/new" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    🏢 List Business
                  </Link>
                  <Link to="/businesses/my" className="dropdown-item" onClick={() => setDropdownOpen(false)} id="my-listings-nav">
                    📋 My Listings
                  </Link>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
