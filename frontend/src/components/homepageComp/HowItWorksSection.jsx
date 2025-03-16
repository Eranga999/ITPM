import React from 'react';
import technician from '../../assets/technician.jpg';
import { useNavigate } from 'react-router-dom';
const steps = [
  {
    icon: '📱',
    title: 'Book Online',
    description: 'Schedule a repair appointment online in just 2 minutes',
  },
  {
    icon: '🧪',
    title: 'Diagnosis',
    description: 'Our expert technician will diagnose the issue accurately',
  },
  {
    icon: '🛠️',
    title: 'Repair',
    description: 'Quick and professional repair with quality parts',
  },
  {
    icon: '✅',
    title: 'Guarantee',
    description: '90-day guarantee on all our repairs',
  },
];

function HowItWorksSection() {
  const usenavigate = useNavigate();
  const buttonclicked = ()=>{
    console.log('Book a Repair button clicked');
    usenavigate('/booking-form')
  }
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Process</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">How EasyFix Works</h2>
          <p className="text-gray-600">
            We've simplified the repair process to save you time and hassle
          </p>
        </div>
        
        <div className="relative">
          {/* Progress line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-100 -translate-x-1/2"></div>
          
          <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number for desktop */}
                <div className="hidden lg:flex absolute -left-4 lg:left-1/2 lg:-translate-x-1/2 top-0 w-8 h-8 bg-blue-600 text-white rounded-full items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 lg:text-center relative z-10 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                  {/* Step number for mobile */}
                  <div className="flex lg:hidden items-center mb-4">
                    <div className="flex w-8 h-8 bg-blue-600 text-white rounded-full items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  
                  <div className="hidden lg:block text-5xl mb-6 mx-auto">{step.icon}</div>
                  <h3 className="hidden lg:block text-xl font-semibold mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 lg:text-center">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 bg-blue-600 text-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 md:w-2/3">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to fix your appliance?</h3>
              <p className="mb-6 text-blue-100">Book a repair appointment today and get 10% off for new customers.</p>
              <button  onClick={buttonclicked}className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium shadow-md transition-colors duration-200">
                Book a Repair Now
              </button>
            </div>
            <div className="md:w-1/3 p-8 md:p-0">
              <img 
                src={technician} 
                alt="Technician" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;