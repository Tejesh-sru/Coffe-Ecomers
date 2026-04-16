import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Profile = () => {
  const { isAuthenticated, user, refreshProfile, updateProfile } = useCart();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const load = async () => {
      try {
        const profile = await refreshProfile();
        setUsername(profile.username);
      } catch (error) {
        setMessage(error.message || 'Failed to load profile');
      }
    };

    load();
  }, [isAuthenticated, refreshProfile]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-secondary">Please sign in</h2>
          <p className="text-gray-600">Login to view and manage your profile.</p>
          <Link to="/login" className="btn-primary inline-block">Go to Login</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const updatedProfile = await updateProfile(username);
      setUsername(updatedProfile.username);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-secondary mb-6">My Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              value={user?.email || ''}
              disabled
              className="input-field bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-gray-100 text-gray-700 font-medium text-center">
              {message}
            </div>
          )}

          <button type="submit" className="btn-primary w-full">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
