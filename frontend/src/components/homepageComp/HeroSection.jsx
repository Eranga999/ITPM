import React from 'react';
import { useNavigate } from 'react-router-dom';
import technician2 from '../../assets/technician2.jpg';
import cusreview from '../../assets/cusreview.jpg';
import Customer2 from '../../assets/customer2.png';
import Customer3 from '../../assets/customer3.png';

function HeroSection() {
  const navigate = useNavigate();

  const handleBookClick = () => {
    console.log("Book a Repair button clicked"); // Debug log
    navigate('/booking-form'); // Matches App.jsx route
  };

  return (
    <section className="relative bg-gray-900 text-white min-h-[700px] flex items-center">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-gray-900/70 to-black/80 z-10"></div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-90 filter"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      ></div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-12 right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-xl animate-floating"></div>
      <div className="absolute bottom-12 left-12 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-floating delay-1000"></div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 relative z-20">
        <div className="flex flex-col md:flex-row items-center md:justify-between">
          {/* Left Side: Text & CTA */}
          <div className="max-w-lg text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Fast & Reliable <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Appliance Repairs</span>
            </h1>

            <p className="text-lg text-gray-300 animate-fade-in">
              Book expert repairs for all home appliances. Get quick, professional service at your doorstep!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBookClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Book a Repair
              </button>
              <button className="border-2 border-white hover:bg-blue-600 hover:border-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300">
               Instant Fix mode
              </button>
            </div>

            {/* Customer Ratings */}
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex -space-x-3">
                <img className="w-12 h-12 rounded-full border-2 border-white shadow-md animate-pulse-slow" src={cusreview} alt="Customer 1" />
                <img className="w-12 h-12 rounded-full border-2 border-white shadow-md animate-pulse-slow" src={Customer2} alt="Customer 2" />
                <img className="w-12 h-12 rounded-full border-2 border-white shadow-md animate-pulse-slow" src={Customer3} alt="Customer 3" />
              </div>
              <div className="flex items-center bg-blue-500/20 px-4 py-1 rounded-full">
                <span className="text-sm font-bold text-white">4.9/5</span>
                <span className="text-sm text-gray-200 ml-1">from 2,000+ happy customers</span>
              </div>
            </div>
          </div>

          {/* Technician Image */}
          <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
            <img
              src={technician2}
              alt="Technician Repairing Appliance"
              className="w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-xl shadow-lg border-4 border-gray-800"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Custom Animations
const styles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes floating { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
  .animate-fade-in { animation: fadeIn 1.5s ease-in-out; }
  .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
  .animate-floating { animation: floating 6s infinite ease-in-out; }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default HeroSection;