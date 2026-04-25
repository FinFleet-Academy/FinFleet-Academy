import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Send, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const NewsletterSignup = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/support-system/newsletter/subscribe', { 
        email, 
        preferences: ['MARKETS', 'UPDATES'] 
      });
      setSubscribed(true);
      toast.success("Identity Enrolled in Feed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol Error");
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'simple') {
    return (
      <form onSubmit={handleSubscribe} className="flex items-center space-x-2">
        <input 
          type="email" required placeholder="Protocol Email..." value={email} onChange={e => setEmail(e.target.value)}
          className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold text-white focus:border-brand-500 outline-none transition-all"
        />
        <button type="submit" disabled={loading} className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-500 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </form>
    );
  }

  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16 group-hover:opacity-20 transition-opacity" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-brand-500">
             <Sparkles className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">Neural Intelligence Feed</span>
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Stay Synchronized.</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Get real-time market intelligence and platform protocol updates.</p>
        </div>

        {subscribed ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-2xl">
             <CheckCircle className="w-5 h-5 text-emerald-500" />
             <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Identity Subscribed</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex-grow max-w-md w-full flex items-center bg-[#020617] border border-white/5 rounded-[1.5rem] p-1.5 shadow-2xl focus-within:border-brand-500/30 transition-all">
             <div className="pl-4 pr-2"><Mail className="w-4 h-4 text-slate-600" /></div>
             <input 
               type="email" required placeholder="Enter protocol email..." value={email} onChange={e => setEmail(e.target.value)}
               className="flex-grow bg-transparent border-none px-2 py-3 text-xs font-bold text-white outline-none"
             />
             <button 
               type="submit" disabled={loading}
               className="bg-white text-slate-950 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors disabled:opacity-50"
             >
                {loading ? '...' : 'Subscribe'}
             </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;
