import React from 'react';

/**
 * 💎 FinFleet Premium Brand Logo
 * High-fidelity SVG recreation of the custom 'F' winged insignia.
 */
const BrandLogo = ({ className = "h-8", alt = "FinFleet Logo" }) => {
  return (
    <img 
      src="/finfleet-logo.png" 
      alt={alt}
      className={`${className} object-contain`}
      style={{ height: 'inherit' }}
    />
  );
};

export default BrandLogo;
