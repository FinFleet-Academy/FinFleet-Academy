import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const FinancialDashboard = lazy(() => import('./FinancialDashboard'));

const FinancialLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initializing Intelligence Hub...</p>
  </div>
);

const FinancialRouter = () => {
  return (
    <Suspense fallback={<FinancialLoader />}>
      <Routes>
        <Route path="/" element={<FinancialDashboard />} />
        <Route path="*" element={<FinancialDashboard />} />
      </Routes>
    </Suspense>
  );
};

export default FinancialRouter;
