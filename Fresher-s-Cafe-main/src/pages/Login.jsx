import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login, register } = useCart();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    const submitAuth = async () => {
      try {
        if (isLogin) {
          await login({
            email: formData.email,
            password: formData.password,
          });
          setMessage('Login successful!');
          setTimeout(() => navigate('/'), 700);
        } else {
          await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          });
          setMessage('Account created successfully!');
          setTimeout(() => navigate('/'), 700);
        }
      } catch (error) {
        setMessage(error.message || 'Authentication failed');
      }
    };

    submitAuth();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-gray-900 to-secondary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to your account' : 'Join Fresher\'s Cafe today'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your username"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {message && (
              <div className={`p-4 rounded-lg text-center font-semibold ${
                message.includes('success') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
              }}
              className="text-primary hover:text-orange-600 font-semibold transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign Up" 
                : 'Already have an account? Sign In'}
            </button>
          </div>

          {isLogin && (
            <div className="text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
