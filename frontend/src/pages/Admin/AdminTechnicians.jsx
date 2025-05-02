import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar"; // Correct import

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [technician, setTechnician] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [showForm, setShowForm] = useState(false);

  const fetchTechnicians = async () => {
    try {
      console.log("Fetching technicians from API");
      const response = await axios.get("http://localhost:5000/api/admin/technicians");
      console.log("API Response:", response.data);
      setTechnicians(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response ? err.response.data : err.message);
      setError("Failed to load technicians: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleTechnicianChange = (e) => {
    setTechnician({ ...technician, [e.target.name]: e.target.value });
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    try {
      console.log("Adding technician:", technician);
      const response = await axios.post("http://localhost:5000/api/admin/technicians", technician);
      console.log("Add Technician Response:", response.data);
      setTechnician({ firstName: "", lastName: "", email: "", phone: "", address: "" });
      setShowForm(false);
      await fetchTechnicians(); // Refresh the list
    } catch (err) {
      console.error("Add technician error:", err.response ? err.response.data : err.message);
      setError("Failed to add technician: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar /> {/* Changed from <Sidebar /> to <AdminSidebar /> */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Technicians</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add New Employee
            </button>
            <div className="text-gray-600 cursor-pointer">👤 Profile</div>
          </div>
        </header>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form onSubmit={handleAddTechnician} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={technician.firstName}
                  onChange={handleTechnicianChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={technician.lastName}
                  onChange={handleTechnicianChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={technician.email}
                  onChange={handleTechnicianChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={technician.phone}
                  onChange={handleTechnicianChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={technician.address}
                  onChange={handleTechnicianChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Employee
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="ml-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left">First Name</th>
                <th className="py-3 px-6 text-left">Last Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((tech) => (
                <tr key={tech._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{tech.firstName}</td>
                  <td className="py-4 px-6">{tech.lastName}</td>
                  <td className="py-4 px-6">{tech.email}</td>
                  <td className="py-4 px-6">{tech.phone}</td>
                  <td className="py-4 px-6">{tech.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Technicians;