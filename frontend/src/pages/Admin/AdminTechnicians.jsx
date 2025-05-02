import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import debounce from "lodash/debounce";
import AdminSidebar from "../../components/AdminSidebar";

// Validation schema using yup
const technicianSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .matches(/^[A-Za-z\s]+$/, "First name can only contain letters and spaces"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters and spaces"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +1234567890)")
    .max(15, "Phone number cannot exceed 15 characters"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
});

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(technicianSchema),
  });

  const fetchTechnicians = async () => {
    try {
      console.log("Fetching technicians from API");
      const response = await axios.get("http://localhost:5000/api/admin/technicians");
      console.log("API Response:", response.data);
      setTechnicians(response.data.data);
      setFilteredTechnicians(response.data.data); // Initialize filtered list
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response ? err.response.data : err.message);
      setError("Failed to load technicians: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleAddTechnician = async (data) => {
    try {
      console.log("Adding technician:", data);
      const response = await axios.post("http://localhost:5000/api/admin/technicians", data);
      console.log("Add Technician Response:", response.data);
      reset(); // Reset form after successful submission
      setShowForm(false);
      await fetchTechnicians(); // Refresh the list
    } catch (err) {
      console.error("Add technician error:", err.response ? err.response.data : err.message);
      setError("Failed to add technician: " + (err.response?.data?.message || err.message));
    }
  };

  // Debounced search function
  const handleSearch = useMemo(
    () =>
      debounce((query) => {
        const lowerQuery = query.toLowerCase();
        const filtered = technicians.filter(
          (tech) =>
            tech.firstName.toLowerCase().includes(lowerQuery) ||
            tech.lastName.toLowerCase().includes(lowerQuery) ||
            tech.email.toLowerCase().includes(lowerQuery) ||
            tech.phone.toLowerCase().includes(lowerQuery) ||
            tech.address.toLowerCase().includes(lowerQuery)
        );
        setFilteredTechnicians(filtered);
      }, 300),
    [technicians]
  );

  // Update search query and trigger search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredTechnicians(technicians);
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  // Cleanup debounce on component unmount
  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search technicians by name, email, phone, or address..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search technicians"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form onSubmit={handleSubmit(handleAddTechnician)} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  {...register("firstName")}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <span
                    className="absolute right-2 top-9 text-red-400 text-sm opacity-70 italic pointer-events-none"
                    aria-hidden="true"
                  >
                    {errors.firstName.message}
                  </span>
                )}
                {errors.firstName && (
                  <p id="firstName-error" className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  {...register("lastName")}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  aria-invalid={errors.lastName ? "true" : "false"}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <span
                    className="absolute right-2 top-9 text-red-400 text-sm opacity-70 italic pointer-events-none"
                    aria-hidden="true"
                  >
                    {errors.lastName.message}
                  </span>
                )}
                {errors.lastName && (
                  <p id="lastName-error" className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <span
                    className="absolute right-2 top-9 text-red-400 text-sm opacity-70 italic pointer-events-none"
                    aria-hidden="true"
                  >
                    {errors.email.message}
                  </span>
                )}
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  {...register("phone")}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <span
                    className="absolute right-2 top-9 text-red-400 text-sm opacity-70 italic pointer-events-none"
                    aria-hidden="true"
                  >
                    {errors.phone.message}
                  </span>
                )}
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  {...register("address")}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10 ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  aria-invalid={errors.address ? "true" : "false"}
                  aria-describedby={errors.address ? "address-error" : undefined}
                />
                {errors.address && (
                  <span
                    className="absolute right-2 top-9 text-red-400 text-sm opacity-70 italic pointer-events-none"
                    aria-hidden="true"
                  >
                    {errors.address.message}
                  </span>
                )}
                {errors.address && (
                  <p id="address-error" className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
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
                    reset();
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {filteredTechnicians.length === 0 && searchQuery && (
            <div className="p-4 text-center text-gray-600">
              No technicians found matching "{searchQuery}".
            </div>
          )}
          {filteredTechnicians.length > 0 && (
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
                {filteredTechnicians.map((tech) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Technicians;