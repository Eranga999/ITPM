import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const RepairRequests = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Static data for repair requests (replace with API call if needed)
  const repairRequests = [
    {
      customer: "Alice Brown",
      appliance: "Air Conditioner",
      issue: "Not cooling",
      status: "Pending Admin Review",
      serviceCenter: "-",
      dates: "2024-03-15",
    },
    {
      customer: "Bob Wilson",
      appliance: "Refrigerator",
      issue: "Strange noise",
      status: "At Service Center",
      serviceCenter: "Downtown Repair Center",
      dates: "2024-03-14",
    },
  ];

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

      {/* Main Content - Repair Requests Table */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Repair Requests</h1>
          <div className="flex items-center space-x-4">
            {/* Status Filter Dropdown */}
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              defaultValue="All Status"
            >
              <option value="All Status">All Status</option>
              <option value="Pending Admin Review">Pending Admin Review</option>
              <option value="At Service Center">At Service Center</option>
              {/* Add more status options as needed */}
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Export Report
            </button>
            <div className="text-gray-600 cursor-pointer">👤 Profile</div>
          </div>
        </header>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left">Customer</th>
                <th className="py-3 px-6 text-left">Appliance</th>
                <th className="py-3 px-6 text-left">Issue</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Service Center</th>
                <th className="py-3 px-6 text-left">Dates</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {repairRequests.map((request, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{request.customer}</td>
                  <td className="py-4 px-6">{request.appliance}</td>
                  <td className="py-4 px-6">{request.issue}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`${
                        request.status === "Pending Admin Review"
                          ? "text-orange-600"
                          : request.status === "At Service Center"
                          ? "text-blue-600"
                          : "text-gray-600"
                      } font-semibold`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">{request.serviceCenter}</td>
                  <td className="py-4 px-6">{request.dates}</td>
                  <td className="py-4 px-6 flex space-x-2">
                    {request.status === "Pending Admin Review" ? (
                      <button className="text-blue-600 hover:underline">
                        Send to Center
                      </button>
                    ) : (
                      <button className="text-blue-600 hover:underline">
                        View Details
                      </button>
                    )}
                    <button className="text-red-600 hover:underline">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RepairRequests;