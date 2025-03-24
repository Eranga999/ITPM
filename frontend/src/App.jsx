import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CustomerDashboard from './pages/Customer/CustomerDashboard'
import TechnicianDashboard from './pages/Technician/TechnicianDashboard';
import HeroSection from './components/homepageComp/HeroSection';
import ServicesSection from './components/homepageComp/ServicesSection';
import HowItWorksSection from './components/homepageComp/HowItWorksSection';
import Footer from './components/footer';
import BookingForm from './components/CustomerComponent/BookingForm';
import Tracking from './components/CustomerComponent/RepairTrackingPage';
import Homeheader from './components/homepageComp/HomeHeader';
import RepairChanges from './components/CustomerComponent/RepairChange';
import Support from './pages/Customer/Support';
import PendingJobs from './pages/Technician/PendingJobs';
import UrgentRepairs from './pages/Technician/UrgentRepairs';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ServiceCenters from './pages/Admin/AdminServiceCenters';
import Technicians from './pages/Admin/AdminTechnicians';
import RepairRequests from './pages/Admin/AdminRepairRequests';
import Transport from './pages/Admin/AdminTransport';
import Payments from './pages/Admin/AdminPayments';
import CompletedJobs from "./pages/Technician/CompletedJobs";
import ServiceCenterDashboard from './pages/ServiceCenter/ServiceCenterDashboard';
import CustomerLogin from './pages/Customer/CustomerLogin';
import CustomerSignup from './pages/Customer/CustomerSignup';
import StaffLogin from './pages/StaffLogin';
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

        <Route path="/staff-login" element={<StaffLogin />} />
        
        {/* Customer Dashboard */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-signup" element={<CustomerSignup />} />
        <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
        
        <Route path='/booking-form' element={<BookingForm />} />
        <Route path='/tracking' element={<Tracking />} />
        <Route path="/edit-booking" element={<RepairChanges />} />
        <Route path="/support" element={<Support />} />

        <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
        <Route path="/technician-dashboard/pending-jobs" element={<PendingJobs />} />
        <Route path="/technician-dashboard/completed-jobs" element={<CompletedJobs />} />
        <Route path="/technician-dashboard/urgent-repairs" element={<UrgentRepairs />} />


        <Route path="/admin-dashboard" element={< AdminDashboard/>} />
        <Route path="/admin-dashboard/service-centers" element={<ServiceCenters />} />
        <Route path="/admin-dashboard/technicians" element={<Technicians />} />
        <Route path="/admin-dashboard/repair-requests" element={<RepairRequests />} />
        <Route path="/admin-dashboard/transport" element={<Transport />} />
        <Route path="/admin-dashboard/payments" element={<Payments />} />

        <Route path="/service-center-dashboard" element={<ServiceCenterDashboard />} />
       
     

      </Routes>
    </Router>
  );
}

export default App;