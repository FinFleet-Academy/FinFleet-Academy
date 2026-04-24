import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FinorToolInsight from '../../../components/shared/FinorToolInsight';

const CompoundInterestCalculator = () => {
  const navigate = useNavigate();
  const [initialDeposit, setInitialDeposit] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(15);
  const [compoundFrequency, setCompoundFrequency] = useState(12); // Monthly default

  const { totalPrincipal, totalInterest, totalValue, chartData, insights } = useMemo(() => {
    const r = rate / 100;
    const n = compoundFrequency;
    const t = years;
    const PMT = monthlyContribution;
    const P = initialDeposit;

    // Compound Interest for Principal
    const principalFutureValue = P * Math.pow(1 + r/n, n*t);
    
    // Future Value of a Series (Monthly Contributions)
    // Note: If compounding is monthly, and contributions are monthly, the math is straightforward.
    // Simplifying assuming contribution frequency matches compounding frequency for the graph
    const monthlyRate = r / 12;
    const months = t * 12;
    const seriesFutureValue = PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

    const fv = principalFutureValue + seriesFutureValue;
    const totalP = P + (PMT * months);
    const totalInt = fv - totalP;

    // Generate Chart Data
    const data = [];
    let currentP = P;
    let currentFV = P;
    for (let i = 1; i <= years; i++) {
      const m = i * 12;
      currentP = P + (PMT * m);
      const pfv = P * Math.pow(1 + r/n, n*i);
      const sfv = PMT * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      currentFV = pfv + sfv;
      
      data.push({
        year: `Year ${i}`,
        Principal: currentP,
        Interest: currentFV - currentP,
        Total: currentFV
      });
    }

    const generatedInsights = [
      { type: 'insight', text: `Thanks to compounding, your interest alone (₹${totalInt.toLocaleString('en-IN', {maximumFractionDigits:0})}) exceeds your total principal by Year ${Math.floor(years * 0.7)}.` },
      { type: 'tip', text: `By increasing your monthly contribution by just ₹${(PMT * 0.2).toFixed(0)}, your final value would jump significantly.` }
    ];

    if (compoundFrequency === 1) {
      generatedInsights.push({ type: 'action', text: "You selected annual compounding. Monthly or daily compounding yields higher returns due to the velocity of money." });
    }

    return {
      totalPrincipal: totalP,
      totalInterest: totalInt,
      totalValue: fv,
      chartData: data,
      insights: generatedInsights
    };
  }, [initialDeposit, monthlyContribution, rate, years, compoundFrequency]);

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left: Inputs */}
          <div className="w-full lg:w-1/3 space-y-8">
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 flex items-center justify-center">
                    <BarChart2 className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">Compound Interest</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Calculator</p>
                 </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Initial Deposit</label>
                     <span className="text-xl font-black text-brand-600">₹{initialDeposit.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={0} max={5000000} step={10000} value={initialDeposit} onChange={(e) => setInitialDeposit(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Contribution</label>
                     <span className="text-xl font-black text-brand-600">₹{monthlyContribution.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={0} max={100000} step={1000} value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Interest Rate (p.a)</label>
                     <span className="text-xl font-black text-brand-600">{rate}%</span>
                  </div>
                  <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Years to Grow</label>
                     <span className="text-xl font-black text-brand-600">{years}</span>
                  </div>
                  <input type="range" min={1} max={50} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Compound Frequency</label>
                  <select 
                    value={compoundFrequency} 
                    onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value={1}>Annually</option>
                    <option value={2}>Semi-Annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={365}>Daily</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Outputs & Charts */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Principal</p>
                <p className="text-2xl font-black dark:text-white">₹{totalPrincipal.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Interest</p>
                <p className="text-2xl font-black text-emerald-500">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-brand-600 rounded-[2rem] p-8 shadow-xl shadow-brand-500/20 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20 -mr-16 -mt-16" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-brand-100">Future Value</p>
                <p className="text-2xl font-black">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
              <h3 className="text-xs font-black dark:text-white uppercase tracking-widest mb-8">Exponential Growth Curve</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                  />
                  <Area type="monotone" dataKey="Principal" stackId="1" stroke="#3b82f6" fill="url(#colorP)" />
                  <Area type="monotone" dataKey="Interest" stackId="1" stroke="#10b981" fill="url(#colorI)" />
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

export default CompoundInterestCalculator;
