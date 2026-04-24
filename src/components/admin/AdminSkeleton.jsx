import React from 'react';

export const TableSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border-b border-slate-800/30">
        <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-800 rounded w-1/4" />
          <div className="h-2 bg-slate-800 rounded w-1/3 opacity-50" />
        </div>
        <div className="w-24 h-4 bg-slate-800 rounded-lg" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="animate-pulse w-full h-[350px] bg-slate-900/50 rounded-[3rem] border border-slate-800 flex items-center justify-center">
    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 animate-pulse">Aggregating Data...</div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="animate-pulse bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 h-40 space-y-4">
    <div className="w-10 h-10 bg-slate-800 rounded-xl" />
    <div className="space-y-2">
      <div className="h-3 bg-slate-800 rounded w-1/2" />
      <div className="h-6 bg-slate-800 rounded w-3/4" />
    </div>
  </div>
);
