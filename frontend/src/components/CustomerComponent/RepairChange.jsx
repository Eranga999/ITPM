import { useState, useEffect } from "react";

// Modal Component for Editing Booking
const EditBookingModal = ({ booking, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(booking || { name: "", serviceType: "", preferredDate: "" });
  const [dateError, setDateError] = useState(null); // State to store date validation error

  // Debugging: Log props to ensure they're passed correctly
  console.log("EditBookingModal Props:", { booking, isOpen });

  // Reset formData when booking changes
  useEffect(() => {
    if (booking) {
      setFormData(booking);
    } else {
      setFormData({ name: "", serviceType: "", preferredDate: "" }); // Fallback if booking is null
    }
  }, [booking]);

  // Get current date for date input min
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear date error when the user changes the date
    if (name === "preferredDate") {
      setDateError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate preferredDate
    const selectedDate = new Date(formData.preferredDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    if (selectedDate < currentDate) {
      setDateError("Preferred date must be today or a future date.");
      return;
    }

    console.log("Submitting updated data:", formData); // Debugging line
    onSave(formData); // Call onSave with updated data
  };

  if (!isOpen || !booking || !formData) {
    console.log("Modal not rendering: isOpen =", isOpen, "booking =", booking, "formData =", formData);
    return null; // Prevent rendering if the modal is closed, no booking data, or formData is not ready
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
        <h3 className="text-2xl font-bold mb-4">Edit Booking</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate ? formData.preferredDate.slice(0, 10) : ""}
              onChange={handleChange}
              min={today} // Restrict past dates in the date picker
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {dateError && (
              <p className="mt-1 text-sm text-red-500">{dateError}</p>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
        console.log("API Response:", response);
        const bookingsData = response.data || response;

        // Filter out bookings with missing or invalid _id
        const validBookings = bookingsData.filter((booking) => booking && booking._id);

        // Check for duplicate _id values
        const idSet = new Set(validBookings.map((booking) => booking._id));
        if (idSet.size !== validBookings.length) {
          console.warn("Duplicate _id values found in bookings:", validBookings);
          // Filter out duplicates by keeping the first occurrence
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
        setError(null); // Clear any previous errors
        setSuccessMessage("Booking deleted successfully!");
        setShowSuccessPopup(true); // Show success popup
      })
      .catch((err) => {
        console.error("Error deleting booking:", err);
        setError(err.message || "Failed to delete booking. Please try again.");
      });
  };

  // Handle edit button click to open modal
  const handleEditClick = (booking) => {
    console.log("Editing booking:", booking);
    if (!booking || !booking._id) {
      console.error("Invalid booking data:", booking);
      return;
    }
    setSelectedBooking(booking);
    setIsModalOpen(true); // Open the modal
  };

  // Handle save edited booking
  const handleEdit = (id, updatedData) => {
    if (!id) {
      console.error("No ID provided for updating booking");
      setError("Failed to update booking: Invalid ID");
      return;
    }

    // Find the original booking to merge with updatedData
    const originalBooking = bookings.find((b) => b._id === id);
    if (!originalBooking) {
      console.error("Original booking not found for ID:", id);
      setError("Failed to update booking: Booking not found");
      return;
    }

    // Merge updatedData with originalBooking to preserve other fields
    const mergedData = { ...originalBooking, ...updatedData };

    console.log("Sending update request for ID:", id, "with data:", mergedData);

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
        console.log("Update successful, received:", response);
        // Extract the updated booking from the response
        const updatedBooking = response.data;
        if (!updatedBooking) {
          throw new Error("Updated booking data not found in response");
        }
        setBookings((prevBookings) =>
          prevBookings.map((b) => (b._id === id ? updatedBooking : b))
        );
        setIsModalOpen(false); // Close the modal after save
        setSelectedBooking(null); // Reset selectedBooking
        setError(null); // Clear any previous errors
        setSuccessMessage("Booking updated successfully!");
        setShowSuccessPopup(true); // Show success popup
      })
      .catch((err) => {
        console.error("Error updating booking:", err);
        setError(err.message || "Failed to update booking. Please try again.");
      });
  };

  // Close the success popup
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
  };

  if (loading) return <p className="text-center text-lg text-gray-500">Loading...</p>;
  if (error) return (
    <div className="text-center text-red-500">
      <p>{error}</p>
      <button
        onClick={() => {
          setError(null);
          setLoading(true);
          // Re-fetch bookings
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
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Your Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 shadow-md bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left text-gray-700">Customer Name</th>
                <th className="p-3 text-left text-gray-700">Service</th>
                <th className="p-3 text-left text-gray-700">Preferred Date</th>
                <th className="p-3 text-left text-gray-700">Status</th>
                <th className="p-3 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-800">{booking.name || "Unknown"}</td>
                  <td className="p-3 text-gray-800">
                    {booking.serviceType
                      ? booking.serviceType
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-800">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-800">{booking.status}</td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEditClick(booking)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl transform transition-all">
            <div className="bg-green-50 p-4 rounded-t-lg border-b border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900">Success!</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                {successMessage}
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={handleClosePopup}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairChanges;