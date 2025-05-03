import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Wrench,
  Building2,
  ChevronDown,
  X,
  DollarSign,
  FileText,
  Truck,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ServiceCenterDashboard = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [transportCost, setTransportCost] = useState("");
  const [sparePartsCost, setSparePartsCost] = useState("");
  const [technicianCost, setTechnicianCost] = useState("");
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [confirmedPayments, setConfirmedPayments] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/service-centers");
        const centers = response.data.data;
        setServiceCenters(centers);
        if (centers.length > 0 && !id) {
          setSelectedCenterId(centers[0]._id);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load service centers");
        setLoading(false);
      }
    };
    fetchServiceCenters();
  }, [id]);

  useEffect(() => {
    const fetchBookings = async () => {
      const serviceCenterId = id || selectedCenterId;
      if (!serviceCenterId) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/service-centers/${serviceCenterId}/bookings`
        );
        setBookings(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load bookings");
        setLoading(false);
      }
    };
    fetchBookings();
  }, [id, selectedCenterId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Load confirmed payments from local storage
    const payments = JSON.parse(localStorage.getItem("confirmedPayments") || "[]");
    setConfirmedPayments(payments);
  }, []);

  const totalBookings = useMemo(() => bookings.length, [bookings]);
  const assignedBookings = useMemo(
    () => bookings.filter((b) => b.status === "assigned").length,
    [bookings]
  );

  const totalCost = useMemo(() => {
    const transport = parseFloat(transportCost) || 0;
    const spareParts = parseFloat(sparePartsCost) || 0;
    const technician = parseFloat(technicianCost) || 0;
    return (transport + spareParts + technician).toFixed(2);
  }, [transportCost, sparePartsCost, technicianCost]);

  const selectedCenter = serviceCenters.find(
    (center) => center._id === selectedCenterId
  );

  const openPaymentSummaryModal = () => {
    setSelectedBookingId("");
    setTransportCost("");
    setSparePartsCost("");
    setTechnicianCost("");
    setIsModalOpen(true);
  };

  const closePaymentSummaryModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId("");
    setTransportCost("");
    setSparePartsCost("");
    setTechnicianCost("");
  };

  const handleBookingIdChange = (e) => {
    setSelectedBookingId(e.target.value);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payment = {
      id: Date.now().toString(),
      bookingId: formData.get("bookingId"),
      transportCost: formData.get("transportCost"),
      sparePartsCost: formData.get("sparePartsCost"),
      technicianCost: formData.get("technicianCost"),
      totalCost: totalCost,
      description: formData.get("description") || "None",
    };
    // Save to local storage
    const existingPayments = JSON.parse(
      localStorage.getItem("paymentSummaries") || "[]"
    );
    localStorage.setItem(
      "paymentSummaries",
      JSON.stringify([...existingPayments, payment])
    );
    closePaymentSummaryModal();
    // Navigate to PaymentSummaryView
    navigate("/service-center-payment-summry");
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-xl"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-10 w-10 text-white" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">Service Center Hub</h1>
                <p className="text-sm sm:text-base text-blue-100 mt-1">
                  Monitor and manage your service center bookings with ease
                </p>
              </div>
            </div>
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleNotificationModal}
                className="relative p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-all duration-200"
                aria-label="View notifications"
              >
                <Bell className="h-6 w-6 text-white" />
                {confirmedPayments.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {confirmedPayments.length}
                  </span>
                )}
              </motion.button>
              <AnimatePresence>
                {isNotificationModalOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Confirmed Payments
                      </h3>
                      {confirmedPayments.length === 0 ? (
                        <p className="text-gray-500">No confirmed payments.</p>
                      ) : (
                        confirmedPayments.map((payment) => (
                          <div
                            key={payment.id}
                            className="p-2 border-b border-gray-200 last:border-b-0"
                          >
                            <p className="text-sm text-gray-800">
                              <strong>{payment.cardholderName}</strong> paid ${payment.amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(payment.date).toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {!id && serviceCenters.length > 0 && (
        <div className="mb-8 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Your Service Center
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gradient-to-r from-blue-50 to-indigo-50"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-gray-800">
                  {selectedCenter ? selectedCenter.name : "Select a Service Center"}
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                  role="listbox"
                >
                  {serviceCenters.map((center) => (
                    <li
                      key={center._id}
                      onClick={() => {
                        setSelectedCenterId(center._id);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150 flex items-center space-x-2"
                      role="option"
                      aria-selected={selectedCenterId === center._id}
                    >
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <span>{center.name}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-gray-800">{assignedBookings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openPaymentSummaryModal}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md shadow-sm hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
        >
          Create Payment Summary
        </motion.button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No bookings found for this service center.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appliance
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {booking.bookingId?.name || "-"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {booking.bookingId?.serviceType || "-"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {booking.bookingId?.description || "-"}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "assigned"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {new Date(booking.assignedDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 rounded-2xl pointer-events-none"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl px-6 py-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <DollarSign className="h-6 w-6 mr-2" />
                    Create Payment Summary
                  </h2>
                  <button
                    onClick={closePaymentSummaryModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handlePaymentSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Booking ID
                  </label>
                  <select
                    name="bookingId"
                    value={selectedBookingId}
                    onChange={handleBookingIdChange}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    required
                    aria-required="true"
                  >
                    <option value="">Select booking</option>
                    {bookings.map((booking) => (
                      <option key={booking._id} value={booking._id}>
                        {booking.bookingId?.name || booking._id} -{" "}
                        {booking.bookingId?.serviceType || "Unknown"}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mb-6"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <Truck className="h-4 w-4 mr-2 text-blue-600" />
                    Transport Cost
                  </label>
                  <input
                    type="number"
                    name="transportCost"
                    placeholder="Enter transport cost"
                    value={transportCost}
                    onChange={(e) => setTransportCost(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    required
                    aria-required="true"
                    min="0"
                    step="0.01"
                    autoFocus
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mb-6"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <Wrench className="h-4 w-4 mr-2 text-blue-600" />
                    Spare Parts Cost
                  </label>
                  <input
                    type="number"
                    name="sparePartsCost"
                    placeholder="Enter spare parts cost"
                    value={sparePartsCost}
                    onChange={(e) => setSparePartsCost(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    required
                    aria-required="true"
                    min="0"
                    step="0.01"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mb-6"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                    Technician Cost
                  </label>
                  <input
                    type="number"
                    name="technicianCost"
                    placeholder="Enter technician cost"
                    value={technicianCost}
                    onChange={(e) => setTechnicianCost(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    required
                    aria-required="true"
                    min="0"
                    step="0.01"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="mb-6"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                    Total Cost
                  </label>
                  <input
                    type="text"
                    value={totalCost}
                    readOnly
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 cursor-not-allowed"
                    aria-readonly="true"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mb-6"
                >
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter payment description"
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    rows="4"
                  ></textarea>
                </motion.div>
                <div className="flex space-x-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    title="Create payment summary"
                  >
                    Create Summary
                    <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closePaymentSummaryModal}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300"
                    title="Cancel and close"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceCenterDashboard;