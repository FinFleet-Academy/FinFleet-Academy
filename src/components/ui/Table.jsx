import React from 'react';

const Table = ({ headers, children, className = '', mobileCard = true }) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {headers.map((header, i) => (
                <th 
                  key={i} 
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {children}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Optional Card-based or Scrollable) */}
      <div className="md:hidden">
        {mobileCard ? (
          <div className="space-y-4">
            {children}
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[600px]">
              {/* Same header as desktop for scrollable mobile table */}
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {headers.map((header, i) => (
                    <th key={i} className="px-4 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{children}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const TableRow = ({ children, className = '', onClick }) => (
  <tr 
    onClick={onClick}
    className={`
      group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 
      ${onClick ? 'cursor-pointer' : ''} 
      ${className}
    `}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = '', label }) => (
  <td className={`px-6 py-5 text-[11px] font-bold text-slate-600 dark:text-slate-300 ${className}`}>
    {children}
  </td>
);

export default Table;
