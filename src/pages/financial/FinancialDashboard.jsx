import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  CreditCard, 
  TrendingUp, 
  Zap, 
  Calculator, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import CreditCardComparison from './components/CreditCardComparison';
import LoanEligibility from './components/LoanEligibility';
import { useNavigate } from 'react-router-dom';

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', name: 'Intelligence Hub', icon: Landmark },
    { id: 'cards', name: 'Card Comparison', icon: CreditCard },
    { id: 'loans', name: 'Loan Eligibility', icon: Zap },
  ];

  const tools = [
    { id: 'sip', name: 'SIP', icon: TrendingUp },
    { id: 'emi', name: 'EMI', icon: Calculator },
    { id: 'retirement', name: 'Retirement', icon: ShieldCheck },
  ];

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-20 md:py-32 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center md:text-left relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />
           
           <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full mb-6 border border-indigo-100 dark:border-indigo-800">
              <Landmark className="w-3 h-3 text-indigo-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-300">Financial Intelligence Hub</span>
           </motion.div>
           
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                 <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter mb-6">Finor <span className="text-brand-600">Financial.</span></motion.h1>
                 <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">
                    Personalized credit comparison, loan eligibility scoring, and professional wealth simulators powered by the FinFleet core.
                 </motion.p>
              </div>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 mb-12 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              {/* Featured Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div 
                  onClick={() => setActiveTab('cards')}
                  className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-all" />
                  <div className="flex flex-col h-full justify-between relative z-10">
                    <div>
                      <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 flex items-center justify-center mb-8">
                        <CreditCard className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-black dark:text-white mb-4">Elite Card Comparison</h3>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-md">Find the perfect credit card based on your lifestyle, rewards, and eligibility score. Save thousands in annual fees.</p>
                    </div>
                    <div className="mt-12 flex items-center space-x-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200" />)}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">120+ Offers available</p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('loans')}
                  className="bg-indigo-600 rounded-[3rem] p-10 shadow-2xl shadow-indigo-500/30 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-white/10 text-white flex items-center justify-center mb-8">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Loan Eligibility</h3>
                    <p className="text-sm font-bold text-indigo-100">Check your borrowing power in 60 seconds with our neural scoring engine.</p>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-12">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Start Score</span>
                    <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reference Existing Tools (Logical Migration) */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center">
                    <Calculator className="w-4 h-4 mr-2 text-brand-600" /> Professional Tools Integration
                  </h3>
                  <button onClick={() => navigate('/tools')} className="text-[10px] font-black uppercase tracking-widest text-brand-600 flex items-center">
                    View All <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {tools.map(tool => (
                    <div 
                      key={tool.id}
                      onClick={() => navigate(`/tools/${tool.id}`)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center space-x-4 group cursor-pointer hover:border-brand-500 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 group-hover:text-brand-600 flex items-center justify-center transition-colors">
                        <tool.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest dark:text-slate-300">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cards' && (
            <motion.div key="cards" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <CreditCardComparison />
            </motion.div>
          )}

          {activeTab === 'loans' && (
            <motion.div key="loans" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <LoanEligibility />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default FinancialDashboard;
