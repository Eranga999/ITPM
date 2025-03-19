import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TechnicianSidebar from '../../components/TechnicianSidebar';

const PendingJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    appliance: '',
    issue: '',
    address: '',
    urgency: 'Medium',
    date: '2025-03-16',
  });

  // Replace with the real technician ID from your database
  const technicianId = '670f5a1b2c8d4e9f1a2b3c4d'; // Replace with your actual technician ID

  const fetchPendingJobs = async () => {
    try {
      console.log('Fetching pending jobs');
      const response = await axios.get('http://localhost:5000/api/technician/jobs', {
        params: { technicianId, status: 'Pending' },
      });
      setJobs(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err.response ? err.response.data : err.message);
      setError('Failed to load pending jobs: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      customerName: '',
      appliance: '',
      issue: '',
      address: '',
      urgency: 'Medium',
      date: '2025-03-16',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting new job:', formData);
      const jobData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        technician: technicianId,
      };
      const response = await axios.post('http://localhost:5000/api/technician/jobs', jobData);
      console.log('Add Job Response:', response.data);
      handleCloseModal();
      fetchPendingJobs(); // Refresh the list
    } catch (err) {
      console.error('Add job error:', err.response ? err.response.data : err.message);
      setError('Failed to add job: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStartJob = async (id) => {
    try {
      console.log('Starting job:', id);
      const response = await axios.put(`http://localhost:5000/api/technician/jobs/${id}`, {
        status: 'In Progress',
      });
      console.log('Start Job Response:', response.data);
      fetchPendingJobs(); // Refresh the list
    } catch (err) {
      console.error('Start job error:', err.response ? err.response.data : err.message);
      setError('Failed to start job: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        console.log('Deleting job:', id);
        const response = await axios.delete(`http://localhost:5000/api/technician/jobs/${id}`);
        console.log('Delete Job Response:', response.data);
        fetchPendingJobs(); // Refresh the list
      } catch (err) {
        console.error('Delete error:', err.response ? err.response.data : err.message);
        setError('Failed to delete job: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TechnicianSidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Pending Jobs</h1>
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center"
          >
            <span className="mr-2">+</span> Add New Job
          </button>
        </header>
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <p className="text-gray-600">No pending jobs available.</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{job.appliance}</h3>
                    <p className="text-gray-600 mt-1">Customer: {job.customerName}</p>
                    <p className="text-gray-600 mt-1">Issue: {job.issue}</p>
                    <p className="text-gray-600 mt-1">Address: {job.address}</p>
                    <p className="text-gray-600 mt-1">
                      Date: {new Date(job.date).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                        job.urgency === 'High'
                          ? 'bg-red-100 text-red-700'
                          : job.urgency === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {job.urgency} Priority
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStartJob(job._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Start Job
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
              <form onSubmit={handleAddJob}>
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
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
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

export default PendingJobs;