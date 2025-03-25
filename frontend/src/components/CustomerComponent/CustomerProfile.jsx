import React, { useState, useEffect } from 'react';

const CustomerProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/customer/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.log('Non-JSON response:', text);
          throw new Error('Server did not return JSON. Check the endpoint or server status.');
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        setFormData({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        throw new Error('Server did not return JSON. Check the endpoint or server status.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      console.log('Profile updated successfully:', data.data);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white bg-opacity-95 p-8 rounded-xl shadow-lg border border-gray-100">
      {isSubmitted && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center space-x-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Profile updated successfully!</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center space-x-2">
          <span>{error}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm">Personal Information</h2>
        <span className="text-sm text-gray-500 drop-shadow-sm">Last updated: Today</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'First Name', name: 'firstName' },
            { label: 'Last Name', name: 'lastName' },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
                required
              />
            </div>
          ))}
        </div>

        {['email', 'phone'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === 'email' ? 'email' : 'tel'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
              required
            />
          </div>
        ))}

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            id="address"
            name="address"
            rows={4}
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm resize-y"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
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
  );
};

export default CustomerProfile;