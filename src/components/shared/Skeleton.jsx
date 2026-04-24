import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 space-y-6">
    <Skeleton className="h-48 w-full rounded-2xl" />
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="flex justify-between items-center pt-4">
      <Skeleton className="h-10 w-24 rounded-xl" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
