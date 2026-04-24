import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinorToolInsight from '../../../components/shared/FinorToolInsight';

const CagrCalculator = () => {
  const navigate = useNavigate();
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(500000);
  const [years, setYears] = useState(10);

  const { cagr, absoluteReturn, insights } = useMemo(() => {
    // CAGR = (FV/PV)^(1/t) - 1
    const cagrValue = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    const absolute = ((finalValue - initialValue) / initialValue) * 100;

    const generatedInsights = [
      { type: 'insight', text: `Your investment has grown at a Compound Annual Growth Rate (CAGR) of ${cagrValue.toFixed(2)}%.` },
      { type: 'insight', text: `The absolute point-to-point return is ${absolute.toFixed(2)}%.` }
    ];

    if (cagrValue < 6) generatedInsights.push({ type: 'action', text: "Your CAGR is lower than typical inflation. Re-evaluate your asset allocation to protect your wealth." });
    if (cagrValue > 15) generatedInsights.push({ type: 'tip', text: "Excellent performance! A CAGR >15% over long periods is considered exceptional in equity markets." });

    return {
      cagr: cagrValue,
      absoluteReturn: absolute,
      insights: generatedInsights
    };
  }, [initialValue, finalValue, years]);

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/3 space-y-8">
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <PieChart className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">CAGR Calculator</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annualized Returns</p>
                 </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Initial Value</label>
                     <span className="text-xl font-black dark:text-white">₹{initialValue.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={10000} max={10000000} step={10000} value={initialValue} onChange={(e) => setInitialValue(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Final Value</label>
                     <span className="text-xl font-black dark:text-white">₹{finalValue.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={initialValue} max={initialValue * 10} step={10000} value={finalValue} onChange={(e) => setFinalValue(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Period</label>
                     <span className="text-xl font-black dark:text-white">{years} Years</span>
                  </div>
                  <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/3 space-y-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-500 rounded-[2rem] p-8 shadow-xl shadow-amber-500/20 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20 -mr-16 -mt-16" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-amber-100">CAGR</p>
                <p className="text-4xl font-black">{cagr.toFixed(2)}%</p>
                <p className="text-xs text-amber-100 mt-2">Compound Annual Growth Rate</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Absolute Return</p>
                <p className="text-4xl font-black text-emerald-500">{absoluteReturn.toFixed(2)}%</p>
                <p className="text-xs text-slate-500 mt-2">Point to point total return</p>
              </div>
            </motion.div>

            <FinorToolInsight insights={insights} isLoading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CagrCalculator;
