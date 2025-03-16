// src/pages/Technician/PendingJobs.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PendingJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const jobs = [
    {
      type: "Refrigerator",
      customer: "John Doe",
      issue: "Not cooling properly",
      address: "123 Main St",
      date: "2024-03-15",
      priority: "High Priority",
    },
    {
      type: "Washing Machine",
      customer: "Jane Smith",
      issue: "Leaking water",
      address: "456 Oak Ave",
      date: "2024-03-16",
      priority: "Medium Priority",
    },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <div className="logo mb-8">
            <h1 className="text-2xl font-bold text-blue-600">EasyFix</h1>
          </div>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/technician-dashboard"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/technician-dashboard"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">🏠</span> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/technician-dashboard/pending-jobs"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/technician-dashboard/pending-jobs"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">⏰</span> Pending Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/technician-dashboard/completed-jobs"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/technician-dashboard/completed-jobs"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">✅</span> Completed Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/technician-dashboard/urgent-repairs"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/technician-dashboard/urgent-repairs"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">⚠️</span> Urgent Repairs
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div
          className="logout flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={handleLogout}
        >
          <span className="mr-2">←</span> Logout
        </div>
      </div>

      {/* Main Content - Pending Jobs */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Pending Jobs</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center">
            <span className="mr-2">+</span> Add New Job
          </button>
        </header>
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <p className="text-gray-600">No pending jobs available.</p>
          ) : (
            jobs.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{job.type}</h3>
                    <p className="text-gray-600 mt-1">Customer: {job.customer}</p>
                    <p className="text-gray-600 mt-1">Issue: {job.issue}</p>
                    <p className="text-gray-600 mt-1">Address: {job.address}</p>
                    <p className="text-gray-600 mt-1">Date: {job.date}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                        job.priority === "High Priority"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {job.priority}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                      Start Job
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
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

export default PendingJobs;