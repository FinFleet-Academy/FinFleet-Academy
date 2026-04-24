import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Shield, Star, Crown, Zap, Tag, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { PLANS, useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const PricingCard = ({ tier, isPopular }) => {
  const { user, plan, setPlan, isAuthenticated, appliedCoupon } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (tier.price === 0) {
      toast.error("You are already on the Free plan!");
      return;
    }

    setLoading(true);
    try {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error('Payment system is not configured. Please contact support.');
        setLoading(false);
        return;
      }

      const { data: order } = await axios.post('/api/payments/create-order', {
        plan: tier.name
      });

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "FinFleet Academy",
        description: `Upgrade to ${tier.name} Subscription`,
        image: "https://finfleetacademy.com/vite.svg",
        order_id: order.id,
        handler: async function (response) {
          try {
            const { data } = await axios.post('/api/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: tier.name
            });

            if (data.success) {
              setPlan(tier.name);
              toast.success(`Welcome to ${tier.name}! Your account has been upgraded.`);
              navigate('/dashboard');
            }
          } catch (error) {
            console.error("Verification failed", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (error) {
      console.error("Order creation failed", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  const isCurrentPlan = plan === tier.name;

  // Calculate discount
  let finalPrice = tier.price;
  let hasDiscount = false;
  
  if (appliedCoupon && tier.price > 0) {
    const discountAmount = (tier.price * appliedCoupon.discountPercent) / 100;
    finalPrice = Math.max(0, tier.price - discountAmount);
    finalPrice = Math.round(finalPrice);
    hasDiscount = true;
  }

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`card-premium relative h-full flex flex-col p-10 ${
        isPopular ? 'ring-2 ring-brand-500 shadow-2xl shadow-brand-500/10' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${tier.iconBg}`}>
          <tier.icon className={`w-7 h-7 ${tier.iconColor}`} />
        </div>
        <h3 className="text-2xl font-black dark:text-white mb-2 uppercase tracking-tight">{tier.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed">{tier.desc}</p>
      </div>

      <div className="mb-10">
        <div className="flex items-baseline flex-wrap gap-2">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-400 line-through mb-1">₹{tier.price}</span>
              <div className="flex items-baseline">
                <span className="text-5xl font-black dark:text-white">₹{finalPrice}</span>
                <span className="text-slate-500 text-xs font-black uppercase tracking-widest ml-2">/month</span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-5xl font-black dark:text-white">₹{tier.price}</span>
              <span className="text-slate-500 text-xs font-black uppercase tracking-widest ml-2">/month</span>
            </div>
          )}
        </div>
        {hasDiscount && (
          <div className="text-[10px] font-black text-emerald-500 mt-4 bg-emerald-50 dark:bg-emerald-900/10 inline-block px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
             {appliedCoupon.discountPercent}% Discount Active
          </div>
        )}
      </div>

      <div className="space-y-5 mb-12 flex-grow">
        {tier.features.map((feature, idx) => (
          <div key={idx} className="flex items-start space-x-3 text-xs">
            {feature.included ? (
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0 mt-0.5" />
            )}
            <span className={`font-bold ${feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 line-through'}`}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpgrade}
        disabled={isCurrentPlan || loading}
        className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
          isCurrentPlan 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
            : isPopular 
              ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-xl shadow-brand-500/20 active:scale-95' 
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] active:scale-95'
        }`}
      >
        {loading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        <span>{isCurrentPlan ? 'Current Plan' : loading ? 'Processing...' : tier.cta}</span>
      </button>
    </motion.div>
  );
};

const PricingPage = () => {
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
      name: PLANS.PRO, 
      price: 199,
      desc: 'Perfect for beginners starting their learning journey.',
      cta: 'Choose Pro',
      icon: Shield,
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-600 dark:text-slate-400',
      features: [
        { text: 'Basic Learning Modules', included: true },
        { text: 'Free Starter E-book', included: true },
        { text: 'Market Updates', included: true },
        { text: 'Ads Enabled', included: true },
        { text: 'AI Assistant Access', included: false },
        { text: 'Live Classes', included: false },
      ]
    },
    {
      name: PLANS.ELITE,
      price: 699,
      desc: 'Best for active learners and future traders.',
      cta: 'Choose Elite',
      isPopular: true,
      icon: Zap,
      iconBg: 'bg-brand-50 dark:bg-brand-900/20',
      iconColor: 'text-brand-600',
      features: [
        { text: 'Advanced Courses', included: true },
        { text: 'Daily Insights', included: true },
        { text: 'Expert Advice', included: true },
        { text: 'No Ads', included: true },
        { text: 'AI Assistant Access', included: true },
        { text: 'Live Classes', included: false },
      ]
    },
    {
      name: PLANS.PRIME,
      price: 1999,
      desc: 'Complete access with personal mentorship.',
      cta: 'Choose Prime',
      isPopular: false,
      icon: Crown,
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-500',
      features: [
        { text: 'Everything in Elite', included: true },
        { text: 'Live Learning Classes', included: true },
        { text: 'Unlimited AI Chat', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Exclusive Strategies', included: true },
        { text: 'Personal Mentorship', included: true },
      ]
    }
  ];

  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-24 md:py-32 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-full mb-8 border border-brand-100 dark:border-brand-800">
             <Star className="w-4 h-4 text-brand-600 fill-brand-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Simple Pricing Plans</span>
          </motion.div>
          <motion.h1 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 dark:text-white tracking-tighter"
          >
            Upgrade Your <span className="text-gradient">Learning.</span>
          </motion.h1>
          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg font-bold leading-relaxed mb-12"
          >
            Choose the plan that fits your goals. Start learning with expert guidance and AI-powered tools.
          </motion.p>

          {/* Coupon Input Area */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="max-w-md mx-auto card-premium p-4 flex flex-col justify-center gap-4 border-dashed border-2">
            {appliedCoupon ? (
               <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-4">
                 <div className="flex items-center space-x-3 text-emerald-600">
                   <ShieldCheck className="w-5 h-5" />
                   <span className="font-black text-[10px] uppercase tracking-widest">Coupon {appliedCoupon.code} Applied</span>
                 </div>
                 <button onClick={removeCoupon} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
               </div>
            ) : (
               <form onSubmit={handleApplyCoupon} className="flex gap-3">
                 <div className="relative flex-grow">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                     type="text"
                     value={couponInput}
                     onChange={(e) => setCouponInput(e.target.value)}
                     placeholder="COUPON CODE"
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-brand-500/5 outline-none dark:text-white"
                   />
                 </div>
                 <button type="submit" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all">
                   Apply
                 </button>
               </form>
            )}
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {tiers.map((tier, idx) => (
            <PricingCard key={idx} tier={tier} isPopular={tier.isPopular} />
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          className="mt-40 overflow-hidden"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase">Plan Comparison</h2>
            <p className="text-slate-400 text-sm font-bold mt-2">Compare features across our different plans</p>
          </div>
          <div className="card-premium overflow-x-auto !p-0">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Feature</th>
                  {tiers.map(t => (
                    <th key={t.name} className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-center dark:text-white">{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs font-bold">
                {[
                  { name: 'Course Catalog Access', values: ['Basic', 'Advanced', 'Full'] },
                  { name: 'Live Classes', values: [false, false, true] },
                  { name: 'AI Assistant (msgs)', values: ['3/day', '20/day', 'Unlimited'] },
                  { name: 'Community Priority', values: ['Standard', 'High', 'Priority'] },
                  { name: 'Personal Mentorship', values: [false, false, true] },
                  { name: 'Ad-Free Experience', values: [false, true, true] },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-6 px-10 dark:text-slate-300">{row.name}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-6 px-10 text-center">
                        {typeof v === 'boolean' ? (
                          v ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-200 dark:text-slate-800 mx-auto" />
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section Shortcut */}
        <div className="mt-32 text-center">
           <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-6" />
           <p className="text-slate-500 font-bold mb-6">Have questions about our plans?</p>
           <button className="text-brand-600 font-black uppercase tracking-widest text-xs flex items-center mx-auto hover:translate-x-1 transition-transform">
              Contact Support Team <ArrowRight className="w-4 h-4 ml-2" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
