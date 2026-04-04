import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    API.get(`/users/${userId}`)
      .then(({ data }) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!profile) return <div className="empty-state card container-sm mt-4"><h3>Profile not found</h3></div>;

  const isOwner = currentUser?.id === profile.id;
  const isFollowing = profile.followers?.some((f) => f.id === currentUser?.id);

  const handleFollow = async () => {
    if (!currentUser) return;
    setFollowLoading(true);
    try {
      await API.post(`/users/${profile.id}/follow`);
      setProfile((prev) => ({
        ...prev,
        followers: [...(prev.followers || []), currentUser],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUser) return;
    setFollowLoading(true);
    try {
      await API.delete(`/users/${profile.id}/follow`);
      setProfile((prev) => ({
        ...prev,
        followers: (prev.followers || []).filter((f) => f.id !== currentUser.id),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const followerCount = profile.followers?.length || 0;
  const followingCount = profile.following?.length || 0;

  return (
    <div className="profile-page page">
      {/* ── Cover + Identity Block (full width) ── */}
      <div className="container" style={{ maxWidth: 1080, margin: '0 auto', padding: '16px 20px 0' }}>
        <div className="profile-cover-wrap fade-in">
          {/* Cover image / gradient */}
          <div className="profile-cover-placeholder" />

          {/* Identity info */}
          <div className="profile-identity">
            {/* Avatar */}
            <div className="profile-avatar-wrap">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="avatar" />
              ) : (
                <div className="avatar avatar-placeholder">
                  {profile.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Name + headline */}
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-headline">{profile.headline || 'Community Member'}</p>

            {/* Location / website */}
            <div className="profile-location-row">
              {profile.location && <span>📍 {profile.location}</span>}
              {profile.website && (
                <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank" rel="noreferrer">
                  🔗 {profile.website.replace(/https?:\/\//, '')}
                </a>
              )}
            </div>

            {/* Connection count */}
            <div className="profile-connections-row">
              <span>{followerCount} follower{followerCount !== 1 ? 's' : ''}</span>
              {' · '}
              <span>{followingCount} following</span>
            </div>

            {/* Action buttons */}
            <div className="profile-actions-row">
              {isOwner ? (
                <Link to="/profile/edit" className="btn btn-outline btn-sm" id="edit-profile-btn">
                  ✏️ Edit Profile
                </Link>
              ) : currentUser ? (
                <>
                  <button
                    id="follow-btn"
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    disabled={followLoading}
                  >
                    {followLoading ? '...' : isFollowing ? '✓ Following' : '+ Follow'}
                  </button>
                  <button className="btn btn-outline btn-sm">💬 Message</button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="profile-layout">
        {/* Left: Main sections */}
        <div className="profile-main">

          {/* About */}
          {profile.about && (
            <div className="profile-section slide-up">
              <h3 className="profile-section-title">About</h3>
              <p className="profile-about-text">{profile.about}</p>
            </div>
          )}

          {/* Experience */}
          <div className="profile-section slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="profile-section-title">Experience</h3>
            {profile.experiences?.length > 0 ? (
              <ul className="li-timeline">
                {profile.experiences.map((exp) => (
                  <li key={exp.id} className="li-timeline-item">
                    <div className="li-timeline-icon">🏢</div>
                    <div className="li-timeline-body">
                      <div className="li-timeline-title">{exp.title}</div>
                      <div className="li-timeline-subtitle">{exp.company}</div>
                      <div className="li-timeline-date">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </div>
                      {exp.description && (
                        <p className="li-timeline-desc">{exp.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm">No experience listed yet.</p>
            )}
          </div>

          {/* Education */}
          <div className="profile-section slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="profile-section-title">Education</h3>
            {profile.educations?.length > 0 ? (
              <ul className="li-timeline">
                {profile.educations.map((edu) => (
                  <li key={edu.id} className="li-timeline-item">
                    <div className="li-timeline-icon">🎓</div>
                    <div className="li-timeline-body">
                      <div className="li-timeline-title">{edu.degree}</div>
                      <div className="li-timeline-subtitle">{edu.institution}</div>
                      <div className="li-timeline-date">Class of {edu.year}</div>
                      {edu.description && (
                        <p className="li-timeline-desc">{edu.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm">No education listed yet.</p>
            )}
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="profile-section slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="profile-section-title">Skills</h3>
              <div className="skills-grid">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="skill-badge">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-sidebar-card slide-up">
            <h5>Profile Overview</h5>
            <div className="sidebar-stat">
              <span>Followers</span>
              <strong>{followerCount}</strong>
            </div>
            <div className="sidebar-stat">
              <span>Following</span>
              <strong>{followingCount}</strong>
            </div>
            {profile.city && (
              <div className="sidebar-stat">
                <span>City</span>
                <strong>{profile.city}</strong>
              </div>
            )}
            {profile.state && (
              <div className="sidebar-stat">
                <span>State</span>
                <strong>{profile.state}</strong>
              </div>
            )}
          </div>

          {/* Contact info if owner */}
          {isOwner && (
            <div className="profile-sidebar-card slide-up" style={{ animationDelay: '0.1s' }}>
              <h5>Contact Info</h5>
              {profile.email && (
                <div className="sidebar-stat">
                  <span>Email</span>
                  <strong style={{ fontSize: '0.78rem' }}>{profile.email}</strong>
                </div>
              )}
              {profile.phone && (
                <div className="sidebar-stat">
                  <span>Phone</span>
                  <strong>{profile.phone}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
