import React from 'react';

const ServiceCenterDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Service Center Dashboard</h1>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Received Appliances</h2>
          <div className="bg-gray-100 p-4 mt-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg text-gray-700">Appliance: Refrigerator</h3>
            <p>Status: Awaiting Repair</p>
            <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg">Start Repair</button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Repair Status</h2>
          <div className="mt-4">
            <button className="bg-gray-800 text-white py-2 px-4 rounded-lg">Update Repair Status</button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Return Confirmations</h2>
          <div className="mt-4">
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg">Confirm Return</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterDashboard;
