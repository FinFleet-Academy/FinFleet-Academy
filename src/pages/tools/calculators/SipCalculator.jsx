import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FinorToolInsight from '../../components/shared/FinorToolInsight';

const SipCalculator = () => {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { invested, returns, total, chartData, insights } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const investedAmount = investment * months;
    const futureValue = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const estimatedReturns = futureValue - investedAmount;

    // Generate Chart Data
    const data = [];
    let currentInvested = 0;
    for (let i = 1; i <= years; i++) {
      const m = i * 12;
      currentInvested = investment * m;
      const fv = investment * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      data.push({
        year: `Year ${i}`,
        Invested: currentInvested,
        Returns: fv - currentInvested,
        Total: fv
      });
    }

    // Generate AI Insights
    const generatedInsights = [
      { type: 'insight', text: `Over ${years} years, your wealth multiplies by ${(futureValue / investedAmount).toFixed(1)}x.` },
      { type: 'action', text: `Delaying this SIP by just 3 years would cost you roughly ₹${(futureValue - (investment * ((Math.pow(1 + monthlyRate, (years-3)*12) - 1) / monthlyRate) * (1 + monthlyRate))).toLocaleString('en-IN', {maximumFractionDigits:0})} in lost compounding.` }
    ];

    if (rate < 8) generatedInsights.push({ type: 'tip', text: "A rate below 8% might struggle to beat inflation. Consider diversified equity funds." });
    if (years > 15) generatedInsights.push({ type: 'tip', text: "Long-term compounding is working in your favor. Stay consistent through market dips." });

    return { 
      invested: investedAmount, 
      returns: estimatedReturns, 
      total: futureValue,
      chartData: data,
      insights: generatedInsights
    };
  }, [investment, rate, years]);

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
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">SIP Calculator</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Systematic Investment Plan</p>
                 </div>
              </div>

              <div className="space-y-10">
                {/* Investment */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Investment</label>
                     <span className="text-xl font-black text-brand-600">₹{investment.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={500} max={100000} step={500} value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600" />
                  <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest"><span>₹500</span><span>₹1L</span></div>
                </div>

                {/* Rate */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected Return</label>
                     <span className="text-xl font-black text-brand-600">{rate}% p.a</span>
                  </div>
                  <input type="range" min={1} max={30} step={1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600" />
                  <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest"><span>1%</span><span>30%</span></div>
                </div>

                {/* Years */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Period</label>
                     <span className="text-xl font-black text-brand-600">{years} Years</span>
                  </div>
                  <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600" />
                  <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest"><span>1 Yr</span><span>40 Yrs</span></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Outputs & Charts */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Value Cards */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Invested</p>
                <p className="text-2xl font-black dark:text-white">₹{invested.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Est. Returns</p>
                <p className="text-2xl font-black text-emerald-500">₹{returns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-brand-600 rounded-[2rem] p-8 shadow-xl shadow-brand-500/20 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20 -mr-16 -mt-16" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-brand-100">Total Value</p>
                <p className="text-2xl font-black">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
              <h3 className="text-xs font-black dark:text-white uppercase tracking-widest mb-8">Wealth Accumulation Graph</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                  />
                  <Area type="monotone" dataKey="Invested" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
                  <Area type="monotone" dataKey="Returns" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReturns)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* AI Insights */}
            <FinorToolInsight insights={insights} isLoading={false} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;
