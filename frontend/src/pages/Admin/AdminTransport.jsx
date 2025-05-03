import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ArrowUpDown,
  Settings,
  Building2,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import AdminSidebar from '../../components/AdminSidebar';

const Transport = () => {
  const [transportRequests, setTransportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');

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
      fetchTransportRequests();
    } catch (err) {
      console.error('Update status error:', err.response ? err.response.data : err.message);
      setError('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setFontSize(16);
    doc.text('Transport Requests Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'MMM d, yyyy')}`, 14, 30);

    // Define table columns and rows
    const headers = [
      'Request ID',
      'Appliance',
      'Issue',
      'Status',
      'Service Center',
      'Request Date',
      'Notes'
    ];

    const rows = filteredRequests.map(request => [
      request._id,
      request.job?.appliance || 'N/A',
      request.job?.issue || 'N/A',
      request.status,
      `${request.serviceCenter?.name || 'N/A'} - ${request.serviceCenter?.location || 'N/A'}`,
      format(new Date(request.requestDate), 'MMM d, yyyy'),
      request.notes || 'None'
    ]);

    // Generate table using autoTable
    doc.autoTable({
      startY: 40,
      head: [headers],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 30 }, // Request ID
        1: { cellWidth: 20 }, // Appliance
        2: { cellWidth: 20 }, // Issue
        3: { cellWidth: 20 }, // Status
        4: { cellWidth: 30 }, // Service Center
        5: { cellWidth: 20 }, // Request Date
        6: { cellWidth: 30 }  // Notes
      }
    });

    // Save the PDF
    doc.save(`transport_requests_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  useEffect(() => {
    fetchTransportRequests();
  }, []);

  const filteredRequests = transportRequests
    .filter(request => 
      (statusFilter === 'All' || request.status === statusFilter) &&
      ((request.job?.appliance || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       (request.job?.issue || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       (request.serviceCenter?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       (request.technician?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       (request.technician?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      } else {
        return a.status.localeCompare(b.status);
      }
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Truck className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Transport Requests</h1>
                  <p className="text-sm text-gray-500">Manage appliance transportation</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                  <Settings className="h-6 w-6" />
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  T
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
            <button
              onClick={generateReport}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Generate PDF Report
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.length === 0 ? (
              <p className="text-gray-600">No transport requests available.</p>
            ) : (
              filteredRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.job?.appliance || 'N/A'} - {request.job?.issue || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-500">Request ID: {request._id}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'Delivered' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status === 'Pending' ? <Clock className="w-4 h-4" /> :
                       request.status === 'Approved' ? <CheckCircle className="w-4 h-4" /> :
                       request.status === 'In Transit' ? <Truck className="w-4 h-4" /> :
                       request.status === 'Delivered' ? <Package className="w-4 h-4" /> :
                       <XCircle className="w-4 h-4" />}
                      <span className="text-sm font-medium">{request.status}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{request.serviceCenter?.name} - {request.serviceCenter?.location}</p>
                        <p className="text-sm text-gray-500">Service Center</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{request.job?.appliance || 'N/A'}</p>
                        <p className="text-sm text-gray-500">Appliance</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Request Date:</span>
                      <span className="text-gray-900">{format(new Date(request.requestDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">Notes:</p>
                      <p className="mt-1">{request.notes || 'None'}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    {request.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'Approved')}
                          className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'Cancelled')}
                          className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {request.status === 'Approved' && (
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'In Transit')}
                        className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Mark as In Transit
                      </button>
                    )}
                    {request.status === 'In Transit' && (
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'Delivered')}
                        className="flex-1 bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {(request.status === 'Delivered' || request.status === 'Cancelled') && (
                      <button className="flex-1 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transport;