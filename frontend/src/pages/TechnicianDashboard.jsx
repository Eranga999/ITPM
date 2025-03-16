import React from 'react';

const TechnicianDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Technician Dashboard</h1>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Assigned Jobs</h2>
          <div className="bg-gray-100 p-4 mt-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg text-gray-700">Repair Job #1</h3>
            <p>Appliance: AC</p>
            <p>Status: Pending</p>
            <button className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg">Update Status</button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Transport Request</h2>
          <div className="mt-4">
            <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg">Request Transport</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
