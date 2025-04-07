import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Custom active link styles with animation
  const isActive = (path) => {
    if (location.pathname === path) {
      return "relative text-blue-600 font-medium before:content-[''] before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-full before:bg-blue-600 before:transform";
    } else {
      return "relative text-gray-700 hover:text-blue-600 before:content-[''] before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-full before:scale-x-0 before:bg-blue-600 before:transform before:transition-transform before:duration-300 hover:before:scale-x-100 before:origin-left transition-colors duration-200";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="EasyFix Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">EasyFix</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/home" 
              className={isActive('/home')}
            >
              Home
            </Link>
            <Link 
              to="/booking-form" 
              className={isActive('/booking-form')}
            >
              Book Repair
            </Link>
            <Link 
              to="/support" 
              className={isActive('/support')}
            >
              Support
            </Link>
            <Link 
              to="/customer-dashboard" 
              className={isActive('/customer-dashboard')}
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Account</span>
              </div>
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition-all duration-300 ${isMenuOpen ? 'bg-gray-200' : ''}`}
          >
            <svg className={`h-6 w-6 transform transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <nav className="mt-4 md:hidden pb-4 space-y-3 opacity-0 transform -translate-y-3 animate-[slideDown_0.3s_ease_forwards]">
            <Link 
              to="/home" 
              className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 ${location.pathname === '/home' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600 pl-6' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/booking-form" 
              className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 ${location.pathname === '/booking-form' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600 pl-6' : ''}`}
            >
              Book Repair
            </Link>
            
            <Link 
              to="/support" 
              className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 ${location.pathname === '/support' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600 pl-6' : ''}`}
            >
              Support
            </Link>
            <Link 
              to="/customer-dashboard" 
              className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 ${location.pathname === '/customer-dashboard' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600 pl-6' : ''}`}
            >
              Account
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;