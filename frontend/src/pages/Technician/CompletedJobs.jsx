import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TechnicianSidebar from '../../components/TechnicianSidebar';

const CompletedJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with the real technician ID from your database
  const technicianId = '670f5a1b2c8d4e9f1a2b3c4d'; // Replace with your actual technician ID

  const fetchCompletedJobs = async () => {
    try {
      console.log('Fetching completed jobs');
      const response = await axios.get('http://localhost:5000/api/technician/jobs', {
        params: { technicianId, status: 'Completed' },
      });
      setJobs(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err.response ? err.response.data : err.message);
      setError('Failed to load completed jobs: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        console.log('Deleting job:', id);
        const response = await axios.delete(`http://localhost:5000/api/technician/jobs/${id}`);
        console.log('Delete Job Response:', response.data);
        fetchCompletedJobs(); // Refresh the list
      } catch (err) {
        console.error('Delete error:', err.response ? err.response.data : err.message);
        setError('Failed to delete job: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TechnicianSidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Completed Jobs</h1>
        </header>
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <p className="text-gray-600">No completed jobs available.</p>
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
      </div>
    </div>
  );
};

export default CompletedJobs;