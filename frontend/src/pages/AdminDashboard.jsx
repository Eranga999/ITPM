import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Manage Customers & Technicians</h2>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-blue-700">Customers</h3>
              <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg">Manage Customers</button>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-green-700">Technicians</h3>
              <button className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg">Manage Technicians</button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Repair Requests</h2>
          <div className="mt-4">
            <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg">View Pending Requests</button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Financial Overview</h2>
          <div className="mt-4">
            <button className="bg-gray-800 text-white py-2 px-4 rounded-lg">View Payments</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
