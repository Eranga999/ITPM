import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Static data for payments (replace with API call if needed)
  const payments = [
    {
      customer: "Alice Brown",
      amount: "$299.99",
      status: "Paid",
      date: "2024-03-15",
      repairId: "REP-001",
      method: "Credit Card",
    },
    {
      customer: "Bob Wilson",
      amount: "$149.50",
      status: "Pending",
      date: "2024-03-16",
      repairId: "REP-002",
      method: "Awaiting Payment",
    },
    {
      customer: "Emma Davis",
      amount: "$89.99",
      status: "Failed",
      date: "2024-03-16",
      repairId: "REP-003",
      method: "Debit Card",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Inlined Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <div className="logo mb-8">
            <h1 className="text-2xl font-bold text-blue-600">RepairAdmin</h1>
          </div>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/admin-dashboard"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">📊</span> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/service-centers"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/service-centers"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">🏢</span> Service Centers
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/technicians"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/technicians"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">👨‍🔧</span> Technicians
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/repair-requests"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/repair-requests"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">🛠️</span> Repair Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/transport"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/transport"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">🚚</span> Transport
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-dashboard/payments"
                  className={`flex items-center p-2 rounded-md ${
                    location.pathname === "/admin-dashboard/payments"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">💰</span> Payments
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div
          className="logout flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={handleLogout}
        >
          <span className="mr-2">←</span> Logout
        </div>
      </div>

      {/* Main Content - Payment Overview */}
      <div className="flex-1 p-8">
        {/* Payment Overview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">$12,459.00</p>
              <span className="text-green-600 mt-2">↑</span>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-orange-700">Pending</h3>
              <p className="text-3xl font-bold text-orange-900">$2,350.00</p>
              <span className="text-orange-600 mt-2">!</span>
            </div>
            <div className="bg-red-50 p-6 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-red-700">Failed</h3>
              <p className="text-3xl font-bold text-red-900">$890.00</p>
              <span className="text-red-600 mt-2">✖</span>
            </div>
          </div>
        </div>

        {/* Payment Transactions Section */}
        <div>
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Payment Transactions</h2>
            <div className="flex items-center space-x-4">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                defaultValue="All Status"
              >
                <option value="All Status">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Export Report
              </button>
              <div className="text-gray-600 cursor-pointer">👤 Profile</div>
            </div>
          </header>

          {/* Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Repair ID</th>
                  <th className="py-3 px-6 text-left">Method</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">{payment.customer}</td>
                    <td className="py-4 px-6">{payment.amount}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`${
                          payment.status === "Paid"
                            ? "text-green-600"
                            : payment.status === "Pending"
                            ? "text-orange-600"
                            : "text-red-600"
                        } font-semibold`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">{payment.date}</td>
                    <td className="py-4 px-6">{payment.repairId}</td>
                    <td className="py-4 px-6">{payment.method}</td>
                    <td className="py-4 px-6 flex space-x-2">
                      <button className="text-blue-600 hover:underline">View Receipt</button>
                      {payment.status === "Failed" && (
                        <button className="text-red-600 hover:underline">Retry Payment</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;