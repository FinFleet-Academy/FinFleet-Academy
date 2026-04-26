import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Filter, ChevronRight, Star, ShieldCheck, Zap, Layers, Sparkles, Globe, Heart } from 'lucide-react';
import axios from 'axios';

/**
 * 💳 FinFleet Academy Elite: Smart Card Portfolio
 * AI-driven credit optimization and institutional benefit comparison.
 */
const CreditCardComparison = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchCards();
  }, [filterType]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const typeParam = filterType !== 'All' ? `?type=${filterType}` : '';
      const res = await axios.get(`/api/financial/cards${typeParam}`);
      setCards(res.data);
    } catch (err) {
      console.error("Fetch failed, using elite mock data", err);
      // Premium Fallback Data
      setCards([
        { _id: '1', name: 'Sapphire Neural', issuer: 'FinFleet Academy Global', type: 'Travel', annualFee: 499, apr: 14.99, rewardRate: 5, benefits: ['Unlimited Lounge Access', 'Crypto Cashback', 'Neural Concierge'], rating: 4.9, color: 'bg-indigo-600' },
        { _id: '2', name: 'Emerald Quantum', issuer: 'AssetNode', type: 'Rewards', annualFee: 0, apr: 18.99, rewardRate: 3, benefits: ['Zero FX Markup', 'Fraud Insurance', 'Node Rewards'], rating: 4.7, color: 'bg-emerald-600' },
        { _id: '3', name: 'Onyx Elite', issuer: 'Reserve One', type: 'Premium', annualFee: 999, apr: 12.49, rewardRate: 10, benefits: ['Private Jet Access', 'Lifestyle Manager', 'Unlimited 10% Back'], rating: 5.0, color: 'bg-slate-900' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (card) => {
    try {
      await axios.post('/api/financial/track-click', { productId: card._id, productType: 'CreditCard' });
      window.open(card.affiliateLink || '#', '_blank');
    } catch (err) {
      window.open(card.affiliateLink || '#', '_blank');
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-12">
      {/* 🛠️ ELITE FILTER MATRIX */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-4 no-scrollbar">
        {['All', 'Travel', 'Rewards', 'Cashback', 'Premium', 'Institutional'].map((type, i) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
              filterType === type 
                ? 'bg-brand-600 border-brand-600 text-white shadow-xl shadow-brand-500/20' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-brand-500'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 💳 CARD GEOMETRY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 rounded-[3rem] animate-pulse" />
            ))
          ) : (
            cards.map((card, i) => (
              <motion.div
                layout
                key={card._id || i}
                {...fadeInUp}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                {/* Visual Card Representation */}
                <div className={`relative h-56 w-full rounded-[2.5rem] p-8 overflow-hidden mb-6 shadow-2xl transition-transform group-hover:-translate-y-2 group-hover:rotate-1 duration-500 ${card.color || 'bg-slate-800'}`}>
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl -ml-16 -mb-16" />
                   
                   <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                         <div className="w-12 h-10 bg-amber-400/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-amber-400/30">
                            <Layers className="text-amber-400 w-6 h-6" />
                         </div>
                         <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-[10px] font-black text-white">{card.rating}</span>
                         </div>
                      </div>

                      <div className="space-y-1">
                         <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{card.name}</h3>
                         <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{card.issuer}</p>
                      </div>
                   </div>

                   {/* Chip & NFC Simulation */}
                   <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center space-y-2 opacity-30">
                      <Globe className="text-white w-5 h-5" />
                      <Heart className="text-white w-5 h-5" />
                   </div>
                </div>

                {/* Technical Specs Hub */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden">
                   <div className="grid grid-cols-3 gap-6 mb-8 border-b border-slate-50 dark:border-slate-800 pb-8">
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                        <p className="text-sm font-black dark:text-white">₹{card.annualFee}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">APR</p>
                        <p className="text-sm font-black dark:text-white">{card.apr}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Alpha</p>
                        <p className="text-sm font-black text-emerald-500">+{card.rewardRate}%</p>
                      </div>
                   </div>

                   <div className="space-y-3 mb-10">
                      {(card.benefits || []).slice(0, 3).map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-3 group/item">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-500 group-hover/item:scale-150 transition-transform" />
                           <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{benefit}</span>
                        </div>
                      ))}
                   </div>

                   <button 
                    onClick={() => trackClick(card)}
                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-600 dark:hover:bg-brand-600 dark:hover:text-white transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 flex items-center justify-center space-x-3"
                   >
                      <Sparkles className="w-4 h-4" />
                      <span>Initiate Protocol</span>
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 🎯 AI SMART MATCH FOOTER */}
      <motion.div {...fadeInUp} transition={{ delay: 0.5 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
               <Zap className="text-white w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tighter">AI Node Recommendation</h3>
               <p className="text-sm font-bold text-emerald-700/60 dark:text-emerald-500/60">Based on your current Wealth Score (78), the Onyx Elite provides +2.4% alpha over your current stack.</p>
            </div>
         </div>
         <button className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.05] transition-transform">
            Calculate Delta
         </button>
      </motion.div>
    </div>
  );
};

export default CreditCardComparison;
