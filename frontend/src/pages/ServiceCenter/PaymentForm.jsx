import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock } from 'react-icons/fa';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    amount: '',
  });

  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    amount: '',
  });

  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      cardholderName: '',
      amount: '',
    };
    let isValid = true;

    // Amount validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
      isValid = false;
    }

    // Card Number validation
    const cleanedCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      isValid = false;
    }

    // Expiry Date validation
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
      isValid = false;
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const expiryDate = new Date(`20${year}`, month - 1);
      if (expiryDate <= currentDate) {
        newErrors.expiryDate = 'Card has expired';
        isValid = false;
      }
    }

    // CVC validation
    if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC must be 3 or 4 digits';
      isValid = false;
    }

    // Cardholder Name validation
    if (!formData.cardholderName || !/^[a-zA-Z\s]+$/.test(formData.cardholderName)) {
      newErrors.cardholderName = 'Enter a valid name';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payment = {
        id: Date.now().toString(),
        cardholderName: formData.cardholderName,
        amount: parseFloat(formData.amount).toFixed(2),
        date: new Date().toISOString(),
      };
      // Save to local storage for notifications
      const existingPayments = JSON.parse(localStorage.getItem('confirmedPayments') || '[]');
      localStorage.setItem('confirmedPayments', JSON.stringify([...existingPayments, payment]));
      
      // Show success notification
      setNotification('Payment submitted successfully!');
      
      // Clear form
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardholderName: '',
        amount: '',
      });

      // Redirect to CustomerDashboard after 2 seconds
      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaCreditCard className="mr-2 text-blue-600" /> Payment Details
        </h2>
        {notification && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
          </div>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength="5"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                CVC
              </label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                value={formData.cvc}
                onChange={handleChange}
                placeholder="123"
                maxLength="4"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.cvc ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.cvc && <p className="mt-1 text-sm text-red-500">{errors.cvc}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleChange}
              placeholder="John Doe"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.cardholderName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {errors.cardholderName && <p className="mt-1 text-sm text-red-500">{errors.cardholderName}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
          >
            <FaLock className="mr-2" /> Submit Payment
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Your payment information is secure and encrypted.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;