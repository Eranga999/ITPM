import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ServiceCenters = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Static data for service centers (replace with API call if needed)
  const serviceCenters = [
    {
      name: "Downtown Repair Center",
      address: "123 Main St",
      specializations: ["AC", "Refrigerator", "Washing Machine"],
      status: "Active",
    },
    {
      name: "East Side Electronics",
      address: "456 East Ave",
      specializations: ["TV", "Microwave", "Small Appliances"],
      status: "Active",
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

      {/* Main Content - Service Centers Table */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Service Centers</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add Service Center
            </button>
            <div className="text-gray-600 cursor-pointer">👤 Profile</div>
          </div>
        </header>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Specializations</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceCenters.map((center, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{center.name}</td>
                  <td className="py-4 px-6">{center.address}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      {center.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`${
                        center.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {center.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">
                      {center.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
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

export default ServiceCenters;