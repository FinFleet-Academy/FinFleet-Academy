import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Filter, ChevronRight, Star, ShieldCheck, Zap } from 'lucide-react';
import axios from 'axios';

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
      console.error(err);
      // Fallback for demo
      setCards([
        { id: 1, name: 'Sapphire Preferred', issuer: 'Chase', type: 'Travel', annualFee: 95, apr: 21.49, rewardRate: 2, benefits: ['60k Bonus Points', 'Travel Protection'], affiliateLink: '#', rating: 4.8 },
        { id: 2, name: 'Cash Magnet', issuer: 'Amex', type: 'Cashback', annualFee: 0, apr: 19.99, rewardRate: 1.5, benefits: ['Unlimited 1.5% Back', 'No Annual Fee'], affiliateLink: '#', rating: 4.6 },
        { id: 3, name: 'Gold Card', issuer: 'Amex', type: 'Premium', annualFee: 250, apr: 20.99, rewardRate: 4, benefits: ['4x Dining/Groceries', 'Dining Credits'], affiliateLink: '#', rating: 4.9 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (card) => {
    try {
      await axios.post('/api/financial/track-click', { productId: card.id, productType: 'CreditCard' });
      window.open(card.affiliateLink, '_blank');
    } catch (err) {
      window.open(card.affiliateLink, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {['All', 'Travel', 'Rewards', 'Cashback', 'Premium'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filterType === type 
                ? 'bg-brand-600 text-white' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-brand-500'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))
        ) : (
          cards.map((card, i) => (
            <motion.div
              key={card.id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black dark:text-white leading-tight">{card.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.issuer} • {card.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/10 px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-amber-700 dark:text-amber-400">{card.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Fee</p>
                  <p className="text-sm font-black dark:text-white">₹{card.annualFee}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">APR</p>
                  <p className="text-sm font-black dark:text-white">{card.apr}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reward Rate</p>
                  <p className="text-sm font-black text-emerald-500">{card.rewardRate}%</p>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                {card.benefits.slice(0, 2).map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                    <ShieldCheck className="w-3 h-3 text-brand-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => trackClick(card)}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 dark:hover:text-white transition-all flex items-center justify-center space-x-2"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreditCardComparison;
