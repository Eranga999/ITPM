import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'technician', // Default selected role
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
      console.log('Staff login data:', formData);

      const response = await fetch(`${apiUrl}/api/auth/staff/login`, {
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

      const dashboardRoutes = {
        technician: '/technician-dashboard',
        admin: '/admin-dashboard',
        serviceCenter: '/service-center-dashboard',
      };

      navigate(dashboardRoutes[data.data.user.role] || '/staff-login');
    } catch (err) {
      console.error('Staff login error:', err);
      setError(err.message || 'Invalid credentials. Please try again or contact your administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-800 p-4">
          <h2 className="text-2xl font-bold text-center text-white">Easy Fix</h2>
          <p className="text-center text-gray-300">Staff Portal</p>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">Staff Login</h3>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Role
              </label>
              <div className="relative">
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="technician">Technician</option>
                  <option value="admin">Administrator</option>
                  <option value="serviceCenter">Service Center Staff</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

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

            <div className="mb-6">
              <button
                type="submit"
                className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 ${
                  formData.userType === 'technician'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : formData.userType === 'admin'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/customer-login" className="text-sm text-gray-600 hover:text-gray-900">
          Back to Customer Login
        </Link>
      </div>
    </div>
  );
};

export default StaffLogin;