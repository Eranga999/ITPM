import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import CustomerDashboard from './pages/CustomerDashboard';
import TechnicianDashboard from './pages/Technician/TechnicianDashboard';

import Header from './components/Header';
import HeroSection from './components/homepageComp/HeroSection';
import ServicesSection from './components/homepageComp/ServicesSection';
import HowItWorksSection from './components/homepageComp/HowItWorksSection';
import homeheader from './components/homepageComp/homeheader';
import Footer from './components/footer';
import BookingForm from './components/CustomerComponent/BookingForm';
import Tracking from './components/CustomerComponent/RepairTrackingPage';
import PendingJobs from './pages/Technician/PendingJobs';
import UrgentRepairs from './pages/Technician/UrgentRepairs';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ServiceCenters from './pages/Admin/AdminServiceCenters';


function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <Footer />
      <homeheader/>

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
        
        {/* Service Center Dashboard */}
        
        
        <Route path='/booking-form' element={<BookingForm />} />
        <Route path='/tracking' element={<Tracking />} />
        <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
        <Route path="/technician-dashboard/pending-jobs" element={<PendingJobs />} />
        <Route path="/technician-dashboard/urgent-repairs" element={<UrgentRepairs />} />
        <Route path="/admin-dashboard" element={< AdminDashboard/>} />
        <Route path="/admin-dashboard/service-centers" element={<ServiceCenters />} />

      </Routes>
    </Router>
  );
}

export default App;
