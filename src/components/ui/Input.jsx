import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        )}
        <input
          className={`
            w-full bg-slate-50 dark:bg-slate-950 
            border border-slate-200 dark:border-slate-800 
            rounded-2xl py-4 pr-6 text-xs font-bold
            placeholder:text-slate-400 outline-none 
            focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50
            transition-all
            ${Icon ? 'pl-12' : 'pl-6'}
            ${error ? 'border-red-500 ring-red-500/5' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[9px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-wider">{error}</p>
      )}
    </div>
  );
};

export default Input;
