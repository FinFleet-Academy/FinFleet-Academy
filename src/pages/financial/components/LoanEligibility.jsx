import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';
import axios from 'axios';

const LoanEligibility = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: 75000,
    creditScore: 750,
    existingEmi: 5000,
    employmentType: 'Salaried'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/financial/eligibility', formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      // Fallback for demo
      setResult({
        maxEligibleAmount: 1200000,
        monthlyInstallmentCapacity: 28000,
        approvalProbability: 'High',
        probabilityScore: 88,
        dti: '6.67',
        recommendations: ["You qualify for 'Super Prime' interest rates. Negotiate for lower processing fees."]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
      {/* Input Side */}
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black dark:text-white tracking-tighter">Eligibility Form</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Health Check</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Income</label>
                <span className="text-sm font-black dark:text-white">₹{formData.monthlyIncome.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" min={10000} max={500000} step={5000} value={formData.monthlyIncome} 
                onChange={(e) => setFormData({...formData, monthlyIncome: Number(e.target.value)})}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-indigo-600" 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credit Score</label>
                <span className="text-sm font-black dark:text-white">{formData.creditScore}</span>
              </div>
              <input 
                type="range" min={300} max={900} step={1} value={formData.creditScore} 
                onChange={(e) => setFormData({...formData, creditScore: Number(e.target.value)})}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-indigo-600" 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Existing EMIs</label>
                <span className="text-sm font-black dark:text-white">₹{formData.existingEmi.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" min={0} max={200000} step={1000} value={formData.existingEmi} 
                onChange={(e) => setFormData({...formData, existingEmi: Number(e.target.value)})}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-indigo-600" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employment</label>
              <div className="grid grid-cols-2 gap-3">
                {['Salaried', 'Self-Employed'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({...formData, employmentType: type})}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      formData.employmentType === type 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={calculate}
              disabled={loading}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 dark:hover:text-white transition-all flex items-center justify-center space-x-2 shadow-xl shadow-slate-950/20"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <span>Check Eligibility</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Result Side */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-12"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <Landmark className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-black dark:text-white mb-2">Ready to Discover?</h3>
              <p className="text-xs font-bold text-slate-400 max-w-xs">Fill in your details and click calculate to see your loan eligibility and probability score.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Max Loan Amount</p>
                  <h2 className="text-5xl font-black mb-10 tracking-tighter">₹{result.maxEligibleAmount.toLocaleString('en-IN')}</h2>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-1">Probability</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xl font-black">{result.approvalProbability}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-1">Credit Health</p>
                      <span className="text-xl font-black">{result.probabilityScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Capacity</p>
                  </div>
                  <p className="text-2xl font-black dark:text-white">₹{result.monthlyInstallmentCapacity.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertCircle className="w-4 h-4 text-indigo-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Debt to Income</p>
                  </div>
                  <p className="text-2xl font-black dark:text-white">{result.dti}%</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-brand-600" /> AI Insights & Next Steps
                </h4>
                <div className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start space-x-3 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoanEligibility;
