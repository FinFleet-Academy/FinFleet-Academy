import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FinorToolInsight from '../../../components/shared/FinorToolInsight';

const InflationCalculator = () => {
  const navigate = useNavigate();
  const [currentAmount, setCurrentAmount] = useState(1000000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const { futureEquivalent, lossInPurchasingPower, chartData, insights } = useMemo(() => {
    // How much you need in the future to have the same purchasing power
    const futureAmountNeeded = currentAmount * Math.pow(1 + (inflationRate / 100), years);
    
    // What the current amount will be worth in today's terms in the future
    const futureValueInTodayTerms = currentAmount / Math.pow(1 + (inflationRate / 100), years);
    
    const loss = currentAmount - futureValueInTodayTerms;

    const data = [];
    for (let i = 0; i <= years; i++) {
      data.push({
        year: `Year ${i}`,
        'Value Needed': currentAmount * Math.pow(1 + (inflationRate / 100), i),
        'Purchasing Power': currentAmount / Math.pow(1 + (inflationRate / 100), i),
      });
    }

    const generatedInsights = [
      { type: 'insight', text: `To buy what ₹${currentAmount.toLocaleString('en-IN')} buys today, you will need ₹${futureAmountNeeded.toLocaleString('en-IN', {maximumFractionDigits:0})} in ${years} years.` },
      { type: 'action', text: `Your ₹${currentAmount.toLocaleString('en-IN')} will effectively feel like ₹${futureValueInTodayTerms.toLocaleString('en-IN', {maximumFractionDigits:0})} due to a loss of ${((loss/currentAmount)*100).toFixed(1)}% in purchasing power.` }
    ];

    if (inflationRate > 5) generatedInsights.push({ type: 'tip', text: "High inflation erodes wealth fast. Ensure your portfolio returns at least " + (inflationRate + 3) + "% to generate real wealth." });

    return {
      futureEquivalent: futureAmountNeeded,
      lossInPurchasingPower: loss,
      currentValueInFuture: futureValueInTodayTerms,
      chartData: data,
      insights: generatedInsights
    };
  }, [currentAmount, inflationRate, years]);

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/3 space-y-8">
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">Inflation Adjuster</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Purchasing Power Calculator</p>
                 </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Amount</label>
                     <span className="text-xl font-black dark:text-white">₹{currentAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={10000} max={20000000} step={10000} value={currentAmount} onChange={(e) => setCurrentAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected Inflation</label>
                     <span className="text-xl font-black dark:text-white">{inflationRate}% p.a</span>
                  </div>
                  <input type="range" min={1} max={15} step={0.1} value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Period</label>
                     <span className="text-xl font-black dark:text-white">{years} Years</span>
                  </div>
                  <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/3 space-y-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Value Needed in Future</p>
                <p className="text-3xl font-black text-orange-500">₹{futureEquivalent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-slate-500 mt-2">To maintain the exact same lifestyle</p>
              </div>
              <div className="bg-slate-950 rounded-[2rem] p-8 shadow-xl text-center text-white relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-20 -mr-16 -mt-16" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Purchasing Power Lost</p>
                <p className="text-3xl font-black text-red-400">₹{lossInPurchasingPower.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-slate-500 mt-2">The silent killer of wealth</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
              <h3 className="text-xs font-black dark:text-white uppercase tracking-widest mb-8">The Inflation Gap</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNeeded" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <Area type="monotone" dataKey="Value Needed" stroke="#f97316" fill="url(#colorNeeded)" />
                  <Area type="monotone" dataKey="Purchasing Power" stroke="#ef4444" fill="url(#colorPower)" />
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

export default InflationCalculator;
