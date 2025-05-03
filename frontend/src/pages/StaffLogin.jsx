import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';

  const StaffLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        console.log('Login payload:', formData);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('API URL:', apiUrl);
        const response = await axios.post(`${apiUrl}/api/staff/login`, formData, {
          headers: { 'Content-Type': 'application/json' }
        });
        const { token, staff } = response.data.data;
        console.log('Login response:', response.data);

        localStorage.setItem('token', token);
        localStorage.setItem('userType', staff.userType);

        switch (staff.userType) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'technician':
            navigate('/technician-dashboard');
            break;
          case 'serviceCenter':
            navigate('/service-center-dashboard');
            break;
          default:
            navigate('/');
        }
      } catch (err) {
        console.error('Login error:', err);
        console.log('Error response:', err.response?.data);
        setError(err.response?.data?.message || 'Login failed. Please check your email and password.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Staff Login</h2>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/staff-signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    );
  };

  export default StaffLogin;