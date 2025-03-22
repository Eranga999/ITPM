import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TechnicianSidebar from '../../components/TechnicianSidebar';
import { format } from 'date-fns';
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Calendar,
  MapPin,
  User,
  PenTool,
  MessageSquare,
  Trash2,
  PlayCircle,
  Building2
} from 'lucide-react';

const PendingJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [transportFormData, setTransportFormData] = useState({
    serviceCenter: '',
    notes: '',
  });
  const [formData, setFormData] = useState({
    customerName: '',
    appliance: '',
    issue: '',
    address: '',
    urgency: 'Medium',
    date: '2025-03-16',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  // Fetch technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/technicians');
        setTechnicians(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedTechnicianId(response.data.data[0]._id);
        }
      } catch (err) {
        setError('Failed to load technicians');
      }
    };
    fetchTechnicians();
  }, []);

  const fetchPendingJobs = async () => {
    if (!selectedTechnicianId) return;

    try {
      const response = await axios.get('http://localhost:5000/api/technician/assigned-bookings', {
        params: { technicianId: selectedTechnicianId }
      });
      
      const assignedBookings = response.data.data;
      if (assignedBookings.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }
      
      const formattedJobs = assignedBookings.map(booking => ({
        _id: booking._id,
        customerName: booking.name,
        appliance: booking.serviceType,
        issue: booking.description || 'No description provided',
        status: booking.status,
        date: booking.preferredDate,
        address: booking.address,
        urgency: 'Medium',
      }));
      
      setJobs(formattedJobs);
      setLoading(false);
    } catch (err) {
      setError('Failed to load assigned bookings: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const fetchServiceCenters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/service-centers');
      setServiceCenters(response.data.data);
    } catch (err) {
      setError('Failed to load service centers: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (selectedTechnicianId) {
      fetchPendingJobs();
      fetchServiceCenters();
    }
  }, [selectedTechnicianId]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      customerName: '',
      appliance: '',
      issue: '',
      address: '',
      urgency: 'Medium',
      date: '2025-03-16',
    });
  };

  const handleOpenTransportModal = (jobId) => {
    setCurrentJobId(jobId);
    setIsTransportModalOpen(true);
  };

  const handleCloseTransportModal = () => {
    setIsTransportModalOpen(false);
    setCurrentJobId(null);
    setTransportFormData({
      serviceCenter: '',
      notes: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTransportInputChange = (e) => {
    const { name, value } = e.target;
    setTransportFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        technician: selectedTechnicianId,
      };
      await axios.post('http://localhost:5000/api/technician/jobs', jobData);
      handleCloseModal();
      fetchPendingJobs();
    } catch (err) {
      setError('Failed to add job: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStartJob = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/technician/bookings/${jobId}/start`, {
        technicianId: selectedTechnicianId
      });
      fetchPendingJobs();
      handleOpenTransportModal(jobId); // Open transport modal after starting job
    } catch (err) {
      alert('Failed to start job: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCompleteJob = async (jobId) => {
    try {
      await axios.put(`http://localhost:5000/api/technician/bookings/${jobId}/complete`, {
        technicianId: selectedTechnicianId
      });
      fetchPendingJobs();
    } catch (err) {
      alert('Failed to complete job: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRequestTransport = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting transport request:', transportFormData);
      const transportData = {
        job: currentJobId,
        technician: selectedTechnicianId,
        serviceCenter: transportFormData.serviceCenter,
        notes: transportFormData.notes,
      };
      const response = await axios.post('http://localhost:5000/api/transport/request', transportData);
      console.log('Transport Request Response:', response.data);
      handleCloseTransportModal();
      fetchPendingJobs(); // Refresh jobs list after transport request
    } catch (err) {
      console.error('Transport request error:', err.response ? err.response.data : err.message);
      setError('Failed to request transport: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`http://localhost:5000/api/technician/jobs/${id}`);
        fetchPendingJobs();
      } catch (err) {
        setError('Failed to delete job: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <Clock className="w-4 h-4" />,
      'confirmed': <Clock className="w-4 h-4" />,
      'in-progress': <PlayCircle className="w-4 h-4" />,
      'Pending': <Clock className="w-4 h-4" />,
      'In Progress': <PlayCircle className="w-4 h-4" />,
    };
    return icons[status] || <Package className="w-4 h-4" />;
  };

  const filteredJobs = jobs
    .filter(job => 
      (statusFilter === 'All' || job.status === statusFilter) &&
      ((job.appliance || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       (job.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
       (job.issue || '').toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.status.localeCompare(b.status);
      }
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TechnicianSidebar />

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <PenTool className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Pending Jobs</h1>
                  <p className="text-sm text-gray-500">Manage your pending and in-progress jobs</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div>
                  <label className="mr-2 text-sm text-gray-600">Select Technician:</label>
                  <select
                    value={selectedTechnicianId}
                    onChange={(e) => setSelectedTechnicianId(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1"
                  >
                    {technicians.map((tech) => (
                      <option key={tech._id} value={tech._id}>
                        {tech.firstName} {tech.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by customer name, appliance, or issue..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                </select>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600 text-lg">No assigned jobs available for the selected technician.</p>
                <p className="text-gray-500 mt-2">
                  {technicians.length > 0 
                    ? "Try selecting a different technician from the dropdown, or check that jobs have been assigned correctly." 
                    : "Please add technicians in the admin panel and assign them to jobs."}
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          <PenTool className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{job.appliance}</h3>
                          <p className="text-sm text-gray-500">Job ID: {job._id}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="text-sm font-medium">{job.status}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium text-gray-900">{job.customerName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Appliance:</span>
                        <span className="font-medium text-gray-900">{job.appliance}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-gray-900">{job.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(job.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Issue:</span>
                        <span className="font-medium text-gray-900">{job.issue}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      {job.status === 'confirmed' ? (
                        <button
                          onClick={() => handleStartJob(job._id)}
                          className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Start Job
                        </button>
                      ) : job.status === 'in-progress' ? (
                        <button
                          onClick={() => handleCompleteJob(job._id)}
                          className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete Job
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
            <form onSubmit={handleAddJob}>
              <div className="mb-4">
                <label htmlFor="customerName" className="block text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="appliance" className="block text-gray-700 mb-1">
                  Appliance
                </label>
                <input
                  type="text"
                  id="appliance"
                  name="appliance"
                  value={formData.appliance}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Appliance"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="issue" className="block text-gray-700 mb-1">
                  Issue
                </label>
                <input
                  type="text"
                  id="issue"
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Issue"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Address"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="urgency" className="block text-gray-700 mb-1">
                  Urgency
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTransportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Request Transport</h2>
            <p className="text-gray-600 mb-4">
              Do you need to transport the item to a service center because it cannot be fixed on-site?
            </p>
            <form onSubmit={handleRequestTransport}>
              <div className="mb-4">
                <label htmlFor="serviceCenter" className="block text-gray-700 mb-1">
                  Select Service Center
                </label>
                <select
                  id="serviceCenter"
                  name="serviceCenter"
                  value={transportFormData.serviceCenter}
                  onChange={handleTransportInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a service center</option>
                  {serviceCenters.map((center) => (
                    <option key={center._id} value={center._id}>
                      {center.name} - {center.location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="notes" className="block text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={transportFormData.notes}
                  onChange={handleTransportInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g., Item too large to fix on-site"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseTransportModal}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  No
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Request Transport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingJobs;