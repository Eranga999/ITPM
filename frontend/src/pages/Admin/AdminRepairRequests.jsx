import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const RepairRequests = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const [repairRequests, setRepairRequests] = useState([]);
  const [error, setError] = useState(null);

  const handleAddTestBooking = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/api/add-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to add test booking");
      const newBooking = await response.json();
      setRepairRequests((prev) => [
        ...prev,
        {
          _id: newBooking._id,
          customer: newBooking.name,
          appliance: newBooking.serviceType,
          issue: newBooking.description || "No description provided",
          status:
            newBooking.status === "pending"
              ? "Pending Admin Review"
              : newBooking.status === "confirmed"
              ? "At Service Center"
              : newBooking.status,
          serviceCenter: newBooking.technicianAssigned ? "Assigned" : "-",
          dates: new Date(newBooking.preferredDate).toISOString().split("T")[0],
        },
      ]);
      console.log("Test booking added:", newBooking);
    } catch (err) {
      console.error("Error adding test booking:", err.message);
      setError(err.message);
    }
  };

  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

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
            <button
              onClick={handleAddTestBooking}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Test Booking
            </button>
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
              {repairRequests.map((request) => (
                <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
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
                      <button className="text-blue-600 hover:underline">Send to Center</button>
                    ) : (
                      <button className="text-blue-600 hover:underline">View Details</button>
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