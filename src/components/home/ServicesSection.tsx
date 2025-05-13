
import React from 'react';
import SectionHeading from '../ui/SectionHeading';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imageSrc }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group">
    <div className="h-48 overflow-hidden">
      <img 
        src={imageSrc} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a 
        href="#" 
        className="inline-flex items-center text-nutrition-600 font-medium hover:text-nutrition-700 transition-colors"
      >
        Learn more
        <ArrowRight className="ml-1 h-4 w-4" />
      </a>
    </div>
  </div>
);

const ServicesSection: React.FC = () => {
  const services = [
    {
      title: "Detox and cleanse programs",
      description: "Reset your body with our scientifically-designed detox programs that eliminate toxins while providing essential nutrients.",
      imageSrc: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Nutritional coaching",
      description: "Ongoing guidance and accountability to help you navigate dietary challenges and build sustainable healthy eating habits.",
      imageSrc: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Custom diet plan",
      description: "Personalized meal plans tailored to your specific health goals, food preferences, and lifestyle needs.",
      imageSrc: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          label="Services" 
          heading="How we can help you" 
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              title={service.title} 
              description={service.description} 
              imageSrc={service.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
