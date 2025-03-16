import React from 'react';

const services = [
  {
    icon: '❄️',
    title: 'AC Repair',
    description: 'Expert AC repair and maintenance services for all brands',
    popular: true,
  },
  {
    icon: '🧊',
    title: 'Refrigerator',
    description: 'Keep your food fresh with our quick fridge repair service',
    popular: false,
  },
  {
    icon: '📺',
    title: 'TV Repair',
    description: 'Professional TV and entertainment system repairs and setup',
    popular: false,
  },
  {
    icon: '🍳',
    title: 'Kitchen Appliances',
    description: 'Comprehensive repairs for all your kitchen equipment',
    popular: false,
  },
];

function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Professional Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Our Repair Services</h2>
          <p className="text-gray-600">
            We repair all major home appliances with same-day service available. 
            All repairs come with a 90-day guarantee on parts and labor.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-100 relative overflow-hidden"
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center group-hover:underline">
                Learn More
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;