import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'bg-blue-100 text-blue-600' : 'text-gray-700';

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
              className={`font-medium hover:text-blue-600 transition-colors duration-200 ${isActive('/home')}`}
            >
              Home
            </Link>
            <Link 
              to="/booking-form" 
              className={`font-medium hover:text-blue-600 transition-colors duration-200 ${isActive('/booking-form')}`}
            >
              Book Repair
            </Link>
            <Link 
              to="/support" 
              className={`font-medium hover:text-blue-600 transition-colors duration-200 ${isActive('/support')}`}
            >
              Support
            </Link>
            <Link 
              to="/customer-dashboard" 
              className={`flex items-center space-x-2 font-medium hover:text-blue-600 transition-colors duration-200 ${isActive('/customer-dashboard')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Account</span>
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none ${isMenuOpen ? 'bg-gray-200' : ''}`}
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
            <Link 
              to="/home" 
              className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg ${location.pathname === '/home' ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/booking-form" 
              className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg ${location.pathname === '/booking-form' ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              Book Repair
            </Link>
            
            <Link 
              to="/support" 
              className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg ${location.pathname === '/support' ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              Support
            </Link>
            <Link 
              to="/customer-dashboard" 
              className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg ${location.pathname === '/customer-dashboard' ? 'bg-blue-100 text-blue-600' : ''}`}
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
