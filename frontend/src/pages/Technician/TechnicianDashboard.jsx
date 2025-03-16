// src/pages/Technician/TechnicianDashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar'; // Assuming Sidebar is now working

const TechnicianDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    appliance: '',
    issue: '',
    address: '',
    urgency: 'Medium', // Default value for the dropdown
    date: '16/03/2025', // Default date as shown in the image
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form data when closing the modal
    setFormData({
      customerName: '',
      appliance: '',
      issue: '',
      address: '',
      urgency: 'Medium',
      date: '16/03/2025',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, log the form data to the console
    console.log('New Job Data:', formData);
    // Here you can add logic to save the job (e.g., API call)
    handleCloseModal(); // Close the modal after submission
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Dashboard Cards */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Technician Dashboard</h1>
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center"
          >
            <span className="mr-2">+</span> Add New Job
          </button>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl mb-2">⏰</span>
            <h3 className="text-lg font-semibold text-gray-700">Pending Jobs</h3>
            <p className="text-3xl font-bold text-gray-900">1</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl mb-2">🔧</span>
            <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
            <p className="text-3xl font-bold text-gray-900">1</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl mb-2">✅</span>
            <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl mb-2">⚠️</span>
            <h3 className="text-lg font-semibold text-red-700">Urgent</h3>
            <p className="text-3xl font-bold text-red-900">1</p>
          </div>
        </div>

        {/* Modal for Adding New Job */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
              <form onSubmit={handleSubmit}>
                {/* Customer Name */}
                <div className="mb-4">
                  <label htmlFor="customerName" className="block text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Customer Name"
                    required
                  />
                </div>

                {/* Appliance */}
                <div className="mb-4">
                  <label htmlFor="appliance" className="block text-gray-700 mb-1">
                    Appliance
                  </label>
                  <input
                    type="text"
                    id="appliance"
                    name="appliance"
                    value={formData.appliance}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Appliance"
                    required
                  />
                </div>

                {/* Issue */}
                <div className="mb-4">
                  <label htmlFor="issue" className="block text-gray-700 mb-1">
                    Issue
                  </label>
                  <input
                    type="text"
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Issue"
                    required
                  />
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label htmlFor="address" className="block text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Address"
                    required
                  />
                </div>

                {/* Urgency */}
                <div className="mb-4">
                  <label htmlFor="urgency" className="block text-gray-700 mb-1">
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label htmlFor="date" className="block text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Date"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Add Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianDashboard;