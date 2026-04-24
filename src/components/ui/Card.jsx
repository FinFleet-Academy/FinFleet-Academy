import React from 'react';

const Card = ({ children, className = '', hover = true, padding = 'p-8' }) => {
  return (
    <div className={`
      bg-white dark:bg-slate-900 
      border border-slate-200/60 dark:border-slate-800/60 
      rounded-[2.5rem] 
      shadow-sm 
      transition-all duration-500
      ${hover ? 'hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1' : ''}
      ${padding}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
