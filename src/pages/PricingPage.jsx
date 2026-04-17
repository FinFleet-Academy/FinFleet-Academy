import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Star, Crown, Zap, Tag } from 'lucide-react';
import { PLANS, useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PricingCard = ({ tier, isPopular }) => {
  const { plan, upgradePlan, isAuthenticated, appliedCoupon } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    upgradePlan(tier.name);
    let msg = `Successfully upgraded to ${tier.name}!`;
    if (appliedCoupon && tier.price > 0) msg += ` (Applied ${appliedCoupon.discountPercent}% off)`;
    toast.success(msg);
  };

  const isCurrentPlan = plan === tier.name;

  // Calculate discount
  let finalPrice = tier.price;
  let hasDiscount = false;
  
  if (appliedCoupon && tier.price > 0) {
    const discountAmount = (tier.price * appliedCoupon.discountPercent) / 100;
    finalPrice = Math.max(0, tier.price - discountAmount);
    // Round to whole number for display
    finalPrice = Math.round(finalPrice);
    hasDiscount = true;
  }

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`card-premium relative h-full flex flex-col ${
        isPopular ? 'border-brand-500/50 shadow-brand-500/10 ring-1 ring-brand-500/20' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${tier.iconBg}`}>
          <tier.icon className={`w-6 h-6 ${tier.iconColor}`} />
        </div>
        <h3 className="text-xl font-bold dark:text-white mb-2">{tier.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{tier.desc}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline flex-wrap gap-2">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-slate-400 line-through">${tier.price}</span>
              <span className="text-4xl font-extrabold text-accent-success">${finalPrice}</span>
            </>
          ) : (
            <span className="text-4xl font-extrabold dark:text-white">${tier.price}</span>
          )}
          <span className="text-slate-500 ml-1">/month</span>
        </div>
        {hasDiscount && (
          <div className="text-xs font-bold text-accent-success mt-2 bg-accent-success/10 inline-block px-2 py-1 rounded">
             {appliedCoupon.discountPercent}% Discount Applied!
          </div>
        )}
      </div>

      <div className="space-y-4 mb-10 flex-grow">
        {tier.features.map((feature, idx) => (
          <div key={idx} className="flex items-start space-x-3 text-sm">
            {feature.included ? (
              <Check className="w-5 h-5 text-accent-success shrink-0" />
            ) : (
              <X className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0" />
            )}
            <span className={feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 line-through'}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpgrade}
        disabled={isCurrentPlan}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          isCurrentPlan 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
            : isPopular 
              ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30' 
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50'
        }`}
      >
        {isCurrentPlan ? 'Current Plan' : tier.cta}
      </button>
    </motion.div>
  );
};

const CoursesPage = () => {
  const { appliedCoupon, validateAndApplyCoupon, removeCoupon } = useAuth();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = validateAndApplyCoupon(couponInput);
    if (result.success) {
      toast.success(result.message);
      setCouponInput('');
    } else {
      toast.error(result.message);
    }
  };

  const tiers = [
    {
      name: PLANS.FREE,
      price: 0,
      desc: 'Perfect for getting started with the basics of trading.',
      cta: 'Get Started Free',
      icon: Shield,
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-600 dark:text-slate-400',
      features: [
        { text: 'Basic Trading Knowledge', included: true },
        { text: 'Free E-book (Starter)', included: true },
        { text: 'Limited Financial News', included: true },
        { text: 'Ads Enabled', included: true },
        { text: 'AI Chatbot Access', included: false },
        { text: 'Live Classes', included: false },
      ]
    },
    {
      name: PLANS.PRO,
      price: 29,
      desc: 'Advanced tools and advice for serious traders.',
      cta: 'Go Pro',
      isPopular: false,
      icon: Zap,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600',
      features: [
        { text: 'Advanced Trading Courses', included: true },
        { text: 'Daily Market News', included: true },
        { text: 'Investment Advice', included: true },
        { text: 'No Ads', included: true },
        { text: 'AI Chatbot Access', included: false },
        { text: 'Live Classes', included: false },
      ]
    },
    {
      name: PLANS.ELITE,
      price: 99,
      desc: 'Everything you need to master the markets.',
      cta: 'Upgrade to Elite',
      isPopular: true,
      icon: Star,
      iconBg: 'bg-brand-100 dark:bg-brand-900/30',
      iconColor: 'text-brand-600',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Live Trading Classes', included: true },
        { text: 'AI Chatbot (5 chats/day)', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Exclusive Strategies', included: false },
        { text: 'Personal Mentorship', included: false },
      ]
    },
    {
      name: PLANS.PRIME,
      price: 249,
      desc: 'The ultimate experience for professional results.',
      cta: 'Get Elite Prime',
      icon: Crown,
      iconBg: 'bg-accent-gold/10',
      iconColor: 'text-accent-gold',
      features: [
        { text: 'Everything in Elite', included: true },
        { text: 'AI Chatbot (Unlimited)', included: true },
        { text: 'Personal Mentorship', included: true },
        { text: 'Elite Community Access', included: true },
        { text: 'Real-time Signals', included: true },
        { text: 'Direct Teacher Support', included: true },
      ]
    }
  ];

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 dark:text-white"
          >
            Invest in your <span className="text-brand-600">Future</span>
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
            Choose the plan that fits your trading goals. Upgrade or downgrade anytime.
          </p>

          {/* Coupon Input Area */}
          <div className="max-w-md mx-auto card-premium p-4 flex flex-col justify-center gap-4">
            {appliedCoupon ? (
               <div className="flex items-center justify-between bg-accent-success/10 border border-accent-success/20 rounded-xl p-3">
                 <div className="flex items-center space-x-2 text-accent-success">
                   <Check className="w-5 h-5" />
                   <span className="font-bold text-sm">Coupon {appliedCoupon.code} applied! ({appliedCoupon.discountPercent}% off)</span>
                 </div>
                 <button onClick={removeCoupon} className="text-slate-400 hover:text-red-500">
                    <X className="w-5 h-5" />
                 </button>
               </div>
            ) : (
               <form onSubmit={handleApplyCoupon} className="flex gap-2">
                 <div className="relative flex-grow">
                   <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                     type="text"
                     value={couponInput}
                     onChange={(e) => setCouponInput(e.target.value)}
                     placeholder="Enter promo code"
                     className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 uppercase outline-none dark:text-white"
                   />
                 </div>
                 <button type="submit" className="btn-secondary whitespace-nowrap py-2.5">
                   Apply
                 </button>
               </form>
            )}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier, idx) => (
            <PricingCard key={idx} tier={tier} isPopular={tier.isPopular} />
          ))}
        </div>

        {/* Comparison Table (Simple Mobile-friendly) */}
        <div className="mt-32 overflow-hidden">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold dark:text-white">Full Feature Comparison</h2>
          </div>
          <div className="card-premium overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="py-6 px-4 text-sm font-bold dark:text-white">Feature</th>
                  {tiers.map(t => (
                    <th key={t.name} className="py-6 px-4 text-sm font-bold text-center dark:text-white">{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Basic Fundamentals', values: [true, true, true, true] },
                  { name: 'Advanced Strategies', values: [false, true, true, true] },
                  { name: 'Live Sessions', values: [false, false, true, true] },
                  { name: 'AI Chatbot', values: ['None', 'None', '5/day', 'Unlimited'] },
                  { name: 'Support', values: ['Email', 'Email', 'Priority', 'Direct'] },
                  { name: 'Mentorship', values: [false, false, false, true] },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-50 dark:border-slate-900 last:border-0 hover:bg-slate-100/30 dark:hover:bg-slate-800/30">
                    <td className="py-4 px-4 font-medium dark:text-slate-300">{row.name}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-4 px-4 text-center">
                        {typeof v === 'boolean' ? (
                          v ? <Check className="w-5 h-5 text-accent-success mx-auto" /> : <X className="w-5 h-5 text-slate-300 dark:text-slate-800 mx-auto" />
                        ) : (
                          <span className="text-xs font-bold text-brand-600">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
