import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ServiceCenterDashboard = () => {
  const { id } = useParams(); // Will be undefined for static route
  const [bookings, setBookings] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState('');
  const [selectedTechnicians, setSelectedTechnicians] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Fetch technicians on mount
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/technicians');
        setTechnicians(response.data.data);
      } catch (err) {
        console.error('Failed to load technicians:', err);
        setError('Failed to load technicians');
      }
    };
    fetchTechnicians();
  }, []);

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

  const handleTechnicianChange = (bookingId, technicianId) => {
    setSelectedTechnicians({
      ...selectedTechnicians,
      [bookingId]: technicianId
    });
  };

  const handleAssignTechnician = async (bookingId) => {
    const technicianId = selectedTechnicians[bookingId];
    if (!technicianId) {
      alert('Please select a technician first');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/technician/assign', {
        bookingId: bookingId,
        technicianId: technicianId
      });
      
      // Refresh bookings after assign
      const serviceCenterId = id || selectedCenterId;
      const response = await axios.get(`http://localhost:5000/api/service-centers/${serviceCenterId}/bookings`);
      setBookings(response.data.data);
      
      // Clear selection for this booking
      const updatedSelections = { ...selectedTechnicians };
      delete updatedSelections[bookingId];
      setSelectedTechnicians(updatedSelections);
      
      alert('Technician assigned successfully');
    } catch (err) {
      console.error('Failed to assign technician:', err);
      alert('Failed to assign technician: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => 
    booking.bookingId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Service Center Dashboard</h1>
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
        {!id && serviceCenters.length > 0 && (
          <div className="mb-4 md:mb-0">
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
        
        {/* Search input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

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
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 px-6 text-center text-gray-500">
                  {searchTerm ? 'No customers found matching your search.' : 'No bookings available.'}
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{booking.bookingId.name}</td>
                  <td className="py-4 px-6">{booking.bookingId.serviceType}</td>
                  <td className="py-4 px-6">{booking.bookingId.description || '-'}</td>
                  <td className="py-4 px-6">{booking.status}</td>
                  <td className="py-4 px-6">{new Date(booking.assignedDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    {booking.bookingId.technicianAssigned ? (
                      `${booking.bookingId.technicianAssigned.firstName} ${booking.bookingId.technicianAssigned.lastName}`
                    ) : (
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={selectedTechnicians[booking._id] || ''}
                        onChange={(e) => handleTechnicianChange(booking._id, e.target.value)}
                      >
                        <option value="">Select Technician</option>
                        {technicians.map(tech => (
                          <option key={tech._id} value={tech._id}>
                            {tech.firstName} {tech.lastName}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {!booking.bookingId.technicianAssigned && (
                      <button
                        onClick={() => handleAssignTechnician(booking._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                        disabled={!selectedTechnicians[booking._id]}
                      >
                        Assign Technician
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceCenterDashboard;