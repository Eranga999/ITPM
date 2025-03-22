import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

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
  const [errors, setErrors] = useState({}); // Added for validation errors

  // Validation rules
  const validateForm = () => {
    let tempErrors = {};
    
    // First Name validation
    if (!technician.firstName.trim()) {
      tempErrors.firstName = "First name is required";
    } else if (technician.firstName.length < 2) {
      tempErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!technician.lastName.trim()) {
      tempErrors.lastName = "Last name is required";
    } else if (technician.lastName.length < 2) {
      tempErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!technician.email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(technician.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!technician.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(technician.phone)) {
      tempErrors.phone = "Please enter a valid phone number (minimum 10 digits)";
    }

    // Address validation
    if (!technician.address.trim()) {
      tempErrors.address = "Address is required";
    } else if (technician.address.length < 5) {
      tempErrors.address = "Address must be at least 5 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

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
    const { name, value } = e.target;
    setTechnician({ ...technician, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log("Adding technician:", technician);
      const response = await axios.post("http://localhost:5000/api/admin/technicians", technician);
      console.log("Add Technician Response:", response.data);
      setTechnician({ firstName: "", lastName: "", email: "", phone: "", address: "" });
      setShowForm(false);
      setErrors({});
      await fetchTechnicians();
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
      <AdminSidebar />
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
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={technician.lastName}
                  onChange={handleTechnicianChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={technician.email}
                  onChange={handleTechnicianChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={technician.phone}
                  onChange={handleTechnicianChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={technician.address}
                  onChange={handleTechnicianChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                    setTechnician({ firstName: "", lastName: "", email: "", phone: "", address: "" });
                  }}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
              </div>
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