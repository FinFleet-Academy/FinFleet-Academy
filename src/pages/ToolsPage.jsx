import React, { useState } from 'react';
import { Calculator, ShieldAlert, Target, Save, CheckCircle, Star, ArrowRight, TrendingUp, PieChart, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToolsPage = () => {
  const [activeTool, setActiveTool] = useState('sip');
  
  // SIP Calculator State
  const [sipInvestment, setSipInvestment] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  
  // Risk Profile State
  const [riskAnswers, setRiskAnswers] = useState({});
  const [riskResult, setRiskResult] = useState(null);

  const calculateSIP = () => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const investedAmount = sipInvestment * months;
    const futureValue = sipInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const estimatedReturns = futureValue - investedAmount;
    return { invested: investedAmount, returns: estimatedReturns, total: futureValue };
  };

  const sipResult = calculateSIP();

  const handleRiskSubmit = (e) => {
    e.preventDefault();
    const score = Object.values(riskAnswers).reduce((a, b) => a + parseInt(b), 0);
    if (score <= 5) setRiskResult('Conservative');
    else if (score <= 10) setRiskResult('Moderate');
    else setRiskResult('Aggressive');
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 md:py-32 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-20 text-center md:text-left">
           <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-6 border border-brand-100 dark:border-brand-800">
              <Star className="w-3 h-3 text-brand-600 fill-brand-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Financial Planning Suite</span>
           </motion.div>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-xl">
                 <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter mb-6">Execution <span className="text-gradient">Tools.</span></motion.h1>
                 <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">
                    Institutional-grade calculators and risk assessment protocols to refine your capital allocation strategy.
                 </motion.p>
              </div>
           </div>
        </div>

        {/* Tool Switcher */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-12">
          {[
            { id: 'sip', label: 'SIP Engine', icon: Calculator },
            { id: 'risk', label: 'Risk Protocol', icon: ShieldAlert },
          ].map(tool => (
            <button 
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-3 ${activeTool === tool.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl scale-105' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'}`}
            >
              <tool.icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>

        <motion.div 
          key={activeTool}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[120px] opacity-10 -mr-32 -mt-32" />

          {activeTool === 'sip' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
              <div className="space-y-10">
                <div className="flex items-center space-x-3 mb-4">
                   <TrendingUp className="w-6 h-6 text-brand-600" />
                   <h3 className="text-xl font-black dark:text-white uppercase tracking-widest">Growth Parameters</h3>
                </div>
                
                <div className="space-y-8">
                  {[
                    { label: 'Monthly Allocation (₹)', value: sipInvestment, setter: setSipInvestment, min: 500, max: 100000 },
                    { label: 'Return Expectations (p.a %)', value: sipRate, setter: setSipRate, min: 1, max: 30 },
                    { label: 'Time Horizon (Years)', value: sipYears, setter: setSipYears, min: 1, max: 40 },
                  ].map((field, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                         <span className="text-sm font-black dark:text-white">{field.value}</span>
                      </div>
                      <input 
                        type="range" min={field.min} max={field.max} value={field.value} 
                        onChange={(e) => field.setter(Number(e.target.value))}
                        className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20"><Calculator className="w-20 h-20" /></div>
                
                <div>
                   <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-12">Projected Valuation</h3>
                   <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Future Corpus</p>
                     <p className="text-5xl md:text-6xl font-black tracking-tighter leading-none">₹{sipResult.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-16 pt-10 border-t border-white/10">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Principle</p>
                    <p className="text-xl font-black">₹{sipResult.invested.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Alpha</p>
                    <p className="text-xl font-black text-emerald-400">₹{sipResult.returns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'risk' && (
            <div className="max-w-2xl mx-auto relative">
               <div className="text-center mb-16">
                  <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <ShieldAlert className="w-8 h-8 text-brand-600" />
                  </div>
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Institutional Risk Assessment</h3>
                  <p className="text-slate-400 text-xs font-bold mt-2">Evaluate your psychological tolerance for market volatility.</p>
               </div>

               {!riskResult ? (
                 <form onSubmit={handleRiskSubmit} className="space-y-12">
                   {[
                     { q: "PRIMARY INVESTMENT OBJECTIVE", opts: [{t: "Capital Preservation", v: 1}, {t: "Balanced Growth", v: 2}, {t: "High-Alpha Returns", v: 3}] },
                     { q: "VOLATILITY RESPONSE (20% PORTFOLIO DROP)", opts: [{t: "Liquidate Everything", v: 1}, {t: "Hedge and Wait", v: 2}, {t: "Aggressive Buy-Back", v: 3}] },
                     { q: "TIME HORIZON PROTOCOL", opts: [{t: "Short Term (< 3 Years)", v: 1}, {t: "Intermediate (3-7 Years)", v: 2}, {t: "Strategic Long Term (7+ Years)", v: 3}] }
                   ].map((item, i) => (
                     <div key={i} className="space-y-6">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                          <span className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 text-slate-500 text-[9px]">{i+1}</span>
                          {item.q}
                       </p>
                       <div className="grid grid-cols-1 gap-3">
                         {item.opts.map((opt, j) => (
                           <label key={j} className={`flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${riskAnswers[i] === opt.v ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/10' : 'border-slate-50 dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                             <input type="radio" name={`q${i}`} value={opt.v} onChange={() => setRiskAnswers({...riskAnswers, [i]: opt.v})} className="hidden" required />
                             <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${riskAnswers[i] === opt.v ? 'border-brand-600' : 'border-slate-200 dark:border-slate-700'}`}>
                                {riskAnswers[i] === opt.v && <div className="w-2 h-2 rounded-full bg-brand-600" />}
                             </div>
                             <span className="text-xs font-black dark:text-white uppercase tracking-widest">{opt.t}</span>
                           </label>
                         ))}
                       </div>
                     </div>
                   ))}
                   <button type="submit" className="w-full py-5 bg-brand-600 text-white text-xs font-black uppercase tracking-[0.25em] rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 transition-all">Analyze Protocol</button>
                 </form>
               ) : (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 bg-slate-50 dark:bg-slate-950 rounded-[3rem] border border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                       <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Analysis Complete</h4>
                    <h5 className="text-4xl font-black dark:text-white tracking-tighter mb-6">Profile: <span className="text-brand-600 uppercase">{riskResult}</span></h5>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed mb-10">Based on your strategic responses, we have classified your tolerance as {riskResult.toLowerCase()}. We recommend optimizing your asset allocation towards institutional grade diversified funds.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                       <button onClick={() => setRiskResult(null)} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest">Recalibrate</button>
                       <button className="px-10 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest dark:text-white">Detailed Report</button>
                    </div>
                 </motion.div>
               )}
            </div>
          )}
        </motion.div>

        {/* Footer Info */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 px-4">
           <div className="flex items-center space-x-4">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                 <Info className="w-5 h-5 text-brand-600" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-xs">All calculations are projections and do not guarantee future returns. Invest wisely.</p>
           </div>
           <button className="text-[10px] font-black uppercase tracking-widest text-brand-600 flex items-center hover:translate-x-2 transition-transform">
              Explore Trading Academy <ArrowRight className="w-4 h-4 ml-2" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
