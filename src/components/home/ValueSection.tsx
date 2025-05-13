
import React from 'react';
import { User, BarChart, ThumbsUp } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-6 text-center">
    <div className="w-16 h-16 rounded-full bg-nutrition-100 flex items-center justify-center mb-4">
      <div className="text-nutrition-600">{icon}</div>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ValueSection: React.FC = () => {
  const values = [
    {
      icon: <User size={28} />,
      title: "Personalized Approach",
      description: "We create individualized nutrition plans based on your unique body, goals, and lifestyle factors."
    },
    {
      icon: <BarChart size={28} />,
      title: "Support and Motivation",
      description: "Regular check-ins and adjustments to keep you accountable and motivated throughout your journey."
    },
    {
      icon: <ThumbsUp size={28} />,
      title: "Visible Results",
      description: "Our clients see measurable improvements in energy, weight management, and overall wellbeing."
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-nutrition-50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          label="Why us?" 
          heading="Years of experience" 
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <ValueCard 
              key={index} 
              icon={value.icon} 
              title={value.title} 
              description={value.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
