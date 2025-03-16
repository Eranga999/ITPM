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
            <img src={logo} alt="EasyFix Logo" className="h-25 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">EasyFix</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">Home</Link>
            <Link to="/customer-dashboard" className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">dashboard</Link>
            <Link to="/tracking" className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">Track</Link>
            <Link to="/support" className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">Support</Link>
            <Link to="/profile" className="flex items-center space-x-2 font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Account</span>
            </Link >
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-md">
              Book Now
            </button>
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
            <Link to="/book" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">Book Repair</Link>
            <Link to="/track" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">Track Order</Link>
            <Link to="/support" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">Support</Link>
            <Link to="/profile" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">Account</Link>
            <button className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-md">
              Book Now
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
