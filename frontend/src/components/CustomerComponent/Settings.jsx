import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../footer';
const Settings = () => {
  // Initialize isDarkMode from localStorage, default to false (light mode) if not set
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark' ? true : false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Update localStorage whenever isDarkMode changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    // Optionally, you can also update the document's class for global styling
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handlePasswordChangeInput = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordChangeSuccess(false);
    setPasswordError('');
    setIsLoading(true);

    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPasswordError('Authentication token missing. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending PUT request to: http://localhost:5000/api/auth/customer/password');
      const response = await fetch('http://localhost:5000/api/auth/customer/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response. Check server logs.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setPasswordChangeSuccess(true);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsLoading(false);
      setTimeout(() => {
        setPasswordChangeSuccess(false);
        localStorage.removeItem('token');
        navigate('/');
      }, 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token);
    if (!token) {
      setPasswordError('Authentication token missing. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending DELETE request to: http://localhost:5000/api/auth/customer/profile');
      const response = await fetch('http://localhost:5000/api/auth/customer/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response. Check server logs.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      console.log('Account deleted successfully:', data);
      localStorage.removeItem('token');
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setPasswordError(err.message || 'Failed to delete account');
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800'} transition-colors duration-300`}>
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <main className="flex-grow max-w-lg mx-auto p-6">
        <div className={`bg-opacity-95 p-8 rounded-xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          {/* Settings Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold drop-shadow-sm">Settings</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-800'} hover:opacity-80 transition-all duration-200 shadow-sm`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Change Password Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Change Password</h3>
            {passwordChangeSuccess && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center space-x-2 dark:bg-green-900/30 dark:text-green-400 shadow-sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Password updated successfully! Redirecting to login...</span>
              </div>
            )}
            {passwordError && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center space-x-2 dark:bg-red-900/30 dark:text-red-400 shadow-sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{passwordError}</span>
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-6">
              {[
                { label: 'Old Password', name: 'oldPassword', placeholder: 'Enter your old password' },
                { label: 'New Password', name: 'newPassword', placeholder: 'Enter your new password' },
                { label: 'Confirm New Password', name: 'confirmPassword', placeholder: 'Confirm your new password' },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={passwordData[field.name]}
                      onChange={handlePasswordChangeInput}
                      placeholder={field.placeholder}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md`}
                      required
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-4-4c0-1.1.9-2 2-2s2 .9 2 2m-6 4h12" />
                    </svg>
                  </div>
                </div>
              ))}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })}
                  className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all duration-300 shadow-sm hover:shadow-md`}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938 l 3 -2.647 z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Change Password</span>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-6">
              <button
                onClick={handleDeleteAccount}
                className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938 l 3 -2.647 z"></path>
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Account</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Settings;