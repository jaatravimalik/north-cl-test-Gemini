import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import BusinessDirectory from './pages/BusinessDirectory';
import BusinessDetail from './pages/BusinessDetail';
import CreateBusiness from './pages/CreateBusiness';
import EditBusiness from './pages/EditBusiness';
import MyBusinessDashboard from './pages/MyBusinessDashboard';
import Onboarding from './pages/Onboarding';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />

        {/* Business routes — /new and /my BEFORE /:id to avoid route conflicts */}
        <Route path="/businesses" element={<BusinessDirectory />} />
        <Route path="/businesses/new" element={<PrivateRoute><CreateBusiness /></PrivateRoute>} />
        <Route path="/businesses/my" element={<PrivateRoute><MyBusinessDashboard /></PrivateRoute>} />
        <Route path="/businesses/:id" element={<BusinessDetail />} />
        <Route path="/businesses/:id/edit" element={<PrivateRoute><EditBusiness /></PrivateRoute>} />
      </Routes>
    </>
  );
}
