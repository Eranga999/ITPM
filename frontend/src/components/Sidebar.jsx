// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

console.log('Sidebar loaded'); // Debug log
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
      <div>
        <div className="logo mb-8">
          <h1 className="text-2xl font-bold text-blue-600">EasyFix</h1>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/technician-dashboard/dashboard"
                className={`flex items-center p-2 rounded-md ${
                  location.pathname === "/technician-dashboard/dashboard"
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
  );
};

export default Sidebar;