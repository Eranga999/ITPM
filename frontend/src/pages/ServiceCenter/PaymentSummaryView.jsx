import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, FileText, Truck, Wrench, X, Search, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PaymentSummaryView = () => {
  const [paymentSummaries, setPaymentSummaries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBookingId, setFilterBookingId] = useState("");
  const [editForm, setEditForm] = useState({
    bookingId: "",
    transportCost: "",
    sparePartsCost: "",
    technicianCost: "",
    description: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let summaries;
        try {
          summaries = JSON.parse(localStorage.getItem("paymentSummaries") || "[]");
        } catch (e) {
          console.error("Failed to parse paymentSummaries from localStorage:", e);
          summaries = [];
        }
        setPaymentSummaries(summaries);

        let serviceCenters = [];
        try {
          const centersResponse = await axios.get('http://localhost:5000/api/admin/service-centers');
          serviceCenters = centersResponse.data.data || [];
        } catch (err) {
          console.error("Failed to fetch service centers:", err);
          setError("Failed to load service centers");
          setLoading(false);
          return;
        }

        const bookingsPromises = serviceCenters.map(async (center) => {
          try {
            const response = await axios.get(`http://localhost:5000/api/service-centers/${center._id}/bookings`);
            return response.data.data || [];
          } catch (err) {
            console.error(`Failed to fetch bookings for service center ${center._id}:`, err);
            return [];
          }
        });
        const bookingsResponses = await Promise.all(bookingsPromises);
        const allBookings = bookingsResponses.flat();
        setBookings(allBookings);

        setLoading(false);
      } catch (err) {
        setError("Unexpected error while loading data");
        setLoading(false);
        console.error("Unexpected error in fetchData:", err);
      }
    };
    fetchData();
  }, []);

  const totalCost = () => {
    const transport = parseFloat(editForm.transportCost) || 0;
    const spareParts = parseFloat(editForm.sparePartsCost) || 0;
    const technician = parseFloat(editForm.technicianCost) || 0;
    return (transport + spareParts + technician).toFixed(2);
  };

  const openEditModal = (summary) => {
    setSelectedSummary(summary);
    setEditForm({
      bookingId: summary.bookingId,
      transportCost: summary.transportCost,
      sparePartsCost: summary.sparePartsCost,
      technicianCost: summary.technicianCost,
      description: summary.description || "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSummary(null);
    setEditForm({
      bookingId: "",
      transportCost: "",
      sparePartsCost: "",
      technicianCost: "",
      description: "",
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedSummary = {
      ...selectedSummary,
      ...editForm,
      totalCost: totalCost(),
    };
    const updatedSummaries = paymentSummaries.map((summary) =>
      summary.id === updatedSummary.id ? updatedSummary : summary
    );
    setPaymentSummaries(updatedSummaries);
    localStorage.setItem("paymentSummaries", JSON.stringify(updatedSummaries));
    closeEditModal();
  };

  const handleDelete = (id) => {
    const updatedSummaries = paymentSummaries.filter((summary) => summary.id !== id);
    setPaymentSummaries(updatedSummaries);
    localStorage.setItem("paymentSummaries", JSON.stringify(updatedSummaries));
  };

  const getCustomerName = (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId);
    return booking?.bookingId?.name || bookingId || "Unknown";
  };

  const filteredSummaries = useMemo(() => {
    return paymentSummaries.filter((summary) => {
      const customerName = getCustomerName(summary.bookingId).toLowerCase();
      const description = (summary.description || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = customerName.includes(query) || description.includes(query);
      const matchesFilter = !filterBookingId || summary.bookingId === filterBookingId;
      return matchesSearch && matchesFilter;
    });
  }, [paymentSummaries, searchQuery, filterBookingId, bookings]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Adding header
    doc.setFontSize(16);
    doc.text("Payment Summary Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Search Query: ${searchQuery}`, 14, 40);

    // Adding table
    doc.autoTable({
      startY: 50,
      head: [['Customer Name', 'Transport Cost', 'Spare Parts Cost', 'Technician Cost', 'Total Cost', 'Description']],
      body: filteredSummaries.map(summary => [
        getCustomerName(summary.bookingId),
        `$${summary.transportCost}`,
        `$${summary.sparePartsCost}`,
        `$${summary.technicianCost}`,
        `$${summary.totalCost}`,
        summary.description || ''
      ]),
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 40 }, // Customer Name
        5: { cellWidth: 60 }  // Description
      },
      theme: 'striped'
    });

    // Trigger download
    doc.save('payment_summary_report.pdf');
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
          <div className="flex items-center space-x-4">
            <DollarSign className="h-10 w-10 text-white" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Payment Summaries</h1>
              <p className="text-sm sm:text-base text-blue-100 mt-1">
                View, update, or delete your payment summaries
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
            <Search className="h-4 w-4 mr-2 text-blue-600" />
            Search
          </label>
          <input
            type="text"
            placeholder="Search by customer name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          />
        </div>
        <div className="flex-1">
          <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
            <FileText className="h-4 w-4 mr-2 text-blue-600" />
            Filter by Booking
          </label>
          <select
            value={filterBookingId}
            onChange={(e) => setFilterBookingId(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            <option value="">All Bookings</option>
            {bookings.map((booking) => (
              <option key={booking._id} value={booking._id}>
                {(booking.bookingId?.name || booking._id || "Unknown")} - {booking.bookingId?.serviceType || "Unknown"}
              </option>
            ))}
          </select>
        </div>
        {searchQuery && filteredSummaries.length > 0 && (
          <div className="flex-1">
            <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
              <FileDown className="h-4 w-4 mr-2 text-blue-600" />
              Report
            </label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generatePDF}
              className="w-full p-3 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Generate PDF Report
            </motion.button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredSummaries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No payment summaries found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transport Cost
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spare Parts Cost
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician Cost
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSummaries.map((summary, index) => (
                <tr
                  key={summary.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-4 px-6 text-sm text-gray-900">{getCustomerName(summary.bookingId)}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">${summary.transportCost}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">${summary.sparePartsCost}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">${summary.technicianCost}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">${summary.totalCost}</td>
                  <td className="py-4 px-6 text-sm text-gray-900 max-w-xs truncate" title={summary.description}>
                    {summary.description}
                  </td>
                  <td className="py-4 px-6 text-sm flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(summary)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-all duration-200"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(summary.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-all duration-200"
                    >
                      Delete
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/service-center-dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-all duration-200"
        >
          Back to Dashboard
        </motion.button>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
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
                    Edit Payment Summary
                  </h2>
                  <button
                    onClick={closeEditModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditSubmit}>
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
                    value={editForm.bookingId}
                    onChange={(e) => setEditForm({ ...editForm, bookingId: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    required
                    aria-required="true"
                  >
                    <option value="">Select booking</option>
                    {bookings.map((booking) => (
                      <option key={booking._id} value={booking._id}>
                        {(booking.bookingId?.name || booking._id || "Unknown")} - {booking.bookingId?.serviceType || "Unknown"}
                      </option>
                    ))}
                    {editForm.bookingId && !bookings.some(b => b._id === editForm.bookingId) && (
                      <option value={editForm.bookingId}>{editForm.bookingId} (Unknown)</option>
                    )}
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
                    value={editForm.transportCost}
                    onChange={(e) => setEditForm({ ...editForm, transportCost: e.target.value })}
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
                    value={editForm.sparePartsCost}
                    onChange={(e) => setEditForm({ ...editForm, sparePartsCost: e.target.value })}
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
                    value={editForm.technicianCost}
                    onChange={(e) => setEditForm({ ...editForm, technicianCost: e.target.value })}
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
                    value={totalCost()}
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
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    rows="4"
                  />
                </motion.div>
                <div className="flex space-x-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    title="Update payment summary"
                  >
                    Update Summary
                    <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeEditModal}
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

export default PaymentSummaryView;