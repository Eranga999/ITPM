import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import ServiceCenterDashboard from './pages/ServiceCenterDashboard';
import Header from './components/Header';
import HeroSection from './components/homepageComp/HeroSection';
import ServicesSection from './components/homepageComp/ServicesSection';
import HowItWorksSection from './components/homepageComp/HowItWorksSection';
import Footer from './components/footer';
import BookingForm from './components/CustomerComponent/BookingForm';
import Tracking from './components/CustomerComponent/RepairTrackingPage';
import Homeheader from './components/homepageComp/HomeHeader';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
     <Homeheader/>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <Footer />
      

    </div>
  );
}

function App() {
  return (
    
    <Router>
      <Routes>
        {/* Default Route Redirects to Login */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Customer Dashboard */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        
        {/* Technician Dashboard */}
        <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
        
        {/* Service Center Dashboard */}
        <Route path="/service-center-dashboard" element={<ServiceCenterDashboard />} />
        
        <Route path='/booking-form' element={<BookingForm />} />
        <Route path='/tracking' element={<Tracking />} />

      </Routes>
    </Router>
  );
}

export default App;
