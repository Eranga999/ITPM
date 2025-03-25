import { useState, useEffect } from "react";
import Header from '../Header';
import Footer from '../footer';
import editbooking from '../../assets/editbooking.jpg'; // Import the background image

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
        type === "success" ? "bg-emerald-500" : "bg-red-500"
      } text-white transform transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center space-x-2">
        {type === "success" ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Confirmation Dialog Component
const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full transform transition-all duration-300 ease-in-out"
      >
        <div className="bg-red-50 p-5 border-b border-red-100">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-red-100 rounded-full p-2">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-center text-gray-900">Confirm Action</h3>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-6 text-center">{message}</p>
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={onCancel}
              className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Modal Component for Editing Booking
const EditBookingModal = ({ booking, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(booking || { name: "", serviceType: "", preferredDate: "" });
  const [dateError, setDateError] = useState(null);

  useEffect(() => {
    if (booking) {
      setFormData(booking);
    } else {
      setFormData({ name: "", serviceType: "", preferredDate: "" });
    }
  }, [booking]);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "preferredDate") {
      setDateError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.preferredDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      setDateError("Preferred date must be today or a future date.");
      return;
    }

    onSave(formData);
  };

  if (!isOpen || !booking || !formData) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div 
        className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-in-out"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Edit Booking</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
              required
            >
              <option value="">Select an appliance</option>
              <option value="refrigerator">Refrigerator</option>
              <option value="washing-machine">Washing Machine</option>
              <option value="dryer">Dryer</option>
              <option value="dishwasher">Dishwasher</option>
              <option value="oven">Oven</option>
              <option value="microwave">Microwave</option>
              <option value="air-conditioner">Air Conditioner</option>
              <option value="heater">Heater</option>
              <option value="water-heater">Water Heater</option>
              <option value="vacuum-cleaner">Vacuum Cleaner</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate ? formData.preferredDate.slice(0, 10) : ""}
              onChange={handleChange}
              min={today}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            />
            {dateError && (
              <p className="mt-1 text-sm text-red-500">{dateError}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RepairChanges = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, id: null, message: "" });
  const [statusFilter, setStatusFilter] = useState("all");

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch bookings from API
  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return res.json();
      })
      .then((response) => {
        const bookingsData = response.data || response;
        const validBookings = bookingsData.filter((booking) => booking && booking._id);
        const idSet = new Set(validBookings.map((booking) => booking._id));
        
        if (idSet.size !== validBookings.length) {
          const uniqueBookings = [];
          const seenIds = new Set();
          for (const booking of validBookings) {
            if (!seenIds.has(booking._id)) {
              seenIds.add(booking._id);
              uniqueBookings.push(booking);
            }
          }
          setBookings(uniqueBookings);
        } else {
          setBookings(validBookings);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Handle delete booking
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(`Failed to delete booking: ${errData.message || res.statusText}`);
          });
        }
        return res.json();
      })
      .then(() => {
        setBookings(bookings.filter((booking) => booking._id !== id));
        setError(null);
        setToast({
          show: true,
          message: "Booking deleted successfully!",
          type: "success",
        });
        setConfirmDialog({ show: false, id: null, message: "" });
      })
      .catch((err) => {
        console.error("Error deleting booking:", err);
        setError(err.message || "Failed to delete booking. Please try again.");
      });
  };

  // Handle edit button click to open modal
  const handleEditClick = (booking) => {
    if (!booking || !booking._id) {
      console.error("Invalid booking data:", booking);
      return;
    }
    console.log("Edit clicked for booking:", booking); // Debug log
    if (booking.status === "Completed") {
      console.log("Blocked edit for Completed booking:", booking._id);
      setToast({
        show: true,
        message: "Completed bookings cannot be edited.",
        type: "error",
      });
      return;
    }
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Handle save edited booking
  const handleEdit = (id, updatedData) => {
    if (!id) {
      setError("Failed to update booking: Invalid ID");
      return;
    }

    const originalBooking = bookings.find((b) => b._id === id);
    if (!originalBooking) {
      setError("Failed to update booking: Booking not found");
      return;
    }
    if (originalBooking.status === "Completed") {
      console.log("Blocked update for Completed booking:", id);
      setToast({
        show: true,
        message: "Cannot update a completed booking.",
        type: "error",
      });
      setIsModalOpen(false);
      setSelectedBooking(null);
      return;
    }

    const mergedData = { ...originalBooking, ...updatedData };
    console.log("Sending update for booking:", mergedData); // Debug log

    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mergedData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(`Failed to update booking: ${errData.message || res.statusText}`);
          });
        }
        return res.json();
      })
      .then((response) => {
        const updatedBooking = response.data;
        if (!updatedBooking) {
          throw new Error("Updated booking data not found in response");
        }
        setBookings((prevBookings) =>
          prevBookings.map((b) => (b._id === id ? updatedBooking : b))
        );
        setIsModalOpen(false);
        setSelectedBooking(null);
        setError(null);
        setToast({
          show: true,
          message: "Booking updated successfully!",
          type: "success",
        });
      })
      .catch((err) => {
        console.error("Error updating booking:", err);
        setError(err.message || "Failed to update booking. Please try again.");
      });
  };

  // Show confirmation dialog before deleting
  const confirmDelete = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (!booking) return;
    
    setConfirmDialog({
      show: true,
      id: id,
      message: `Are you sure you want to delete the booking for ${booking.name || 'Unknown'}?`
    });
  };

  // Filter bookings by status
  const filteredBookings = statusFilter === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  // Get unique statuses for filter dropdown
  const statusOptions = ["all", ...new Set(bookings.map(b => b.status))].filter(Boolean);

  if (loading) return (
    <>
      <Header />
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
      <Footer />
    </>
  );

  if (error) return (
    <>
      <Header />
      <div className="bg-red-50 p-6 rounded-xl shadow-md text-center max-w-xl mx-auto my-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 rounded-full p-2">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p className="text-red-800 mb-4 font-medium">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetch("http://localhost:5000/api/bookings")
              .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch bookings");
                return res.json();
              })
              .then((response) => {
                const bookingsData = response.data || response;
                const validBookings = bookingsData.filter((booking) => booking && booking._id);
                setBookings(validBookings);
                setLoading(false);
              })
              .catch((err) => {
                console.error("Error fetching bookings:", err);
                setError("Failed to load bookings. Please try again later.");
                setLoading(false);
              });
          }}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all duration-200"
        >
          Retry
        </button>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      {/* Main Content with Background Image */}
      <div 
        className="min-h-screen py-12 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${editbooking})` }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Main Container with Semi-Transparent Background for Readability */}
          <div className="rounded-2xl shadow-xl overflow-hidden backdrop-blur-md bg-white/80 border border-white/30">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                  <path d="M0 0 L50 100 L100 0 Z" fill="white"></path>
                </svg>
              </div>
              <div className="relative">
                <h2 className="text-3xl font-extrabold text-white mb-2">Manage Your Bookings</h2>
                <p className="text-indigo-100">View, edit, and manage all your appliance repair appointments</p>
              </div>
            </div>

            <div className="p-6">
              {/* Filter Controls */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Filter by status:</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status === "all" ? "All Statuses" : status}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-gray-500 text-sm">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 mb-4">No bookings found matching your filters.</p>
                  {statusFilter !== "all" && (
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Show all bookings
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.map((booking, index) => (
                        <tr 
                          key={booking._id} 
                          className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{booking.name || "Unknown"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700">
                              {booking.serviceType
                                ? booking.serviceType
                                    .split('-')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ')
                                : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700">
                              {new Date(booking.preferredDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                              booking.status === "Confirmed" ? "bg-green-100 text-green-800" :
                              booking.status === "Completed" ? "bg-blue-100 text-blue-800" :
                              booking.status === "Cancelled" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditClick(booking)}
                                disabled={booking.status === "Completed"}
                                className={`px-3 py-1 rounded-lg transition-colors duration-150 ${
                                  booking.status === "Completed"
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
                                }`}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => confirmDelete(booking._id)}
                                className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-150"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Edit Booking Modal */}
      <EditBookingModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        onSave={(updatedData) => handleEdit(selectedBooking?._id, updatedData)}
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={confirmDialog.show}
        message={confirmDialog.message}
        onConfirm={() => handleDelete(confirmDialog.id)}
        onCancel={() => setConfirmDialog({ show: false, id: null, message: "" })}
      />
    </>
  );
};

export default RepairChanges;