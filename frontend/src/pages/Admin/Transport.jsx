import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transport = () => {
  const [transportRequests, setTransportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransportRequests = async () => {
    try {
      console.log('Fetching transport requests');
      const response = await axios.get('http://localhost:5000/api/transport/all');
      setTransportRequests(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err.response ? err.response.data : err.message);
      setError('Failed to load transport requests: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      console.log(`Updating transport request ${id} to status: ${newStatus}`);
      const response = await axios.put(`http://localhost:5000/api/transport/request/${id}`, {
        status: newStatus,
      });
      console.log('Update Status Response:', response.data);
      fetchTransportRequests(); // Refresh the list
    } catch (err) {
      console.error('Update status error:', err.response ? err.response.data : err.message);
      setError('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchTransportRequests();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Transport Requests</h1>
      <div className="space-y-6">
        {transportRequests.length === 0 ? (
          <p className="text-gray-600">No transport requests available.</p>
        ) : (
          transportRequests.map((request) => (
            <div key={request._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Job: {request.job?.appliance || 'N/A'} - {request.job?.issue || 'N/A'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Technician: {request.technician?.firstName} {request.technician?.lastName}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Service Center: {request.serviceCenter?.name} - {request.serviceCenter?.location}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Request Date: {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-1">Notes: {request.notes || 'None'}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                      request.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : request.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : request.status === 'In Transit'
                        ? 'bg-blue-100 text-blue-700'
                        : request.status === 'Delivered'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
                <div className="flex space-x-3">
                  {request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'Approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'Cancelled')}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {request.status === 'Approved' && (
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'In Transit')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Mark as In Transit
                    </button>
                  )}
                  {request.status === 'In Transit' && (
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'Delivered')}
                      className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transport;