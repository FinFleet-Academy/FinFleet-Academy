import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FinorToolInsight from '../../components/shared/FinorToolInsight';

const SipLumpsumComparator = () => {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(5000);
  const [lumpsum, setLumpsum] = useState(investment * 12 * 10); // equivalent to 10yr SIP
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { sipValue, lumpsumValue, sipInvested, chartData, insights } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const annualRate = rate / 100;
    const months = years * 12;

    // SIP Value
    const sipFV = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const sipTotal = investment * months;

    // Lumpsum Value
    const lumpsumFV = lumpsum * Math.pow(1 + annualRate, years);

    const data = [];
    for (let i = 1; i <= years; i++) {
      const m = i * 12;
      const sip = investment * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      const ls = lumpsum * Math.pow(1 + annualRate, i);
      data.push({ year: `Year ${i}`, 'SIP Value': Math.round(sip), 'Lumpsum Value': Math.round(ls) });
    }

    const winner = sipFV > lumpsumFV ? 'SIP' : 'Lumpsum';
    const diff = Math.abs(sipFV - lumpsumFV);

    const generatedInsights = [
      { type: 'insight', text: `${winner} wins by ₹${diff.toLocaleString('en-IN', {maximumFractionDigits:0})} over ${years} years at the same ${rate}% return.` },
      { type: 'tip', text: `Lumpsum investing carries higher market timing risk. SIPs smooth out volatility through rupee cost averaging.` }
    ];

    if (sipFV > lumpsumFV) {
      generatedInsights.push({ type: 'action', text: "With your current inputs, a disciplined monthly SIP outperforms a one-time investment. This is due to the power of rupee cost averaging." });
    } else {
      generatedInsights.push({ type: 'action', text: "When markets are expected to grow steadily, a lumpsum can outperform SIPs significantly — especially at the start of a bull market." });
    }

    return {
      sipValue: sipFV,
      lumpsumValue: lumpsumFV,
      sipInvested: sipTotal,
      chartData: data,
      insights: generatedInsights
    };
  }, [investment, lumpsum, rate, years]);

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-violet-500 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/3 space-y-8">
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">SIP vs Lumpsum</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investment Comparator</p>
                 </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">SIP Amount (Monthly)</label>
                     <span className="text-xl font-black text-violet-600">₹{investment.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={500} max={100000} step={500} value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Lumpsum Amount</label>
                     <span className="text-xl font-black dark:text-white">₹{lumpsum.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min={10000} max={10000000} step={10000} value={lumpsum} onChange={(e) => setLumpsum(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected Return</label>
                     <span className="text-xl font-black dark:text-white">{rate}% p.a</span>
                  </div>
                  <input type="range" min={1} max={30} step={1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Period</label>
                     <span className="text-xl font-black dark:text-white">{years} Years</span>
                  </div>
                  <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/3 space-y-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-[2rem] p-8 shadow-xl text-center relative overflow-hidden ${sipValue > lumpsumValue ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                {sipValue > lumpsumValue && <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20" />}
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${sipValue > lumpsumValue ? 'text-violet-100' : 'text-slate-400'}`}>SIP Maturity Value</p>
                <p className="text-3xl font-black">₹{sipValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                {sipValue > lumpsumValue && <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">🏆 Winner</span>}
              </div>
              <div className={`rounded-[2rem] p-8 shadow-xl text-center relative overflow-hidden ${lumpsumValue > sipValue ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                {lumpsumValue > sipValue && <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20" />}
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${lumpsumValue > sipValue ? 'text-violet-100' : 'text-slate-400'}`}>Lumpsum Maturity Value</p>
                <p className="text-3xl font-black">₹{lumpsumValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                {lumpsumValue > sipValue && <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">🏆 Winner</span>}
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
              <h3 className="text-xs font-black dark:text-white uppercase tracking-widest mb-8">Head-to-Head Growth</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSIP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '16px' }} />
                  <Area type="monotone" dataKey="SIP Value" stroke="#7c3aed" strokeWidth={3} fill="url(#colorSIP)" />
                  <Area type="monotone" dataKey="Lumpsum Value" stroke="#10b981" strokeWidth={3} fill="url(#colorLS)" />
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

export default SipLumpsumComparator;
