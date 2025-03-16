import React from "react";
import Header from "../components/homepageComp/HomeHeader";
import HeroSection from "../components/homepageComp/HeroSection";
import ServicesSection from "../components/homepageComp/ServicesSection";
import HowItWorksSection from "../components/homepageComp/HowItWorksSection";
import Footer from "../components/footer";
function Homepage() {
return(

<div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <Footer />
    </div>

 );


}
export default Homepage;