
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const NutriChefLogo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M20 34.5C19.5667 34.5 19.1417 34.3583 18.7833 34.075C18.425 33.7917 18.1 33.4 17.8083 32.9L10.1417 21.15C9.38333 20.0167 8.82917 18.9667 8.47917 18C8.12917 17.0333 7.95417 16.0833 7.95417 15.15C7.95417 12.9167 8.7125 11.0833 10.2292 9.65C11.7458 8.21667 13.6333 7.5 15.8917 7.5C17.125 7.5 18.2417 7.75833 19.2417 8.275C20.2417 8.79167 21.1083 9.55 21.8417 10.55C22.575 9.55 23.4417 8.79167 24.4417 8.275C25.4417 7.75833 26.5583 7.5 27.7917 7.5C30.05 7.5 31.9375 8.21667 33.4542 9.65C34.9708 11.0833 35.7292 12.9167 35.7292 15.15C35.7292 16.0833 35.5542 17.0333 35.2042 18C34.8542 18.9667 34.3 20.0167 33.5417 21.15L25.875 32.9C25.5833 33.4 25.2583 33.7917 24.9 34.075C24.5417 34.3583 24.1167 34.5 23.6833 34.5H20Z" 
          fill="#3C6142"
        />
        <path 
          d="M14 16C14 14.8954 14.8954 14 16 14H24C25.1046 14 26 14.8954 26 16V22C26 23.1046 25.1046 24 24 24H16C14.8954 24 14 23.1046 14 22V16Z" 
          fill="#FFFFFF"
        />
        <path 
          d="M17 19L23 19M17 21L21 21" 
          stroke="#3C6142" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <circle 
          cx="20" 
          cy="17" 
          r="1" 
          fill="#3C6142"
        />
      </svg>
      <span className="text-xl font-bold text-nutrition-800">NutriChef</span>
    </div>
  );
};

export default NutriChefLogo;
