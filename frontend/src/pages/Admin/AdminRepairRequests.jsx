import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RepairRequests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [repairRequests, setRepairRequests] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState({});
  const [selectedTechnician, setSelectedTechnician] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repairResponse, centersResponse, techniciansResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/repair-requests"),
          axios.get("http://localhost:5000/api/admin/service-centers"),
          axios.get("http://localhost:5000/api/admin/technicians"),
        ]);
        setRepairRequests(repairResponse.data.data);
        setServiceCenters(centersResponse.data.data);
        setTechnicians(techniciansResponse.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSendToCenter = async (id) => {
    const centerId = selectedCenter[id];
    const technicianId = selectedTechnician[id];

    if (!centerId) {
      alert("Please select a service center");
      return;
    }

    try {
      // Assign service center
      await axios.put(`http://localhost:5000/api/admin/repair-requests/${id}/assign-service-center`, {
        serviceCenterId: centerId,
      });

      // Assign technician (if selected)
      if (technicianId) {
        await axios.put(`http://localhost:5000/api/admin/repair-requests/${id}`, {
          technicianAssigned: technicianId,
          status: "confirmed",
        });
      }

      // Update local state
      setRepairRequests((prev) =>
        prev.map((request) =>
          request._id === id
            ? {
                ...request,
                status: "confirmed",
                serviceCenter: serviceCenters.find((center) => center._id === centerId),
                technicianAssigned: technicianId
                  ? technicians.find((tech) => tech._id === technicianId)
                  : request.technicianAssigned,
              }
            : request
        )
      );
      alert("Request updated successfully");
    } catch (err) {
      console.error("Error updating request:", err);
      alert("Failed to update request");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
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

      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Repair Requests</h1>
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              defaultValue="All Status"
            >
              <option value="All Status">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Export Report
            </button>
            <div className="text-gray-600 cursor-pointer">👤 Profile</div>
          </div>
        </header>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left">Customer</th>
                <th className="py-3 px-6 text-left">Appliance</th>
                <th className="py-3 px-6 text-left">Issue</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Technician</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Service Center</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {repairRequests.map((request) => (
                <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{request.name}</td>
                  <td className="py-4 px-6">{request.serviceType}</td>
                  <td className="py-4 px-6">{request.description || "-"}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-semibold ${
                        request.status === "pending"
                          ? "text-orange-600"
                          : request.status === "confirmed"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {request.technicianAssigned && request.technicianAssigned.firstName ? (
                      `${request.technicianAssigned.firstName} ${request.technicianAssigned.lastName}`
                    ) : request.technicianAssigned ? (
                      technicians.find((tech) => tech._id === request.technicianAssigned)?.firstName
                        ? `${
                            technicians.find((tech) => tech._id === request.technicianAssigned).firstName
                          } ${
                            technicians.find((tech) => tech._id === request.technicianAssigned).lastName
                          }`
                        : "-"
                    ) : request.status === "pending" ? (
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={selectedTechnician[request._id] || ""}
                        onChange={(e) =>
                          setSelectedTechnician({
                            ...selectedTechnician,
                            [request._id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Technician</option>
                        {technicians.map((tech) => (
                          <option key={tech._id} value={tech._id}>
                            {tech.firstName} {tech.lastName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-4 px-6">{new Date(request.preferredDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    {request.serviceCenter && request.serviceCenter.name ? (
                      request.serviceCenter.name
                    ) : request.serviceCenter ? (
                      serviceCenters.find((center) => center._id === request.serviceCenter)?.name || "-"
                    ) : request.status === "pending" ? (
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={selectedCenter[request._id] || ""}
                        onChange={(e) =>
                          setSelectedCenter({
                            ...selectedCenter,
                            [request._id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Center</option>
                        {serviceCenters.map((center) => (
                          <option key={center._id} value={center._id}>
                            {center.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-4 px-6 flex space-x-2">
                    {request.status === "pending" ? (
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleSendToCenter(request._id)}
                      >
                        Send to Center
                      </button>
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