
import React from 'react';

interface SectionHeadingProps {
  label: string;
  heading: string;
  subheading?: string;
  centered?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  label, 
  heading, 
  subheading, 
  centered = false 
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <p className="section-label">{label}</p>
      <h2 className="section-heading">{heading}</h2>
      {subheading && <p className="section-subheading mx-auto">{subheading}</p>}
    </div>
  );
};

export default SectionHeading;
