import React, { useState } from 'react';
import { Calculator, ShieldAlert, Target, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
    
    return {
      invested: investedAmount,
      returns: estimatedReturns,
      total: futureValue
    };
  };

  const sipResult = calculateSIP();

  const handleRiskSubmit = (e) => {
    e.preventDefault();
    const score = Object.values(riskAnswers).reduce((a, b) => a + parseInt(b), 0);
    if (score <= 5) setRiskResult('Conservative');
    else if (score <= 10) setRiskResult('Moderate');
    else setRiskResult('Aggressive');
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold dark:text-white mb-4">Financial Tools & Calculators</h1>
          <p className="text-slate-500 dark:text-slate-400">Plan your investments and understand your risk profile with our easy-to-use tools.</p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={() => setActiveTool('sip')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${activeTool === 'sip' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'}`}
          >
            <Calculator className="w-4 h-4" />
            <span>SIP Calculator</span>
          </button>
          <button 
            onClick={() => setActiveTool('risk')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${activeTool === 'risk' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'}`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Risk Profile</span>
          </button>
        </div>

        <div className="card-premium p-8">
          {activeTool === 'sip' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-xl font-bold dark:text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-brand-600" />
                  Investment Details
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Monthly Investment (₹)</label>
                  <input type="number" value={sipInvestment} onChange={(e) => setSipInvestment(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Expected Return Rate (p.a %)</label>
                  <input type="number" value={sipRate} onChange={(e) => setSipRate(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Time Period (Years)</label>
                  <input type="number" value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white" />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Estimated Returns</h3>
                <div className="space-y-6 text-center">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Value</p>
                    <p className="text-4xl font-extrabold text-brand-600">₹{sipResult.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Invested Amount</p>
                      <p className="text-lg font-bold dark:text-white">₹{sipResult.invested.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Est. Returns</p>
                      <p className="text-lg font-bold text-accent-success">₹{sipResult.returns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'risk' && (
            <div className="max-w-2xl mx-auto">
               <h3 className="text-xl font-bold dark:text-white mb-6 text-center">Discover Your Risk Profile</h3>
               {!riskResult ? (
                 <form onSubmit={handleRiskSubmit} className="space-y-8">
                   {[
                     { q: "What is your primary investment goal?", opts: [{t: "Capital Preservation", v: 1}, {t: "Balanced Growth", v: 2}, {t: "High Returns", v: 3}] },
                     { q: "How would you react to a 20% drop in your portfolio?", opts: [{t: "Sell everything", v: 1}, {t: "Hold and wait", v: 2}, {t: "Buy more", v: 3}] },
                     { q: "What is your investment time horizon?", opts: [{t: "Less than 3 years", v: 1}, {t: "3 to 7 years", v: 2}, {t: "7+ years", v: 3}] }
                   ].map((item, i) => (
                     <div key={i} className="space-y-4">
                       <p className="font-bold dark:text-white">{i+1}. {item.q}</p>
                       <div className="space-y-2">
                         {item.opts.map((opt, j) => (
                           <label key={j} className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${riskAnswers[i] === opt.v ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/10' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'}`}>
                             <input type="radio" name={`q${i}`} value={opt.v} onChange={() => setRiskAnswers({...riskAnswers, [i]: opt.v})} className="text-brand-600 focus:ring-brand-500 w-4 h-4" required />
                             <span className="text-sm font-medium dark:text-white">{opt.t}</span>
                           </label>
                         ))}
                       </div>
                     </div>
                   ))}
                   <button type="submit" className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors">Analyze Profile</button>
                 </form>
               ) : (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                   <CheckCircle className="w-16 h-16 text-accent-success mx-auto mb-4" />
                   <h4 className="text-2xl font-bold dark:text-white mb-2">Your Profile is: <span className="text-brand-600">{riskResult}</span></h4>
                   <p className="text-slate-500 dark:text-slate-400 mb-6">Based on your answers, you have a {riskResult.toLowerCase()} risk tolerance. We recommend aligning your portfolio accordingly.</p>
                   <button onClick={() => setRiskResult(null)} className="px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">Retake Quiz</button>
                 </motion.div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
