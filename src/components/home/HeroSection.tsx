
import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 pr-0 lg:pr-12 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Start eating <span className="text-nutrition-600">healthy</span> today
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Expert nutritional guidance tailored to your unique goals and lifestyle. 
              Create sustainable eating habits that nourish your body and mind.
            </p>
            <a 
              href="#contact" 
              className="inline-flex items-center bg-nutrition-600 hover:bg-nutrition-700 text-white font-medium py-3 px-6 rounded-full transition-colors duration-300 btn-hover"
            >
              Contact us
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          
          {/* Right Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="/images/hero-image.jpg" 
                alt="Nutritious food bowl" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop";
                }}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-nutrition-100 rounded-full -z-10 hidden md:block"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-nutrition-50 rounded-full -z-10 hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
