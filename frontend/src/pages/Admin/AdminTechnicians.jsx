import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import AdminSidebar from "../../components/AdminSidebar";

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/technicians");
      setTechnicians(response.data.data);
      setFilteredTechnicians(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load technicians: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const validateForm = async () => {
    const errors = {};
    let isValid = true;

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (formData.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    } else if (formData.address.length < 5) {
      errors.address = "Address must be at least 5 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    
    if (!isValid) return;

    try {
      await axios.post("http://localhost:5000/api/admin/technicians", formData);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", address: "" });
      setFormErrors({ firstName: "", lastName: "", email: "", phone: "", address: "" });
      setShowForm(false);
      await fetchTechnicians();
    } catch (err) {
      setError("Failed to add technician: " + (err.response?.data?.message || err.message));
    }
  };

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

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredTechnicians(technicians);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Technicians</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Employee
            </button>
            <div className="text-gray-600 cursor-pointer">👤 Profile</div>
          </div>
        </header>

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
            <div className="space-y-4">
              {["firstName", "lastName", "email", "phone", "address"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors[field] ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors[field] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[field]}</p>
                  )}
                </div>
              ))}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddTechnician}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ firstName: "", lastName: "", email: "", phone: "", address: "" });
                    setFormErrors({ firstName: "", lastName: "", email: "", phone: "", address: "" });
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
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