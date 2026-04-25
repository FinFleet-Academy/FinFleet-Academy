import React from 'react';

/**
 * 💎 FinFleet Premium Brand Logo
 * High-fidelity SVG recreation of the custom 'F' winged insignia.
 */
const BrandLogo = ({ className = "w-8 h-8", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Wing (Top Part) */}
      <path 
        d="M25 80V25C25 15 35 10 45 10H65C85 10 90 25 75 35C65 40 55 40 45 40" 
        stroke={color} 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Inner Wing (Middle Part) */}
      <path 
        d="M45 70V55C45 50 50 48 55 48H65C75 48 80 55 70 60C65 63 60 63 55 63" 
        stroke={color} 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
};

export default BrandLogo;
