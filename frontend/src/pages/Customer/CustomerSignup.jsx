import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loginheader from '../../components/Loginheader';
import Footer from '../../components/Footer';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone, FaHome } from 'react-icons/fa';

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Phone length validation on submit
    if (formData.phone.length < 10 || formData.phone.length > 15) {
      setPhoneError('Phone must be between 10 and 15 digits');
      setLoading(false);
      return;
    } else {
      setPhoneError('');
    }

    if (phoneError) {
      setError('Please fix the phone number');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/customer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <Loginheader />

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
            <h2 className="text-3xl font-bold text-white">Join Us Today</h2>
            <p className="text-blue-200 mt-2">Create your customer account</p>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Customer Registration</h3>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 shadow-sm">
                <p className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4 shadow-sm">
                <p className="flex items-center">
                  <span className="mr-2">✓</span>
                  Account created successfully! Redirecting to login...
                </p>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        className="appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        className="appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      className="appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      className="appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                      <FaHome className="text-gray-400" />
                    </div>
                    <textarea
                      className="appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      id="address"
                      name="address"
                      rows="2"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      className="appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? 
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" /> : 
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      }
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      className="appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? 
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" /> : 
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      }
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all transform hover:-translate-y-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </div>
                    ) : 'Sign Up'}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                      Sign in now
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerSignup;
