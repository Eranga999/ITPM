import React, { useState, useEffect } from 'react';

const CustomerProfile = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    progress: 0,
  });
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      const token = localStorage.getItem('token');
      setLoadingState({ isLoading: true, progress: 10 });

      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoadingState({ isLoading: false, progress: 100 });
        return;
      }

      try {
        setLoadingState({ isLoading: true, progress: 30 });
        const response = await fetch('http://localhost:5000/api/auth/customer/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setLoadingState({ isLoading: true, progress: 70 });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        setLoadingState({ isLoading: true, progress: 90 });
        setFormData({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
        });

        setLoadingState({ isLoading: false, progress: 100 });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        setLoadingState({ isLoading: false, progress: 100 });
      }
    };

    fetchCustomerProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleanedValue = value.replace(/[^+\d]/g, '');
      let errorMsg = '';
      if (value !== cleanedValue) {
        errorMsg = 'Only numbers and an optional "+" are allowed';
      } else if (cleanedValue.startsWith('+')) {
        const rest = cleanedValue.slice(1);
        if (!/^\d*$/.test(rest)) {
          errorMsg = 'Only numbers are allowed after "+"';
        }
      } else if (!/^\d*$/.test(cleanedValue)) {
        errorMsg = 'Only numbers are allowed';
      }
      setPhoneError(errorMsg);
      if (!errorMsg) {
        setFormData({ ...formData, [name]: cleanedValue });
      } else if (cleanedValue === '') {
        setFormData({ ...formData, [name]: '' });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    setError('');
    setLoadingState({ isLoading: true, progress: 10 });

    // Phone length validation on submit
    if (formData.phone.length < 10 || formData.phone.length > 15) {
      setPhoneError('Phone must be between 10 and 15 digits');
      setLoadingState({ isLoading: false, progress: 100 });
      return;
    } else {
      setPhoneError('');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      setLoadingState({ isLoading: false, progress: 100 });
      return;
    }

    try {
      setLoadingState({ isLoading: true, progress: 40 });
      const response = await fetch('http://localhost:5000/api/auth/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setLoadingState({ isLoading: true, progress: 70 });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setLoadingState({ isLoading: false, progress: 100 });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setLoadingState({ isLoading: false, progress: 100 });
    }
  };

  // Loading skeleton UI
  if (loadingState.isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${loadingState.progress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <div key={item} className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
              <div className="h-10 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
        {[1, 2].map((item) => (
          <div key={item + 2} className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
            <div className="h-10 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
          </div>
        ))}
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-gray-700"></div>
          <div className="h-32 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
        </div>
        <div className="flex justify-end space-x-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
          <div className="h-10 bg-blue-200 rounded w-32 dark:bg-blue-900"></div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="text-center py-10 max-w-2xl mx-auto">
        <div className="mb-6 p-6 bg-red-50 text-red-800 rounded-lg flex flex-col items-center space-y-4 dark:bg-red-900/20 dark:text-red-400 shadow-md">
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-semibold">Failed to Load Profile</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account and services
          </p>
        </div>

        {/* Success/Error Messages */}
        {isSubmitted && (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center space-x-2 dark:bg-green-900/30 dark:text-green-400 shadow-sm">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Profile updated successfully!</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center space-x-2 dark:bg-red-900/30 dark:text-red-400 shadow-sm">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Personal Information
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: Today
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'First Name', name: 'firstName', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { label: 'Last Name', name: 'lastName', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md`}
                    required
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {[
            { label: 'Email', name: 'email', type: 'email', icon: 'M16 12h2v4h-2v-4zm-4-4h2v8h-2V8zm-4 2h2v6H8v-6z' },
            { label: 'Phone', name: 'phone', type: 'tel', icon: 'M3 5h18M3 5v14h18V5M3 5l9 7 9-7' },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md`}
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                </svg>
              </div>
              {field.name === 'phone' && phoneError && (
                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
              )}
            </div>
          ))}

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={4}
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md resize-y`}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;