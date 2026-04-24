import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, Search, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-brand-500/20">
      
      {/* Decorative Sophistication */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500 rounded-full blur-[150px] opacity-[0.03] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500 rounded-full blur-[150px] opacity-[0.03] -ml-32 -mb-32" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-24 h-24 bg-red-50 dark:bg-red-950/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner border border-red-100 dark:border-red-900/30"
        >
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </motion.div>
 
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-7xl md:text-9xl font-black dark:text-white tracking-tighter leading-none mb-6"
        >
          404.
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 font-bold tracking-tight mb-12 uppercase"
        >
          Page Not <span className="text-red-500">Found.</span>
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 mb-12 shadow-sm"
        >
           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
             The page you are looking for has either been removed or moved to a new location. Please check the URL or return to the home page.
           </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
           <button 
             onClick={() => navigate(-1)}
             className="w-full sm:w-auto flex items-center justify-center px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
           >
              <ArrowLeft className="w-4 h-4 mr-3" /> Go Back
           </button>
           <Link 
             to="/"
             className="w-full sm:w-auto flex items-center justify-center px-10 py-5 bg-brand-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-500/20"
           >
              <Home className="w-4 h-4 mr-3" /> Home Page
           </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex items-center justify-center space-x-6"
        >
           <Zap className="w-5 h-5 text-slate-400" />
           <div className="w-12 h-px bg-slate-300 dark:bg-slate-800" />
           <Search className="w-5 h-5 text-slate-400" />
        </motion.div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-10">
         <p className="text-[10px] font-black dark:text-white uppercase tracking-[0.5em]">FinFleet Academy</p>
      </div>

    </div>
  );
};

export default NotFoundPage;
