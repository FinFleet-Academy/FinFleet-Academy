import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FinorToolInsight from '../../../components/shared/FinorToolInsight';

const SwpCalculator = () => {
  const navigate = useNavigate();
  const [corpus, setCorpus] = useState(10000000);
  const [withdrawal, setWithdrawal] = useState(50000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const { finalValue, totalWithdrawn, isDepleted, depletionYear, chartData, insights } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    
    let currentCorpus = corpus;
    const data = [];
    let depleted = false;
    let depYear = null;
    let totalW = 0;

    for (let i = 1; i <= years; i++) {
      let yearStartCorpus = currentCorpus;
      
      for (let m = 1; m <= 12; m++) {
        if (currentCorpus <= 0) {
          depleted = true;
          if (!depYear) depYear = i;
          break;
        }
        currentCorpus = (currentCorpus * (1 + monthlyRate)) - withdrawal;
        totalW += withdrawal;
      }

      if (currentCorpus < 0) currentCorpus = 0;

      data.push({
        year: `Year ${i}`,
        Corpus: currentCorpus
      });
    }

    const generatedInsights = [
      { type: 'insight', text: `You will withdraw a total of ₹${totalW.toLocaleString('en-IN')} over the period.` }
    ];

    if (depleted) {
      generatedInsights.push({ type: 'action', text: `Warning: Your corpus will completely deplete by Year ${depYear}. You must either reduce your withdrawal amount or aim for a higher return.` });
    } else {
      generatedInsights.push({ type: 'tip', text: `Great! Your corpus survives the ${years} year period and leaves a legacy of ₹${currentCorpus.toLocaleString('en-IN', {maximumFractionDigits:0})}.` });
    }

    // Rule of thumb: Safe withdrawal rate is typically 4%
    const safeWithdrawal = corpus * 0.04 / 12;
    if (withdrawal > safeWithdrawal * 1.5) {
      generatedInsights.push({ type: 'action', text: `Your withdrawal rate is highly aggressive compared to the standard 4% rule (₹${safeWithdrawal.toLocaleString('en-IN', {maximumFractionDigits:0})}/mo).` });
    }

    return {
      finalValue: currentCorpus,
      totalWithdrawn: totalW,
      isDepleted: depleted,
      depletionYear: depYear,
      chartData: data,
      insights: generatedInsights
    };
  }, [corpus, withdrawal, rate, years]);

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left: Inputs */}
          <div className="w-full lg:w-1/3 space-y-8">
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">SWP Calculator</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Systematic Withdrawal Plan</p>
                 </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Corpus</label>
                     <span className="text-xl font-black dark:text-white">₹{corpus.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={500000} max={50000000} step={100000} value={corpus} onChange={(e) => setCorpus(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Withdrawal</label>
                     <span className="text-xl font-black dark:text-white">₹{withdrawal.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={1000} max={500000} step={1000} value={withdrawal} onChange={(e) => setWithdrawal(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected Return</label>
                     <span className="text-xl font-black dark:text-white">{rate}% p.a</span>
                  </div>
                  <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Period</label>
                     <span className="text-xl font-black dark:text-white">{years} Years</span>
                  </div>
                  <input type="range" min={1} max={50} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-500" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Outputs & Charts */}
          <div className="w-full lg:w-2/3 space-y-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Withdrawn</p>
                <p className="text-3xl font-black text-emerald-500">₹{totalWithdrawn.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className={`rounded-[2rem] p-8 shadow-xl text-center text-white relative overflow-hidden ${isDepleted ? 'bg-rose-600' : 'bg-slate-800 dark:bg-white dark:text-slate-900'}`}>
                {isDepleted && <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20 -mr-16 -mt-16" />}
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDepleted ? 'text-rose-100' : 'text-slate-400'}`}>Final Corpus Value</p>
                <p className="text-3xl font-black">₹{finalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                {isDepleted && <p className="text-[10px] font-bold mt-2 uppercase tracking-widest text-white">Depleted in Year {depletionYear}</p>}
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
              <h3 className="text-xs font-black dark:text-white uppercase tracking-widest mb-8">Corpus Depletion Graph</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDepleted ? "#e11d48" : "#10b981"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isDepleted ? "#e11d48" : "#10b981"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <Area type="monotone" dataKey="Corpus" stroke={isDepleted ? "#e11d48" : "#10b981"} strokeWidth={3} fillOpacity={1} fill="url(#colorCorpus)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <FinorToolInsight insights={insights} isLoading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwpCalculator;
