import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Inlined Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <div className="logo mb-8">
            <h1 className="text-2xl font-bold text-blue-600">RepairAdmin</h1>
          </div>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/admin-dashboard"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">📊</span> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/service-centers"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/service-centers"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">🏢</span> Service Centers
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/technicians"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/technicians"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">👨‍🔧</span> Technicians
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/repair-requests"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/repair-requests"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">🛠️</span> Repair Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/transport"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/transport"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">🚚</span> Transport
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/payments"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/payments"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">💰</span> Payments
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
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl mb-2">🛠️</span>
            <h3 className="text-lg font-semibold text-gray-700">Total Technicians</h3>
            <p className="text-3xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl mb-2">📝</span>
            <h3 className="text-lg font-semibold text-orange-700">Pending Reviews</h3>
            <p className="text-3xl font-bold text-orange-900">8</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl mb-2">🏢</span>
            <h3 className="text-lg font-semibold text-blue-700">At Service Centers</h3>
            <p className="text-3xl font-bold text-blue-900">15</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-2xl mb-2">✅</span>
            <h3 className="text-lg font-semibold text-green-700">Completed Today</h3>
            <p className="text-3xl font-bold text-green-900">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;