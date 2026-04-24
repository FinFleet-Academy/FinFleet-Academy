import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, ShieldCheck, Zap, PieChart, TrendingUp, Wallet, DollarSign, RefreshCw, BarChart2, Calendar, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ToolsDashboard = () => {
  const navigate = useNavigate();
  
  const tools = [
    { id: 'sip', name: 'SIP Calculator', desc: 'Project your mutual fund wealth growth', icon: TrendingUp, color: 'emerald' },
    { id: 'emi', name: 'EMI Calculator', desc: 'Plan your loan repayments and interest', icon: Calculator, color: 'indigo' },
    { id: 'compound', name: 'Compound Interest', desc: 'Visualize the power of compounding', icon: BarChart2, color: 'brand' },
    { id: 'swp', name: 'SWP Calculator', desc: 'Plan your monthly withdrawal strategy', icon: Wallet, color: 'rose' },
    { id: 'cagr', name: 'CAGR Calculator', desc: 'Measure your annualized investment returns', icon: PieChart, color: 'amber' },
    { id: 'fd', name: 'FD Calculator', desc: 'Calculate fixed deposit maturity values', icon: ShieldCheck, color: 'slate' },
    { id: 'retirement', name: 'Retirement Planner', desc: 'Find out how much you need to retire', icon: Target, color: 'sky' },
    { id: 'inflation', name: 'Inflation Adjuster', desc: 'See how inflation impacts purchasing power', icon: Zap, color: 'orange' },
    { id: 'compare', name: 'SIP vs Lumpsum', desc: 'Compare investment strategies', icon: RefreshCw, color: 'violet' },
    { id: 'currency', name: 'Currency Converter', desc: 'Live FX rates and conversion', icon: DollarSign, color: 'teal' },
  ];

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 md:py-32 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20 text-center md:text-left relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />
           
           <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-6 border border-brand-100 dark:border-brand-800">
              <Calculator className="w-3 h-3 text-brand-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Financial Ecosystem</span>
           </motion.div>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                 <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter mb-6">Pro <span className="text-brand-600">Tools.</span></motion.h1>
                 <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">
                    A suite of high-performance financial calculators to help you simulate, strategize, and optimize your wealth creation journey.
                 </motion.p>
              </div>
           </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tools.map((tool, i) => (
            <motion.div 
              key={tool.id} 
              {...fadeInUp} 
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/tools/${tool.id}`)}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${tool.color}-50 dark:bg-${tool.color}-500/10 text-${tool.color}-600 group-hover:scale-110 transition-transform`}>
                   <tool.icon className="w-6 h-6" />
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black dark:text-white mb-2 group-hover:text-brand-600 transition-colors">{tool.name}</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{tool.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ToolsDashboard;
