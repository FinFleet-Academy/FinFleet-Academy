import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Lightbulb, Zap, TrendingUp } from 'lucide-react';

const FinorToolInsight = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-brand-500/5 border border-brand-500/20 rounded-3xl p-6 md:p-8 animate-pulse flex items-start space-x-4">
        <div className="w-12 h-12 bg-brand-500/20 rounded-2xl shrink-0" />
        <div className="space-y-3 flex-1 pt-2">
          <div className="h-4 bg-brand-500/20 rounded-full w-3/4" />
          <div className="h-4 bg-brand-500/20 rounded-full w-1/2" />
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-gradient-to-br from-[#0A0F14] to-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32 pointer-events-none" />
      
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-brand-500" />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-500">Neural Engine</h4>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Finor Insights</h3>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-4 bg-slate-950/50 rounded-2xl p-5 border border-slate-800">
            {insight.type === 'tip' ? <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> : 
             insight.type === 'action' ? <Zap className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> :
             <TrendingUp className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />}
            <p className="text-sm font-bold text-slate-300 leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>

      <button className="mt-8 text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-400 flex items-center transition-colors relative z-10">
        Ask Finor about this projection <TrendingUp className="w-3 h-3 ml-2" />
      </button>
    </motion.div>
  );
};

export default FinorToolInsight;
