import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link to="/" className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">Login</Link>
            <Link to="/customer-signup" className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">Signup</Link>
            <Link  to="/staff-login"  className="flex items-center space-x-2 font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-6 h-6" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12 11a4 4 0 100-8 4 4 0 000 8zm-8 9a8 8 0 1116 0H4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>Staff</span>
            </Link>

      
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
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
          <nav className="mt-4 md:hidden pb-4 space-y-3">
            <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">Home</Link>
            <Link to="/booking-form" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">Book Repair</Link>
            <Link to="/support" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">Support</Link>
            <Link to="/customer-dashboard" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">Account</Link>

          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
