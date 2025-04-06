import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import ovenRepairBg from '../../assets/bookingbackground.jpg';
import axios from 'axios';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = 'Name must be between 2 and 50 characters';
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters, spaces, and hyphens';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{0,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10-15 digits and can only start with an optional "+" followed by numbers';
    } else if (formData.phone.length < 10 || formData.phone.length > 15) {
      newErrors.phone = 'Phone must be between 10 and 15 digits';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 10 || formData.address.length > 200) {
      newErrors.address = 'Address must be between 10 and 200 characters';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select an appliance type';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
        newErrors.preferredDate = 'Date cannot be in the past';
      }
      if (selectedDate > maxDate) {
        newErrors.preferredDate = 'Date cannot be more than 3 months in future';
      }
    }

    if (formData.preferredTime && !['morning', 'afternoon', 'evening'].includes(formData.preferredTime)) {
      newErrors.preferredTime = 'Please select a valid time slot';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleanedValue = value.replace(/[^+\d]/g, '');
      if (cleanedValue.startsWith('+')) {
        const rest = cleanedValue.slice(1);
        if (!/^\d*$/.test(rest)) return;
      } else {
        if (!/^\d*$/.test(cleanedValue)) return;
      }
      if (cleanedValue.length > 15) return;
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors in the form before submitting',
      });
      setTimeout(() => setSubmitStatus(null), 4000);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        setSubmitStatus({
          type: 'error',
          message: 'Please log in to book a service',
        });
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/bookings', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token to headers
        },
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        serviceType: '',
        preferredDate: '',
        preferredTime: '',
        description: '',
      });
      setErrors({});
      setShowSuccessPopup(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      if (error.response?.status === 401 || error.response?.status === 403) {
        setSubmitStatus({
          type: 'error',
          message: 'Session expired. Please log in again.',
        });
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: `Booking failed: ${errorMessage}`,
        });
        setTimeout(() => setSubmitStatus(null), 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    navigate('/customer-dashboard');
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if user is logged in; if not, redirect to login
    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitStatus({
        type: 'error',
        message: 'Please log in to book a service',
      });
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat flex flex-col"
         style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${ovenRepairBg})` }}>
      <Header />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-700 py-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
              Book Your Repair Service
            </h2>
            <p className="mt-2 text-center text-indigo-100">
              Schedule a service with our expert technicians
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white">
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
                submitStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
                'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {submitStatus.type === 'error' ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Eranga-harsha"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Eranga@gmail.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="(+94) 123-4567"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${errors.address ? 'border-red-500' : ''}`}
                    placeholder="colombo, Sri Lanka"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                  Appliance Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${errors.serviceType ? 'border-red-500' : ''}`}
                >
                  <option value="">Select an appliance</option>
                  <option value="refrigerator">Refrigerator</option>
                  <option value="washing-machine">Washing Machine</option>
                  <option value="dryer">Dryer</option>
                  <option value="dishwasher">Dishwasher</option>
                  <option value="oven">Oven</option>
                  <option value="microwave">Microwave</option>
                  <option value="air-conditioner">Air Conditioner</option>
                  <option value="heater">Heater</option>
                  <option value="water-heater">Water Heater</option>
                  <option value="vacuum-cleaner">Vacuum Cleaner</option>
                </select>
                {errors.serviceType && <p className="mt-1 text-sm text-red-500">{errors.serviceType}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={today}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${errors.preferredDate ? 'border-red-500' : ''}`}
                  />
                  {errors.preferredDate && <p className="mt-1 text-sm text-red-500">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                    Preferred Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${errors.preferredTime ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select a time slot</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 7PM)</option>
                  </select>
                  {errors.preferredTime && <p className="mt-1 text-sm text-red-500">{errors.preferredTime}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Problem Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Please describe the issue you're experiencing with your appliance..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Book Service Now'
                  )}
                </button>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                <span className="text-red-500">*</span> Indicates required fields
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl transform transition-all">
            <div className="bg-green-50 p-4 rounded-t-lg border-b border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900">Booking Confirmed!</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Thank you for your booking! Our team will review your request and contact you shortly to confirm the appointment details.
              </p>
              
              <p className="text-sm text-gray-600 mb-6">
                You can track your booking status in the dashboard. A confirmation email has been sent to your email address.
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={handleClosePopup}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookingForm;