import React from 'react';

const Badge = ({ children, variant = 'indigo', className = '' }) => {
  const variants = {
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-600 border-red-500/20',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    slate: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };

  return (
    <span className={`
      px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
