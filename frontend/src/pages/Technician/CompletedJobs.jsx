import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Wrench,
  FileText,
  Trash2,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  Download,
  Filter,
  Search,
  Package,
  Clock
} from 'lucide-react';
import TechnicianSidebar from '../../components/TechnicianSidebar';

const CompletedJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedJobs, setSelectedJobs] = useState([]);

  const technicianId = '670f5a1b2c8d4e9f1a2b3c4d'; // Replace with your actual technician ID

  const fetchCompletedJobs = async () => {
    try {
      console.log('Fetching completed jobs');
      const response = await axios.get('http://localhost:5000/api/technician/jobs', {
        params: { technicianId, status: 'Completed' },
      });
      setJobs(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err.response ? err.response.data : err.message);
      setError('Failed to load completed jobs: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        console.log('Deleting job:', id);
        const response = await axios.delete(`http://localhost:5000/api/technician/jobs/${id}`);
        console.log('Delete Job Response:', response.data);
        fetchCompletedJobs(); // Refresh the list
      } catch (err) {
        console.error('Delete error:', err.response ? err.response.data : err.message);
        setError('Failed to delete job: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const jobsToInclude = selectedJobs.length > 0 ? jobs.filter(job => selectedJobs.includes(job._id)) : jobs;

    doc.setFontSize(20);
    doc.text('Completed Jobs Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Technician ID: ${technicianId}`, 14, 42);

    const tableData = jobsToInclude.map(job => [
      job.customerName,
      job.appliance,
      job.issue,
      new Date(job.date).toLocaleDateString(),
      job.urgency
    ]);

    autoTable(doc, {
      head: [['Customer', 'Appliance', 'Issue', 'Date', 'Priority']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('completed-jobs-report.pdf');
  };

  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.appliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.issue.toLowerCase().includes(searchTerm.toLowerCase());

    if (dateFilter === 'all') return matchesSearch;
    
    const jobDate = new Date(job.date);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    
    return matchesSearch && (
      dateFilter === 'recent' 
        ? jobDate >= thirtyDaysAgo
        : jobDate < thirtyDaysAgo
    );
  });

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex items-center space-x-2">
          <Clock className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-gray-600">Loading jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TechnicianSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Completed Jobs</h1>
                  <p className="text-sm text-gray-500">View and manage your completed repair jobs</p>
                </div>
              </div>
              <button
                onClick={generateReport}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <Download className="w-5 h-5 mr-2" />
                Generate Report
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="recent">Last 30 Days</option>
                  <option value="older">Older than 30 Days</option>
                </select>
              </div>

              <div className="text-right text-sm text-gray-500">
                {selectedJobs.length} jobs selected for report
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-2 bg-white rounded-xl p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No completed jobs found</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job._id)}
                          onChange={() => toggleJobSelection(job._id)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{job.appliance}</h3>
                          <p className="text-sm text-gray-500">Completed on {new Date(job.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.urgency === 'High' ? 'bg-red-100 text-red-700' :
                        job.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {job.urgency} Priority
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium text-gray-900">{job.customerName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Wrench className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Issue:</span>
                        <span className="font-medium text-gray-900">{job.issue}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-gray-900">{job.address}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Record
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedJobs([job._id]);
                          generateReport();
                        }}
                        className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Job Report
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedJobs;