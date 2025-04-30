import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ServiceCenterDashboard = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/service-centers');
        const centers = response.data.data;
        setServiceCenters(centers);
        if (centers.length > 0 && !id) {
          setSelectedCenterId(centers[0]._id);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load service centers');
        setLoading(false);
      }
    };

    const fetchTechnicians = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/technicians');
        setTechnicians(response.data.data);
      } catch (err) {
        setError('Failed to load technicians');
      }
    };

    fetchServiceCenters();
    fetchTechnicians();
  }, [id]);

  useEffect(() => {
    const fetchBookings = async () => {
      const serviceCenterId = id || selectedCenterId;
      if (!serviceCenterId) return;
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

  const handleAssignTechnician = async (bookingId) => {
    const technicianId = selectedTechnicianId[bookingId];
    if (!technicianId) {
      alert('Please select a technician');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/service-centers/bookings/${bookingId}/assign`, {
        technicianId,
      });
      alert('Technician assigned successfully');
      const serviceCenterId = id || selectedCenterId;
      const response = await axios.get(`http://localhost:5000/api/service-centers/${serviceCenterId}/bookings`);
      setBookings(response.data.data);
    } catch (err) {
      setError('Failed to assign technician');
    }
  };

  const handleTechnicianChange = (bookingId, technicianId) => {
    setSelectedTechnicianId((prev) => ({
      ...prev,
      [bookingId]: technicianId,
    }));
  };

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
              <th className="py-3 px-6 text-left">Technician</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6">
                  {booking.bookingId ? booking.bookingId.name : 'Unknown Customer'}
                </td>
                <td className="py-4 px-6">
                  {booking.bookingId ? booking.bookingId.serviceType : '-'}
                </td>
                <td className="py-4 px-6">
                  {booking.bookingId && booking.bookingId.description ? booking.bookingId.description : '-'}
                </td>
                <td className="py-4 px-6">{booking.status}</td>
                <td className="py-4 px-6">{new Date(booking.assignedDate).toLocaleDateString()}</td>
                <td className="py-4 px-6">
                  {booking.technicianId ? (
                    `${booking.technicianId.firstName} ${booking.technicianId.lastName}`
                  ) : (
                    <select
                      value={selectedTechnicianId[booking._id] || ''}
                      onChange={(e) => handleTechnicianChange(booking._id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="">Select Technician</option>
                      {technicians.map((technician) => (
                        <option key={technician._id} value={technician._id}>
                          {technician.firstName} {technician.lastName}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="py-4 px-6">
                  {!booking.technicianId && (
                    <button
                      onClick={() => handleAssignTechnician(booking._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceCenterDashboard;