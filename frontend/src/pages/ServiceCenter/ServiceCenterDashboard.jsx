import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ServiceCenterDashboard = () => {
  const { id } = useParams(); // Will be undefined for static route
  const [bookings, setBookings] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch service centers on mount
  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/service-centers');
        const centers = response.data.data;
        setServiceCenters(centers);
        if (centers.length > 0 && !id) {
          setSelectedCenterId(centers[0]._id); // Default to first center
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load service centers');
        setLoading(false);
      }
    };
    fetchServiceCenters();
  }, [id]);

  // Fetch bookings when selectedCenterId or id changes
  useEffect(() => {
    const fetchBookings = async () => {
      const serviceCenterId = id || selectedCenterId;
      if (!serviceCenterId) return; // Skip if no ID yet
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/service-centers/${serviceCenterId}/bookings`);
        setBookings(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookings');
        setLoading(false);
      }
    };
    fetchBookings();
  }, [id, selectedCenterId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Service Center Dashboard</h1>
      {!id && serviceCenters.length > 0 && (
        <div className="mb-4">
          <label className="mr-2">Select Service Center:</label>
          <select
            value={selectedCenterId}
            onChange={(e) => setSelectedCenterId(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            {serviceCenters.map((center) => (
              <option key={center._id} value={center._id}>
                {center.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 text-left">Customer</th>
              <th className="py-3 px-6 text-left">Appliance</th>
              <th className="py-3 px-6 text-left">Issue</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Assigned Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6">{booking.bookingId.name}</td>
                <td className="py-4 px-6">{booking.bookingId.serviceType}</td>
                <td className="py-4 px-6">{booking.bookingId.description || '-'}</td>
                <td className="py-4 px-6">{booking.status}</td>
                <td className="py-4 px-6">{new Date(booking.assignedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceCenterDashboard;