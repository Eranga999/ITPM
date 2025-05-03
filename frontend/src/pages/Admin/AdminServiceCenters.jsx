import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import debounce from "lodash/debounce";
import AdminSidebar from "../../components/AdminSidebar";

// Validation schema using yup
const serviceCenterSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters")
    .matches(/^[A-Za-z0-9\s]+$/, "Name can only contain letters, numbers, and spaces"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +1234567890)")
    .max(15, "Phone number cannot exceed 15 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),
  services: yup
    .array()
    .min(1, "At least one service must be selected")
    .required("Services are required"),
});

const ServiceCenters = () => {
  const [centers, setCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const serviceOptions = ["AC", "Refrigerator", "TV", "Washing Machine", "Microwave"];

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(serviceCenterSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      services: [],
    },
  });

  const fetchServiceCenters = async () => {
    try {
      console.log("Fetching service centers from API");
      const response = await axios.get("http://localhost:5000/api/admin/service-centers");
      console.log("API Response:", response.data);
      setCenters(response.data.data);
      setFilteredCenters(response.data.data); // Initialize filtered list
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response ? err.response.data : err.message);
      setError("Failed to load service centers: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleAddOrUpdateServiceCenter = async (data) => {
    try {
      if (editId) {
        // Update existing service center
        console.log("Updating service center:", data);
        const response = await axios.put(`http://localhost:5000/api/admin/service-centers/${editId}`, data);
        console.log("Update Service Center Response:", response.data);
      } else {
        // Add new service center
        console.log("Adding service center:", data);
        const response = await axios.post("http://localhost:5000/api/admin/service-centers", data);
        console.log("Add Service Center Response:", response.data);
      }
      reset(); // Reset form after successful submission
      setEditId(null);
      setShowForm(false);
      await fetchServiceCenters(); // Refresh the list
    } catch (err) {
      console.error("Service center error:", err.response ? err.response.data : err.message);
      setError("Failed to save service center: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditServiceCenter = (center) => {
    setValue("name", center.name);
    setValue("address", center.address);
    setValue("phone", center.phone);
    setValue("email", center.email);
    setValue("services", center.services);
    setEditId(center._id);
    setShowForm(true);
  };

  const handleDeleteServiceCenter = async (id) => {
    if (window.confirm("Are you sure you want to delete this service center?")) {
      try {
        console.log("Deleting service center:", id);
        const response = await axios.delete(`http://localhost:5000/api/admin/service-centers/${id}`);
        console.log("Delete Service Center Response:", response.data);
        await fetchServiceCenters(); // Refresh the list
      } catch (err) {
        console.error("Delete error:", err.response ? err.response.data : err.message);
        setError("Failed to delete service center: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Debounced search function
  const handleSearch = useMemo(
    () =>
      debounce((query) => {
        const lowerQuery = query.toLowerCase();
        const filtered = centers.filter(
          (center) =>
            center.name.toLowerCase().includes(lowerQuery) ||
            center.address.toLowerCase().includes(lowerQuery) ||
            center.phone.toLowerCase().includes(lowerQuery) ||
            center.email.toLowerCase().includes(lowerQuery) ||
            center.services.join(", ").toLowerCase().includes(lowerQuery)
        );
        setFilteredCenters(filtered);
      }, 300),
    [centers]
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
    setFilteredCenters(centers);
  };

  useEffect(() => {
    fetchServiceCenters();
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
          <h1 className="text-3xl font-bold text-gray-800">Service Centers</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                reset();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add New Service Center
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
              placeholder="Search service centers by name, address, phone, email, or services..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search service centers"
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
            <h2 className="text-xl font-bold mb-4">{editId ? "Edit Service Center" : "Add New Service Center"}</h2>
            <form onSubmit={handleSubmit(handleAddOrUpdateServiceCenter)} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <span
                    className="absolute right-2 top-9 text-red-400 text-sm opacity-70 italic pointer-events-none"
                    aria-hidden="true"
                  >
                    {errors.name.message}
                  </span>
                )}
                {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
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
                {errors.address && <p id="address-error" className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
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
                {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
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
                {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Services</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {serviceOptions.map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        value={service}
                        {...register("services")}
                        className={`mr-2 ${errors.services ? "border-red-500" : ""}`}
                      />
                      {service}
                    </label>
                  ))}
                </div>
                {errors.services && <p id="services-error" className="mt-1 text-sm text-red-600">{errors.services.message}</p>}
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editId ? "Update Service Center" : "Add Service Center"}
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
          {filteredCenters.length === 0 && searchQuery && (
            <div className="p-4 text-center text-gray-600">
              No service centers found matching "{searchQuery}".
            </div>
          )}
          {filteredCenters.length > 0 && (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Address</th>
                  <th className="py-3 px-6 text-left">Phone</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Services</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCenters.map((center) => (
                  <tr key={center._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">{center.name}</td>
                    <td className="py-4 px-6">{center.address}</td>
                    <td className="py-4 px-6">{center.phone}</td>
                    <td className="py-4 px-6">{center.email}</td>
                    <td className="py-4 px-6">{center.services.join(", ")}</td>
                    <td className="py-4 px-6 flex space-x-2">
                      <button
                        onClick={() => handleEditServiceCenter(center)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteServiceCenter(center._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
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

export default ServiceCenters;