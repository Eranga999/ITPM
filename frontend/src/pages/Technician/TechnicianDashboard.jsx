// src/pages/Technician/TechnicianDashboard.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TechnicianDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

      {/* Main Content - Dashboard Cards */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Technician Dashboard</h1>
          <Link
            to="/technician-dashboard/pending-jobs"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            + Add New Job
          </Link>
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
      </div>
    </div>
  );
};

export default TechnicianDashboard;