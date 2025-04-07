import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Get customerId from localStorage
  const customerId = localStorage.getItem('customerId');

  // Fetch notifications when customerId is available
  useEffect(() => {
    if (!customerId) return; // Don't fetch if no customerId

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/notifications?customerId=${customerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
        } else {
          console.error('Failed to fetch notifications:', data.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [customerId]); // Re-run if customerId changes

  const handlebook = () => {
    console.log("Book a Repair button clicked");
    navigate('/booking-form');
  };

  const isActive = (path) => {
    return location.pathname === path ? 
      'relative text-blue-600 font-medium after:absolute after:bottom-[-5px] after:left-0 after:h-1 after:w-full after:bg-blue-500 after:rounded-full after:origin-left after:scale-x-100 after:transition-transform after:duration-300' : 
      'relative text-gray-700 after:absolute after:bottom-[-5px] after:left-0 after:h-1 after:w-full after:bg-blue-500 after:rounded-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 hover:text-blue-600';
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="EasyFix Logo" className="w-10 h-auto"/>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">EasyFix</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className={isActive('/home')}>
              Home
            </Link>
            <Link to="/customer-dashboard" className={isActive('/customer-dashboard')}>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 11a4 4 0 100-8 4 4 0 000 8zm-7 10a7 7 0 0114 0H5z" clipRule="evenodd" />
                </svg>
                <span>Customer</span>
              </div>
            </Link>
            <Link to="/tracking" className={isActive('/tracking')}>
              Track
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a3 3 0 00-6 0v.083A6 6 0 002 11v3.159c0 .538-.214 1.052-.595 1.436L0 17h5m10 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 animate-fadeIn">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification._id} className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">No notifications</p>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={handlebook} 
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
            >
              Book Now
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors duration-300 ${isMenuOpen ? 'bg-gray-200' : ''}`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden pb-4 space-y-3 animate-slideDown">
            <Link to="/home" className={`block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors duration-300 ${location.pathname === '/home' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : ''}`}>
              Home
            </Link>
            <Link to="/customer-dashboard" className={`block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors duration-300 ${location.pathname === '/customer-dashboard' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : ''}`}>
              Account
            </Link>
            <Link to="/support" className={`block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors duration-300 ${location.pathname === '/support' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : ''}`}>
              Support
            </Link>
            <button 
              onClick={handlebook}
              className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
            >
              Book Now
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
