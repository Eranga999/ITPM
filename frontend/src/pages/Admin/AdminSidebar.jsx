import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
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
  );
};

export default AdminSidebar; // Ensure this line is present and correct