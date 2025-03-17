// src/pages/Technician/UrgentRepairs.jsx
import React from 'react';
import Sidebar from '../../components/TechnicianSidebar';

const UrgentRepairs = () => {
  const urgentJobs = [
    {
      type: "Refrigerator",
      customer: "John Doe",
      issue: "Not cooling properly",
      address: "123 Main St",
      date: "2024-03-15",
      priority: "High Priority",
    },
    {
      type: "Air Conditioner",
      customer: "Jane Smith",
      issue: "Not turning on",
      address: "456 Oak Ave",
      date: "2024-03-16",
      priority: "High Priority",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Urgent Repairs */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Urgent Repairs</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center">
            <span className="mr-2">+</span> Add New Job
          </button>
        </header>
        <div className="space-y-6">
          {urgentJobs.length === 0 ? (
            <p className="text-gray-600">No urgent repairs available.</p>
          ) : (
            urgentJobs.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{job.type}</h3>
                    <p className="text-gray-600 mt-1">Customer: {job.customer}</p>
                    <p className="text-gray-600 mt-1">Issue: {job.issue}</p>
                    <p className="text-gray-600 mt-1">Address: {job.address}</p>
                    <p className="text-gray-600 mt-1">Date: {job.date}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                        job.priority === "High Priority"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {job.priority}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                      Start Job
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UrgentRepairs;