import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import FinorToolInsight from '../../components/shared/FinorToolInsight';

const EmiCalculator = () => {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, totalInterest, totalPayment, chartData, insights } = useMemo(() => {
    const p = principal;
    const r = rate / 12 / 100;
    const n = years * 12;

    const calculatedEmi = p * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const totalPmt = calculatedEmi * n;
    const totalInt = totalPmt - p;

    const data = [
      { name: 'Principal', value: p, color: '#3b82f6' },
      { name: 'Interest', value: totalInt, color: '#f43f5e' }
    ];

    const generatedInsights = [
      { type: 'insight', text: `Your monthly commitment is ₹${calculatedEmi.toLocaleString('en-IN', {maximumFractionDigits:0})}.` },
      { type: 'tip', text: `Interest makes up ${((totalInt / totalPmt) * 100).toFixed(1)}% of your total payment. Making 1 extra EMI payment a year can significantly reduce this.` }
    ];

    if (rate > 10) generatedInsights.push({ type: 'action', text: "Your interest rate is quite high. Look for balance transfer opportunities to save lakhs." });

    return {
      emi: calculatedEmi,
      totalInterest: totalInt,
      totalPayment: totalPmt,
      chartData: data,
      insights: generatedInsights
    };
  }, [principal, rate, years]);

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left: Inputs */}
          <div className="w-full lg:w-1/3 space-y-8">
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Calculator className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">EMI Calculator</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equated Monthly Installment</p>
                 </div>
              </div>

              <div className="space-y-10">
                {/* Principal */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Loan Amount</label>
                     <span className="text-xl font-black text-indigo-600">₹{principal.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={100000} max={20000000} step={100000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                </div>

                {/* Rate */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Interest Rate</label>
                     <span className="text-xl font-black text-indigo-600">{rate}% p.a</span>
                  </div>
                  <input type="range" min={5} max={20} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                </div>

                {/* Years */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Loan Tenure</label>
                     <span className="text-xl font-black text-indigo-600">{years} Years</span>
                  </div>
                  <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Outputs & Charts */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Value Cards */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-600 rounded-[2rem] p-8 shadow-xl shadow-indigo-500/20 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20 -mr-16 -mt-16" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-indigo-100">Monthly EMI</p>
                <p className="text-3xl font-black">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Interest</p>
                <p className="text-2xl font-black text-rose-500">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Payment</p>
                <p className="text-2xl font-black dark:text-white">₹{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-3"/><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Principal</span></div>
                  <span className="font-black dark:text-white">{((principal/totalPayment)*100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-rose-500 mr-3"/><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Interest</span></div>
                  <span className="font-black dark:text-white">{((totalInterest/totalPayment)*100).toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>

            {/* AI Insights */}
            <FinorToolInsight insights={insights} isLoading={false} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
