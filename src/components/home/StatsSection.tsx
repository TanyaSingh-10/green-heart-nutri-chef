
import React from 'react';
import { Check } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
    <h3 className="text-3xl md:text-4xl font-bold text-nutrition-600 mb-2">{value}</h3>
    <p className="text-gray-600">{label}</p>
  </div>
);

const CertificationItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center mb-3">
    <div className="rounded-full bg-nutrition-100 p-1 mr-3">
      <Check className="h-4 w-4 text-nutrition-600" />
    </div>
    <span className="text-gray-700">{text}</span>
  </div>
);

const StatsSection: React.FC = () => {
  const stats = [
    { value: "200+", label: "Diets created" },
    { value: "500+", label: "Satisfied clients" },
    { value: "600+", label: "Meals planned" },
    { value: "2,500+", label: "Hours of expertise" }
  ];

  const certifications = [
    "Certified",
    "Innovative",
    "Experienced",
    "Compassionate"
  ];

  return (
    <section id="about" className="py-20 bg-nutrition-50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          label="About" 
          heading="Wanna stay fit & healthy?"
          subheading="Our team of qualified diet consultants focuses on creating personalized meal plans that help you achieve your health goals while enjoying delicious, nutrient-rich foods."
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={index} value={stat.value} label={stat.label} />
          ))}
        </div>

        {/* About Content */}
        <div className="flex flex-col md:flex-row items-center">
          {/* Image */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=2070&auto=format&fit=crop"
                alt="Nutritionist working with client" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Text and Certifications */}
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Nutritional Approach</h3>
            <p className="text-gray-600 mb-6">
              We understand that nutrition is not one-size-fits-all. Our approach focuses on sustainable dietary changes
              that fit your lifestyle while providing optimal nutritional value. We combine the latest research with practical
              solutions for real-world eating habits.
            </p>

            <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Certifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {certifications.map((cert, index) => (
                <CertificationItem key={index} text={cert} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
