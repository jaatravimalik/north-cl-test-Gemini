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
  if (!profile) return <div className="empty-state card"><h3>Profile not found</h3></div>;

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

  return (
    <div className="page profile-page">
      <div className="container-sm">
        <div className="card profile-header" style={{ backgroundImage: `url(${profile.cover || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000'})` }}>
          <div className="profile-header-overlay">
            <div className="profile-info-container">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="avatar avatar-xxl profile-avatar" />
              ) : (
                <div className="avatar avatar-xxl avatar-placeholder profile-avatar">{profile.name[0]}</div>
              )}
              <div className="profile-text">
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-headline text-saffron">{profile.headline || 'Community Member'}</p>
                <div className="profile-meta text-sm mt-1">
                  {profile.location && <span className="mr-2">📍 {profile.location}</span>}
                  {profile.website && <span>🔗 <a href={profile.website} target="_blank" rel="noreferrer" style={{color: 'white', textDecoration: 'underline'}}>{profile.website.replace('https://', '')}</a></span>}
                </div>
                <div className="profile-stats mt-2 flex gap-3 text-sm">
                  <span><strong>{profile.followers?.length || 0}</strong> Followers</span>
                  <span><strong>{profile.following?.length || 0}</strong> Following</span>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              {isOwner ? (
                <Link to="/profile/edit" className="btn btn-secondary btn-sm">Edit Profile</Link>
              ) : currentUser ? (
                <button
                  className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  disabled={followLoading}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="card mb-3 slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body">
            <h3 className="mb-2">About</h3>
            <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
              {profile.about || 'No about information provided yet.'}
            </p>
          </div>
        </div>

        <div className="card mb-3 slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body">
            <h3 className="mb-2">Skills</h3>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                {profile.skills.map((skill, index) => (
                  <span key={index} className="badge">{skill}</span>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">No skills added.</p>
            )}
          </div>
        </div>

        <div className="grid-2 slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card mb-3">
            <div className="card-body">
              <h3 className="mb-3">Experience</h3>
              {profile.experiences?.length > 0 ? (
                <div className="timeline">
                  {profile.experiences.map((exp) => (
                    <div key={exp.id} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4 className="mb-1">{exp.title}</h4>
                        <p className="text-saffron font-semibold">{exp.company}</p>
                        <p className="text-xs text-muted mb-2">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        <p className="text-sm">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No experience listed.</p>
              )}
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h3 className="mb-3">Education</h3>
              {profile.educations?.length > 0 ? (
                <div className="timeline">
                  {profile.educations.map((edu) => (
                    <div key={edu.id} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4 className="mb-1">{edu.degree}</h4>
                        <p className="text-navy font-semibold">{edu.institution}</p>
                        <p className="text-xs text-muted mb-2">Class of {edu.year}</p>
                        <p className="text-sm">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No education listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
