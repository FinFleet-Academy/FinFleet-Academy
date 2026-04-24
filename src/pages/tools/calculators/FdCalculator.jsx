import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FinorToolInsight from '../../../components/shared/FinorToolInsight';

const FdCalculator = () => {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [payoutType, setPayoutType] = useState('cumulative'); // cumulative, monthly, quarterly

  const { maturity, totalInterest, chartData, insights } = useMemo(() => {
    let fv = principal;
    let interest = 0;
    const data = [];

    if (payoutType === 'cumulative') {
      fv = principal * Math.pow(1 + (rate / 100) / 4, 4 * years); // Typically quarterly compounding in India
      interest = fv - principal;
      
      let currentFV = principal;
      for (let i = 1; i <= years; i++) {
        currentFV = principal * Math.pow(1 + (rate / 100) / 4, 4 * i);
        data.push({
          year: `Year ${i}`,
          Principal: principal,
          Interest: currentFV - principal,
          Total: currentFV
        });
      }
    } else {
      // Non-cumulative (interest payout)
      const annualInterest = principal * (rate / 100);
      interest = annualInterest * years;
      fv = principal; // At maturity you just get principal back

      for (let i = 1; i <= years; i++) {
        data.push({
          year: `Year ${i}`,
          Principal: principal,
          Interest: annualInterest * i,
          Total: principal + (annualInterest * i)
        });
      }
    }

    const generatedInsights = [
      { type: 'insight', text: `You will earn ₹${interest.toLocaleString('en-IN', {maximumFractionDigits:0})} in guaranteed interest over ${years} years.` }
    ];

    if (payoutType !== 'cumulative') {
      const payout = payoutType === 'monthly' ? (principal * (rate/100)) / 12 : (principal * (rate/100)) / 4;
      generatedInsights.push({ type: 'tip', text: `You will receive a guaranteed ${payoutType} payout of ₹${payout.toLocaleString('en-IN', {maximumFractionDigits:0})}.` });
    } else {
      generatedInsights.push({ type: 'tip', text: `Cumulative FDs yield higher overall returns due to quarterly compounding of interest.` });
    }

    if (rate < 6) generatedInsights.push({ type: 'action', text: "Your rate is low. Compare rates with small finance banks offering up to 9% for senior citizens." });

    return {
      maturity: fv,
      totalInterest: interest,
      chartData: data,
      insights: generatedInsights
    };
  }, [principal, rate, years, payoutType]);

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/3 space-y-8">
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">FD Calculator</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fixed Deposit Returns</p>
                 </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deposit Amount</label>
                     <span className="text-xl font-black dark:text-white">₹{principal.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={10000} max={10000000} step={10000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-slate-600" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Interest Rate (p.a)</label>
                     <span className="text-xl font-black dark:text-white">{rate}%</span>
                  </div>
                  <input type="range" min={3} max={12} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-slate-600" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Period</label>
                     <span className="text-xl font-black dark:text-white">{years} Years</span>
                  </div>
                  <input type="range" min={1} max={15} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-slate-600" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Payout Option</label>
                  <select 
                    value={payoutType} 
                    onChange={(e) => setPayoutType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold dark:text-white focus:outline-none focus:border-slate-500"
                  >
                    <option value="cumulative">Cumulative (At Maturity)</option>
                    <option value="monthly">Monthly Payout</option>
                    <option value="quarterly">Quarterly Payout</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/3 space-y-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Interest Earned</p>
                <p className="text-3xl font-black text-emerald-500">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-slate-800 dark:bg-white rounded-[2rem] p-8 shadow-xl text-center text-white dark:text-slate-900">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Maturity Amount</p>
                <p className="text-3xl font-black">₹{maturity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
              <h3 className="text-xs font-black dark:text-white uppercase tracking-widest mb-8">Guaranteed Returns Graph</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorP_FD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorI_FD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <Area type="monotone" dataKey="Principal" stackId="1" stroke="#94a3b8" fill="url(#colorP_FD)" />
                  <Area type="monotone" dataKey="Interest" stackId="1" stroke="#10b981" fill="url(#colorI_FD)" />
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

export default FdCalculator;
