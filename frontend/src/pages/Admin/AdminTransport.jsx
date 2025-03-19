import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Transport = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Static data for transport items (replace with API call if needed)
  const transportData = [
    {
      item: "Washing Machine",
      customer: "Emma Davis",
      pickup: "123 Oak Street",
      dropoff: "Downtown Repair Center",
      status: "In Transit",
      date: "2024-03-18",
      time: "10:00 AM - 12:00 PM",
    },
    {
      item: "Refrigerator",
      customer: "Mike Wilson",
      pickup: "Downtown Repair Center",
      dropoff: "456 Pine Avenue",
      status: "Scheduled",
      date: "2024-03-19",
      time: "2:00 PM - 4:00 PM",
    },
    {
      item: "Air Conditioner",
      customer: "Sarah Johnson",
      pickup: "789 Maple Lane",
      dropoff: "East Side Electronics",
      status: "Delivered",
      date: "2024-03-17",
      time: "9:00 AM - 11:00 AM",
    },
  ];

  // State for active tab
  const [activeTab, setActiveTab] = useState("Scheduled");

  // Filter transport items based on active tab
  const filteredTransport = transportData.filter(
    (item) => item.status === activeTab || activeTab === "All"
  );

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

      {/* Main Content - Transport Management */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Transport Management</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Schedule Transport
            </button>
            <div className="text-gray-600 cursor-pointer">👤 Profile</div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "Scheduled"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("Scheduled")}
          >
            Scheduled <span className="ml-1 bg-yellow-400 text-black px-2 rounded-full">5</span>
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "In Transit"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("In Transit")}
          >
            In Transit <span className="ml-1 bg-blue-400 text-white px-2 rounded-full">3</span>
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "Delivered"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("Delivered")}
          >
            Delivered <span className="ml-1 bg-green-400 text-white px-2 rounded-full">12</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left">Item</th>
                <th className="py-3 px-6 text-left">Customer</th>
                <th className="py-3 px-6 text-left">Pickup</th>
                <th className="py-3 px-6 text-left">Dropoff</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransport.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{item.item}</td>
                  <td className="py-4 px-6">{item.customer}</td>
                  <td className="py-4 px-6">{item.pickup}</td>
                  <td className="py-4 px-6">{item.dropoff}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-white font-semibold ${
                        item.status === "Scheduled"
                          ? "bg-yellow-400"
                          : item.status === "In Transit"
                          ? "bg-blue-400"
                          : "bg-green-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">{item.date}</td>
                  <td className="py-4 px-6">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transport;