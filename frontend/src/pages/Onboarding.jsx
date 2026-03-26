import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [bioForm, setBioForm] = useState({ headline: '', location: '', about: '', skills: '' });
  const [expForm, setExpForm] = useState({ title: '', company: '', startDate: '', endDate: '', description: '', current: false });
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '', description: '' });

  const submitBio = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = bioForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const { data } = await API.put('/users/me', { ...bioForm, skills: skillsArray });
      updateUser(data);
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitExp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (expForm.title && expForm.company) {
        await API.post('/users/me/experience', expForm);
      }
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitEdu = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (eduForm.degree && eduForm.institution) {
        await API.post('/users/me/education', eduForm);
      }
      navigate('/feed');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex items-center justify-center p-4 min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="card fade-in" style={{ maxWidth: '600px', width: '100%', margin: 'auto' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <h2 className="text-navy">Welcome to NorthIndia Connect!</h2>
            <p className="text-muted">Let's set up your profile so the community can know you better.</p>
            
            <div className="flex justify-center mt-3 gap-2">
              <span className={`badge ${step >= 1 ? 'bg-saffron text-white' : 'bg-gray-200 text-muted'}`}>1. Details</span>
              <span className={`badge ${step >= 2 ? 'bg-saffron text-white' : 'bg-gray-200 text-muted'}`}>2. Experience</span>
              <span className={`badge ${step >= 3 ? 'bg-saffron text-white' : 'bg-gray-200 text-muted'}`}>3. Education</span>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={submitBio} className="slide-up">
              <h3 className="mb-3">Personal Details</h3>
              <div className="form-group">
                <label>Professional Headline</label>
                <input required type="text" className="form-input" placeholder="e.g. Software Engineer at Tech Corp" value={bioForm.headline} onChange={e => setBioForm({...bioForm, headline: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input required type="text" className="form-input" placeholder="e.g. Delhi, India" value={bioForm.location} onChange={e => setBioForm({...bioForm, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input type="text" className="form-input" placeholder="e.g. React, Marketing, Law" value={bioForm.skills} onChange={e => setBioForm({...bioForm, skills: e.target.value})} />
              </div>
              <div className="form-group">
                <label>About Me</label>
                <textarea className="form-textarea" placeholder="Write a short bio..." value={bioForm.about} onChange={e => setBioForm({...bioForm, about: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                {loading ? 'Saving...' : 'Next'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={submitExp} className="slide-up">
              <h3 className="mb-3">Add Recent Experience</h3>
              <p className="text-sm text-muted mb-3">Add your current or most recent job. You can add more later from your profile.</p>
              <div className="form-group">
                <label>Job Title</label>
                <input type="text" className="form-input" placeholder="e.g. Product Manager" required value={expForm.title} onChange={e => setExpForm({...expForm, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" className="form-input" placeholder="e.g. Google" required value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="month" className="form-input" required value={expForm.startDate} onChange={e => setExpForm({...expForm, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="month" className="form-input" disabled={expForm.current} value={expForm.endDate} onChange={e => setExpForm({...expForm, endDate: e.target.value})} />
                </div>
              </div>
              <div className="form-group flex items-center gap-2">
                <input type="checkbox" id="currentRole" checked={expForm.current} onChange={e => setExpForm({...expForm, current: e.target.checked, endDate: ''})} />
                <label htmlFor="currentRole" style={{margin: 0}}>I currently work here</label>
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea className="form-textarea" placeholder="Briefly describe what you did..." value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} />
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={() => setStep(3)}>Skip</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                  {loading ? 'Saving...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={submitEdu} className="slide-up">
              <h3 className="mb-3">Add Education</h3>
              <p className="text-sm text-muted mb-3">Add your highest degree. You can update this later.</p>
              <div className="form-group">
                <label>Degree / Certificate</label>
                <input type="text" className="form-input" placeholder="e.g. B.Tech in Computer Science" required value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Institution / University</label>
                <input type="text" className="form-input" placeholder="e.g. Delhi University" required value={eduForm.institution} onChange={e => setEduForm({...eduForm, institution: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Graduation Year</label>
                <input type="text" className="form-input" placeholder="YYYY" required value={eduForm.year} onChange={e => setEduForm({...eduForm, year: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea className="form-textarea" placeholder="Activities and societies..." value={eduForm.description} onChange={e => setEduForm({...eduForm, description: e.target.value})} />
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={() => navigate('/feed')}>Skip & Finish</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                  {loading ? 'Saving...' : 'Finish Setup'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
