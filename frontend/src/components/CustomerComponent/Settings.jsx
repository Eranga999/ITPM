import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChangeInput = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordChangeSuccess(false);
    setPasswordError('');

    const { oldPassword, newPassword, confirmPassword } = passwordData;

    // Client-side validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPasswordError('Authentication token missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/customer/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        throw new Error('Server did not return JSON. Check the endpoint or server status.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setPasswordChangeSuccess(true);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setPasswordChangeSuccess(false);
        localStorage.removeItem('token');
        navigate('/'); 
      }, 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white bg-opacity-95 p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm">Settings</h2>
        <span className="text-sm text-gray-500 drop-shadow-sm">Last updated: Today</span>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
        {passwordChangeSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center space-x-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Password updated successfully! Redirecting to login...</span>
          </div>
        )}
        {passwordError && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center space-x-2">
            <span>{passwordError}</span>
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChangeInput}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChangeInput}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChangeInput}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
