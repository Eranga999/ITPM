import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar"; // Adjust path as needed

const ServiceCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    services: [],
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const serviceOptions = ["AC", "Refrigerator", "TV", "Washing Machine", "Microwave"];

  const fetchServiceCenters = async () => {
    try {
      console.log("Fetching service centers from API");
      const response = await axios.get("http://localhost:5000/api/admin/service-centers");
      console.log("API Response:", response.data);
      setCenters(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response ? err.response.data : err.message);
      setError("Failed to load service centers: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleCenterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCenter((prev) => {
        const services = checked
          ? [...prev.services, value]
          : prev.services.filter((service) => service !== value);
        return { ...prev, services };
      });
    } else {
      setCenter({ ...center, [name]: value });
    }
  };

  const handleAddOrUpdateServiceCenter = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing service center
        console.log("Updating service center:", center);
        const response = await axios.put(`http://localhost:5000/api/admin/service-centers/${editId}`, center);
        console.log("Update Service Center Response:", response.data);
      } else {
        // Add new service center
        console.log("Adding service center:", center);
        const response = await axios.post("http://localhost:5000/api/admin/service-centers", center);
        console.log("Add Service Center Response:", response.data);
      }
      setCenter({ name: "", address: "", phone: "", email: "", services: [] });
      setEditId(null);
      setShowForm(false);
      await fetchServiceCenters(); // Refresh the list
    } catch (err) {
      console.error("Service center error:", err.response ? err.response.data : err.message);
      setError("Failed to save service center: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditServiceCenter = (center) => {
    setCenter({
      name: center.name,
      address: center.address,
      phone: center.phone,
      email: center.email,
      services: center.services,
    });
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

  useEffect(() => {
    fetchServiceCenters();
  }, []);

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
                setCenter({ name: "", address: "", phone: "", email: "", services: [] });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add New Service Center
            </button>
            <div className="text-gray-600 cursor-pointer">👤 Profile</div>
          </div>
        </header>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">{editId ? "Edit Service Center" : "Add New Service Center"}</h2>
            <form onSubmit={handleAddOrUpdateServiceCenter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={center.name}
                  onChange={handleCenterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={center.address}
                  onChange={handleCenterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={center.phone}
                  onChange={handleCenterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={center.email}
                  onChange={handleCenterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Services</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {serviceOptions.map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        name="services"
                        value={service}
                        checked={center.services.includes(service)}
                        onChange={handleCenterChange}
                        className="mr-2"
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editId ? "Update Service Center" : "Add Service Center"}
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
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Services</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => (
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
        </div>
      </div>
    </div>
  );
};

export default ServiceCenters;