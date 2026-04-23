import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Mail, Lock, User, ArrowRight, ShieldCheck, Star, Zap, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, PLANS } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', referralCode: '' });
  const [selectedPlan, setSelectedPlan] = useState(PLANS.FREE);
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData.name, formData.email, formData.password, selectedPlan, formData.referralCode);
      toast.success(`Protocol Successful. Welcome to the Fleet, ${formData.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration protocol failure.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-brand-500/20 py-20 lg:py-32">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500 rounded-full blur-[150px] opacity-10 -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-10 -ml-32 -mb-32" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10"
      >
        {/* Left Side: Institutional Manifesto */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
          <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-4 w-fit border border-brand-100 dark:border-brand-800">
             <Rocket className="w-3 h-3 text-brand-600" />
             <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">New Recruit Onboarding</span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h2 
              {...fadeInUp} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter leading-[0.9]"
            >
              Master the <br /> <span className="text-gradient">Market.</span>
            </motion.h2>
            <motion.p 
              {...fadeInUp} transition={{ delay: 0.2 }}
              className="text-slate-500 dark:text-slate-400 text-lg font-bold"
            >
              Join the world's most advanced financial education infrastructure.
            </motion.p>
          </div>

          <div className="space-y-8">
            {[
              { text: "Access 50+ Institutional Modules", icon: ShieldCheck },
              { text: "Real-time Macro Intelligence Feed", icon: Zap },
              { text: "AI-Powered Performance Analytics", icon: Activity },
              { text: "Gated Community Alpha Streams", icon: Star }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-center space-x-4 text-slate-600 dark:text-slate-400"
              >
                <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center">
                   <item.icon className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            {...fadeInUp} transition={{ delay: 0.7 }}
            className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5"><Star className="w-12 h-12 text-brand-600" /></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
              "FinFleet is the first platform that actually treats financial education with institutional rigor. The Elite protocol is unmatched."
            </p>
            <div className="mt-6 flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full border-2 border-brand-500/20" />
              <div>
                <div className="text-[10px] font-black dark:text-white uppercase tracking-widest">Sarah Jenkins</div>
                <div className="text-[9px] font-bold text-brand-600 uppercase tracking-[0.2em]">Institutional Trader</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Auth Terminal */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[120px] opacity-10 -mr-32 -mt-32" />
             
             <div className="text-center md:text-left mb-12">
                <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-2">Initialize Profile.</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Configure your institutional seat</p>
             </div>

             <form onSubmit={handleSignup} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-4 text-xs font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                        placeholder="FULL NAME"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Node</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-4 text-xs font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                        placeholder="EMAIL@NODE.COM"
                      />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Cipher</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-4 text-xs font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Referral (Optional)</label>
                    <div className="relative">
                      <Rocket className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text" value={formData.referralCode} onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-4 text-xs font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                        placeholder="REF-ALPHA-01"
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Onboarding Tier</label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {[PLANS.FREE, PLANS.PRO, PLANS.ELITE, PLANS.PRIME].map((p) => (
                     <button
                       key={p} type="button" onClick={() => setSelectedPlan(p)}
                       className={`text-[9px] py-4 rounded-xl border-2 font-black uppercase tracking-widest transition-all ${
                         selectedPlan === p 
                           ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/20' 
                           : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400'
                       }`}
                     >
                       {p}
                     </button>
                   ))}
                 </div>
               </div>

               <button 
                 type="submit" disabled={loading}
                 className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-4 shadow-xl active:scale-95 transition-all disabled:opacity-50"
               >
                 {loading ? (
                   <div className="w-4 h-4 border-2 border-slate-400 border-t-white dark:border-slate-600 dark:border-t-slate-950 rounded-full animate-spin" />
                 ) : (
                   <>
                     <span>Commit to Protocol</span>
                     <ArrowRight className="w-4 h-4" />
                   </>
                 )}
               </button>
             </form>

             <div className="mt-12 pt-10 border-t border-slate-50 dark:border-slate-800 text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 Already integrated?{' '}
                 <Link to="/login" className="text-brand-600 hover:text-brand-700 underline underline-offset-4">Identity Sync</Link>
               </p>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
