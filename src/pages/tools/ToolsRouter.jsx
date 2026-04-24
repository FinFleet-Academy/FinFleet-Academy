import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const ToolsDashboard = lazy(() => import('./ToolsDashboard'));
const SipCalculator = lazy(() => import('./calculators/SipCalculator'));
const EmiCalculator = lazy(() => import('./calculators/EmiCalculator'));
const CompoundInterestCalculator = lazy(() => import('./calculators/CompoundInterestCalculator'));
const FdCalculator = lazy(() => import('./calculators/FdCalculator'));
const InflationCalculator = lazy(() => import('./calculators/InflationCalculator'));
const CagrCalculator = lazy(() => import('./calculators/CagrCalculator'));
const SwpCalculator = lazy(() => import('./calculators/SwpCalculator'));
const SipLumpsumComparator = lazy(() => import('./calculators/SipLumpsumComparator'));
const RetirementPlanner = lazy(() => import('./calculators/RetirementPlanner'));
const CurrencyConverter = lazy(() => import('./calculators/CurrencyConverter'));

const ToolsLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-brand-500/10 border-t-brand-600 rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Tool...</p>
  </div>
);

const ToolsRouter = () => {
  return (
    <Suspense fallback={<ToolsLoader />}>
      <Routes>
        <Route path="/" element={<ToolsDashboard />} />
        <Route path="/sip" element={<SipCalculator />} />
        <Route path="/emi" element={<EmiCalculator />} />
        <Route path="/compound" element={<CompoundInterestCalculator />} />
        <Route path="/fd" element={<FdCalculator />} />
        <Route path="/inflation" element={<InflationCalculator />} />
        <Route path="/cagr" element={<CagrCalculator />} />
        <Route path="/swp" element={<SwpCalculator />} />
        <Route path="/compare" element={<SipLumpsumComparator />} />
        <Route path="/retirement" element={<RetirementPlanner />} />
        <Route path="/currency" element={<CurrencyConverter />} />
        <Route path="*" element={<ToolsDashboard />} />
      </Routes>
    </Suspense>
  );
};

export default ToolsRouter;
