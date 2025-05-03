import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h1 className="text-3xl font-extrabold text-blue-300 tracking-tight">RepairAdmin</h1>
          </div>
          <nav className="mt-6">
            <ul className="space-y-3 px-3">
              <li>
                <Link
                  to="/admin-dashboard"
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    location.pathname === "/admin-dashboard"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-200 hover:bg-blue-700 hover:text-white hover:shadow-md"
                  }`}
                >
                  <span className="mr-3 text-lg">📊</span> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/service-centers"
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    location.pathname === "/admin-dashboard/service-centers"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-200 hover:bg-blue-700 hover:text-white hover:shadow-md"
                  }`}
                >
                  <span className="mr-3 text-lg">🏢</span> Service Centers
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/technicians"
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    location.pathname === "/admin-dashboard/technicians"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-200 hover:bg-blue-700 hover:text-white hover:shadow-md"
                  }`}
                >
                  <span className="mr-3 text-lg">👨‍🔧</span> Technicians
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/repair-requests"
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    location.pathname === "/admin-dashboard/repair-requests"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-200 hover:bg-blue-700 hover:text-white hover:shadow-md"
                  }`}
                >
                  <span className="mr-3 text-lg">🛠️</span> Repair Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/transport"
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    location.pathname === "/admin-dashboard/transport"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-200 hover:bg-blue-700 hover:text-white hover:shadow-md"
                  }`}
                >
                  <span className="mr-3 text-lg">🚚</span> Transport
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/payments"
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    location.pathname === "/admin-dashboard/payments"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-200 hover:bg-blue-700 hover:text-white hover:shadow-md"
                  }`}
                >
                  <span className="mr-3 text-lg">💰</span> Payments
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div
          className="p-4 mx-3 mb-4 flex items-center text-blue-200 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 cursor-pointer shadow-md"
          onClick={handleLogout}
        >
          <span className="mr-3 text-lg">←</span> Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <span className="text-4xl mb-4 text-gray-700">🛠️</span>
            <h3 className="text-xl font-semibold text-gray-700">Total Technicians</h3>
            <p className="text-5xl font-bold text-gray-900 mt-3">24</p>
          </div>
          <div className="bg-orange-100 p-6 rounded-2xl shadow-xl flex flex-col items-center transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <span className="text-4xl mb-4 text-orange-600">📝</span>
            <h3 className="text-xl font-semibold text-orange-700">Pending Reviews</h3>
            <p className="text-5xl font-bold text-orange-900 mt-3">8</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <span className="text-4xl mb-4 text-blue-600">🏢</span>
            <h3 className="text-xl font-semibold text-blue-700">At Service Centers</h3>
            <p className="text-5xl font-bold text-blue-900 mt-3">15</p>
          </div>
          <div className="bg-green-100 p-6 rounded-2xl shadow-xl flex flex-col items-center transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <span className="text-4xl mb-4 text-green-600">✅</span>
            <h3 className="text-xl font-semibold text-green-700">Completed Today</h3>
            <p className="text-5xl font-bold text-green-900 mt-3">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;