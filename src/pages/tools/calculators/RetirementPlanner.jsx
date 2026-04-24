import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FinorToolInsight from '../../components/shared/FinorToolInsight';

const RetirementPlanner = () => {
  const navigate = useNavigate();
  const [currentAge, setCurrentAge] = useState(28);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflationRate, setInflationRate] = useState(6);
  const [returnRate, setReturnRate] = useState(10);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);

  const { targetCorpus, monthlySipRequired, futureMonthlyExpense, chartData, insights } = useMemo(() => {
    const yearsToRetire = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    const annualExpenseToday = monthlyExpense * 12;

    // Future monthly expense at retirement due to inflation
    const futureAnnualExpense = annualExpenseToday * Math.pow(1 + inflationRate / 100, yearsToRetire);
    const futureMonthly = futureAnnualExpense / 12;

    // Target corpus at retirement (using withdrawal rate with post-retirement returns)
    // Assuming 8% post-retirement return (conservative)
    const postRetirementRate = 0.08 / 12;
    const totalMonths = yearsInRetirement * 12;
    const targetCorpusCalc = futureMonthly * ((1 - Math.pow(1 + postRetirementRate, -totalMonths)) / postRetirementRate);

    // Monthly SIP required to reach target corpus
    const monthlyRate = returnRate / 12 / 100;
    const sipMonths = yearsToRetire * 12;
    const requiredSip = targetCorpusCalc / ((Math.pow(1 + monthlyRate, sipMonths) - 1) / monthlyRate) / (1 + monthlyRate);

    // Chart data — corpus accumulation over time
    const data = [];
    let currentCorpus = 0;
    for (let i = 1; i <= yearsToRetire; i++) {
      const m = i * 12;
      currentCorpus = requiredSip * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      data.push({
        year: `Age ${currentAge + i}`,
        Corpus: Math.round(currentCorpus)
      });
    }

    const generatedInsights = [
      { type: 'insight', text: `Due to ${inflationRate}% inflation, your current ₹${monthlyExpense.toLocaleString('en-IN')}/mo lifestyle will cost ₹${Math.round(futureMonthly).toLocaleString('en-IN')}/mo at retirement.` },
      { type: 'action', text: `Start a SIP of ₹${Math.round(requiredSip).toLocaleString('en-IN')}/mo now to retire comfortably at ${retirementAge}.` }
    ];

    if (currentAge > 40) generatedInsights.push({ type: 'tip', text: "Starting later means you need a much larger SIP. Consider increasing equity allocation and maximizing NPS/PPF contributions." });
    if (retirementAge < 55) generatedInsights.push({ type: 'action', text: "Early retirement is a powerful goal! You'll need a significantly larger corpus to sustain a longer retirement period." });

    return {
      targetCorpus: targetCorpusCalc,
      monthlySipRequired: requiredSip,
      futureMonthlyExpense: futureMonthly,
      chartData: data,
      insights: generatedInsights
    };
  }, [currentAge, retirementAge, monthlyExpense, inflationRate, returnRate, lifeExpectancy]);

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/tools')} className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/3 space-y-8">
            <motion.div {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <Target className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-xl font-black dark:text-white tracking-tighter">Retirement Planner</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Freedom Number Calculator</p>
                 </div>
              </div>

              <div className="space-y-10">
                {[
                  { label: 'Current Age', value: currentAge, setter: setCurrentAge, min: 18, max: 60, suffix: 'yrs' },
                  { label: 'Retirement Age', value: retirementAge, setter: setRetirementAge, min: currentAge + 5, max: 75, suffix: 'yrs' },
                  { label: 'Life Expectancy', value: lifeExpectancy, setter: setLifeExpectancy, min: retirementAge + 5, max: 100, suffix: 'yrs' },
                  { label: 'Monthly Expenses', value: monthlyExpense, setter: setMonthlyExpense, min: 10000, max: 500000, step: 5000, prefix: '₹' },
                  { label: 'Expected Return', value: returnRate, setter: setReturnRate, min: 6, max: 20, suffix: '% p.a' },
                  { label: 'Inflation Rate', value: inflationRate, setter: setInflationRate, min: 2, max: 12, suffix: '% p.a' },
                ].map((field, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                       <span className="text-xl font-black dark:text-white">{field.prefix || ''}{typeof field.value === 'number' && field.value >= 10000 ? field.value.toLocaleString('en-IN') : field.value}{field.suffix ? ` ${field.suffix}` : ''}</span>
                    </div>
                    <input type="range" min={field.min} max={field.max} step={field.step || 1} value={field.value} onChange={(e) => field.setter(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-sky-500" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/3 space-y-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-sky-600 rounded-[2rem] p-8 shadow-xl shadow-sky-500/20 text-center text-white relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-sky-100">Your Freedom Number</p>
                <p className="text-3xl font-black">₹{(targetCorpus / 10000000).toFixed(2)} Cr</p>
                <p className="text-xs text-sky-200 mt-2">Corpus needed to retire at {retirementAge}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Start SIP Now</p>
                <p className="text-3xl font-black text-emerald-500">₹{Math.round(monthlySipRequired).toLocaleString('en-IN')}<span className="text-base">/mo</span></p>
                <p className="text-xs text-slate-500 mt-2">at {returnRate}% p.a for {retirementAge - currentAge} years</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-[380px]">
              <h3 className="text-xs font-black dark:text-white uppercase tracking-widest mb-8">Corpus Accumulation Path</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRetire" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} interval={Math.floor(chartData.length / 5)} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/10000000).toFixed(1)}Cr`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                  <Area type="monotone" dataKey="Corpus" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRetire)" />
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

export default RetirementPlanner;
