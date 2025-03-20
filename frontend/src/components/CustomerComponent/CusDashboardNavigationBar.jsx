// CusDashboardNavigationBar.jsx
import React from 'react';
import { FaUser, FaClipboardList, FaTools, FaHeadset, FaCog, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const CusDashboardNavigationBar = () => {
  return (
    <div className="w-72 bg-gray-900 bg-opacity-90 shadow-lg flex flex-col h-screen">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="EasyFix" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-bold text-white">Dashboard</span>
        </div>
      </div>
      
      {/* Navigation Links - Make this stretch to fill remaining space */}
      <nav className="flex flex-col py-6 space-y-2 px-4 flex-1">
        {[
          { icon: FaUser, text: 'Profile', href: '#' },
          { icon: FaClipboardList, text: 'Edit Bookings', href: '/edit-booking/:id' },
          { icon: FaTools, text: 'Repair history', href: '#' },
          { icon: FaHeadset, text: 'Support', href: '/support' },
          { icon: FaCog, text: 'Settings', href: '#' },
        ].map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-800 hover:text-white text-gray-300 transition-all duration-300 group"
          >
            <item.icon className="text-xl text-blue-400 group-hover:text-blue-300" />
            <span className="text-base font-medium">{item.text}</span>
          </a>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default CusDashboardNavigationBar;