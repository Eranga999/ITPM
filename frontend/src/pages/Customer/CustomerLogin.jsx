import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = 'http://localhost:5000'; // Hardcoded API URL
      console.log('API URL:', apiUrl);
      console.log('Login data:', formData);

      const response = await fetch(`${apiUrl}/api/auth/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      const text = await response.text();
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Raw response:', text);

      if (!contentType?.includes('application/json')) {
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }

      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('role', data.data.user.role);

      if (data.data.user.role === 'customer') {
        navigate('/home');
      } else {
        setError('Unexpected role. Please contact support.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-500 p-4">
          <h2 className="text-2xl font-bold text-center text-white">Easy Fix</h2>
          <p className="text-center text-blue-100">Home Appliance Repair</p>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">Customer Login</h3>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="text-blue-500 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/customer-signup" className="text-blue-500 hover:text-blue-700">
                  Sign up now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/staff-login" className="text-sm text-gray-600 hover:text-gray-900">
          Staff Login (Technician/Admin/Service Center)
        </Link>
      </div>
    </div>
  );
};

export default CustomerLogin;