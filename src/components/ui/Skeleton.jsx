import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const variants = {
    rect: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'rounded h-3 w-full',
    card: 'rounded-[2.5rem] h-64',
  };

  return (
    <div className={`
      animate-pulse bg-slate-200 dark:bg-slate-800/50 
      ${variants[variant]} 
      ${className}
    `} />
  );
};

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    {[...Array(rows)].map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <Skeleton variant="card" />
);

export default Skeleton;
