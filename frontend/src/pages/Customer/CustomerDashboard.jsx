import React from "react";
import CustomerProfile from "../../components/CustomerComponent/CustomerProfile";
import CusDashboardNavigationBar from "../../components/CustomerComponent/CusDashboardNavigationBar";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import backgroundImage from '../../assets/cusdashboard.jpg'; 

const CustomerDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header */}
      <Header />

      {/* Dashboard Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <CusDashboardNavigationBar />

        {/* Main Content with Background Image */}
        <main
          className="flex-1 p-12 overflow-y-auto"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            position: 'relative',
          }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            style={{ zIndex: 1 }}
          ></div>

          {/* Content Wrapper */}
          <div className="relative z-10">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Welcome Back
              </h1>
              <p className="text-gray-200 mt-2 drop-shadow-md">
                Manage your account and services
              </p>
            </div>
            <CustomerProfile />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerDashboard;