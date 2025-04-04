import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import React Router hooks
import { FaUser, FaClipboardList, FaTools, FaHeadset, FaCog, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const CusDashboardNavigationBar = () => {
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // For programmatic navigation (e.g., logout)

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="w-72 bg-gray-900 bg-opacity-90 shadow-lg flex flex-col h-screen">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="EasyFix" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-bold text-white">Dashboard</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col py-6 space-y-2 px-4 flex-1">
        {[
          { icon: FaUser, text: 'Profile', path: '/customer-dashboard' },
          { icon: FaClipboardList, text: 'Edit Bookings', path: '/edit-booking' },
          { icon: FaTools, text: 'Repair history', path: '/repair-history' },
          { icon: FaHeadset, text: 'Support', path: '/support' },
          { icon: FaCog, text: 'Settings', path: '/settings' },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-300 group ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon
              className={`text-xl ${
                location.pathname === item.path ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'
              }`}
            />
            <span className="text-base font-medium">{item.text}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default CusDashboardNavigationBar;
