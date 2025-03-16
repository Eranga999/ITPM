import { useState, useEffect } from "react";

// Modal Component for Editing Booking
const EditBookingModal = ({ booking, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(booking);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);  // Call onSave with updated data
  };

  if (!isOpen || !booking) return null;  // Prevent rendering if the modal is closed or no booking data is provided

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
        <h3 className="text-2xl font-bold mb-4">Edit Booking</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Service Type</label>
            <input
              type="text"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate.slice(0, 10)}  // Ensure the date format is correct
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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

  // Fetch bookings from API
  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.data); // Ensure you access 'data' key
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
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
          throw new Error("Failed to delete booking");
        }
        setBookings(bookings.filter((booking) => booking._id !== id));
      })
      .catch((err) => console.error("Error deleting booking:", err));
  };

  // Handle edit button click to open modal
  const handleEditClick = (booking) => {
    console.log("Editing booking:", booking);  // Debugging line to ensure booking data is passed
    setSelectedBooking(booking);
    setIsModalOpen(true); // Open the modal
  };

  // Handle save edited booking
  const handleEdit = (id, updatedData) => {
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((updatedBooking) => {
        setBookings(bookings.map((b) => (b._id === id ? updatedBooking : b)));
        setIsModalOpen(false);  // Close the modal after save
      })
      .catch((err) => console.error("Error updating booking:", err));
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Your Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 shadow-md bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Preferred Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b">
                  <td className="p-3">{booking.serviceType}</td>
                  <td className="p-3">{new Date(booking.preferredDate).toLocaleDateString()}</td>
                  <td className="p-3">{booking.status}</td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEditClick(booking)} // Ensure this opens the modal
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
        onClose={() => setIsModalOpen(false)} // Close the modal on cancel
        onSave={(updatedData) => handleEdit(selectedBooking._id, updatedData)} // Save updated data
      />
    </div>
  );
};

export default RepairChanges;
