
import React from 'react';
import SectionHeading from '../ui/SectionHeading';

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          label="Testimonial" 
          heading="We provide the most enjoyable experience" 
          centered
        />

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12">
          {/* Testimonial */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl p-8 shadow-lg relative border border-nutrition-100">
              {/* Quote mark */}
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-nutrition-600 text-white flex items-center justify-center rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 9H6C6 15 10 16 10 16V21H3V16C3 11 6 6 11 6V9H10ZM22 9H18C18 15 22 16 22 16V21H15V16C15 11 18 6 23 6V9H22Z" fill="currentColor" />
                </svg>
              </div>
              
              <div className="mb-6 text-lg text-gray-700 italic">
                "Working with the GreenHeart nutrition team completely transformed my relationship with food. Their personalized approach and constant support helped me achieve my weight goals while still enjoying delicious meals. I've never felt better!"
              </div>
              
              <div className="flex items-center">
                <div className="h-12 w-12 mr-4 rounded-full overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/women/54.jpg" 
                    alt="Sarah Johnson" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Lost 15kg in 6 months</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Food Image */}
          <div className="w-full lg:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg h-full">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop" 
                alt="Healthy salad with protein" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
