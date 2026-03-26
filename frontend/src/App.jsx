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

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/businesses" element={<BusinessDirectory />} />
        <Route path="/businesses/:id" element={<BusinessDetail />} />
        <Route path="/businesses/new" element={<PrivateRoute><CreateBusiness /></PrivateRoute>} />
      </Routes>
    </>
  );
}
