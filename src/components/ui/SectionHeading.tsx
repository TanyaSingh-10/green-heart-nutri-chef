
import React from 'react';

interface SectionHeadingProps {
  label: string;
  heading: string;
  subheading?: string;
  centered?: boolean;
  className?: string;
  subheadingClassName?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  heading,
  subheading,
  centered = false,
  className = '',
  subheadingClassName = '',
}) => {
  // Check if this is the contact section subheading
  const isHealthyJourneyText = subheading === "Start your healthy journey today";
  
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <p className="section-label">{label}</p>
      <h2 className="section-heading">{heading}</h2>
      {subheading && (
        <p className={`section-subheading mx-auto ${
          isHealthyJourneyText ? 'text-nutrition-600 font-medium' : ''
        } ${subheadingClassName}`}>
          {subheading}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
