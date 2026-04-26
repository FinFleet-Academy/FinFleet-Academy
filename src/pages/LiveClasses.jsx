import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, User, ArrowRight, ExternalLink, 
  BellRing, PlayCircle, CheckCircle2, AlertCircle, Sparkles,
  Info, ShieldCheck, Lock, CreditCard, Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LiveClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get('/api/live-classes');
      setClasses(data);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleJoin = async (cls) => {
    if (!user) return toast.error('Please login to join live classes');
    
    try {
      setProcessing(cls._id);
      const { data } = await axios.post(`/api/live-classes/${cls._id}/join`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (data.joinUrl) {
        window.open(data.joinUrl, '_blank');
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.requiresPayment) {
        handlePayment(cls);
      } else {
        toast.error(error.response?.data?.message || 'Failed to join class');
      }
    } finally {
      setProcessing(null);
    }
  };

  const handlePayment = async (cls) => {
    try {
      setProcessing(cls._id);
      const res = await loadRazorpay();
      if (!res) return toast.error('Razorpay SDK failed to load');

      const { data: order } = await axios.post(`/api/live-classes/${cls._id}/pay`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_mock_id',
        amount: order.amount,
        currency: order.currency,
        name: 'FinFleet Academy',
        description: `Enrollment for ${cls.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            toast.loading('Verifying payment...');
            await axios.post('/api/payments/verify-live', response, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.dismiss();
            toast.success('Payment successful! Access granted.');
            fetchClasses();
          } catch (err) {
            toast.dismiss();
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#0F172A' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setProcessing(null);
    }
  };

  const liveNow = classes.filter(c => c.status === 'live');
  const upcoming = classes.filter(c => c.status === 'upcoming');
  const completed = classes.filter(c => c.status === 'completed');

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20 pb-32">
      {/* Hero Section */}
      <section className="pt-24 pb-16 border-b border-slate-200 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
           <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-8 border border-brand-100 dark:border-brand-800">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Live Academy Sessions</span>
           </motion.div>
           <div className="max-w-3xl">
              <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-4xl md:text-7xl font-black dark:text-white tracking-tighter mb-6">
                 Live <span className="text-gradient">Classes.</span>
              </motion.h1>
              <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                 Join our expert-led live sessions to decode market trends and master trading strategies in real-time.
              </motion.p>
           </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* LIVE NOW SECTION */}
        {liveNow.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center space-x-4 mb-10">
              <div className="flex items-center space-x-2 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Live Now</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {liveNow.map((c) => (
                <motion.div 
                  key={c._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32" />
                  
                  <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center relative group overflow-hidden shadow-inner">
                    <PlayCircle className="w-16 h-16 text-red-500 group-hover:scale-110 transition-transform z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50" />
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="flex items-center bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-lg"><User className="w-3.5 h-3.5 mr-2" /> {c.instructor}</div>
                       <div className="flex items-center bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-lg"><Clock className="w-3.5 h-3.5 mr-2" /> {c.duration} mins</div>
                       <div className={`flex items-center px-3 py-1 rounded-lg ${c.classType === 'paid' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {c.classType === 'paid' ? <Lock className="w-3.5 h-3.5 mr-2" /> : <ShieldCheck className="w-3.5 h-3.5 mr-2" />}
                          {c.classType === 'paid' ? `₹${c.price}` : 'Free'}
                       </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter leading-tight">
                      {c.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                    <button 
                      onClick={() => handleJoin(c)}
                      disabled={processing === c._id}
                      className="inline-flex items-center space-x-3 px-10 py-5 bg-red-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
                    >
                      {processing === c._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                      <span>{c.classType === 'paid' ? 'Secure Join' : 'Join Now'}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* UPCOMING CLASSES */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-black dark:text-white uppercase tracking-widest flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-brand-600" />
              Upcoming Sessions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-[2.5rem] h-80 border border-slate-100 dark:border-slate-800" />
              ))
            ) : upcoming.length > 0 ? (
              upcoming.map((c) => (
                <motion.div 
                  key={c._id}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  {c.classType === 'paid' && (
                    <div className="absolute top-6 right-6 p-2 bg-amber-500/10 rounded-xl text-amber-600">
                       <Lock className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-[9px] font-black text-brand-600 uppercase tracking-widest rounded-lg">
                      {new Date(c.scheduledTime).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                       <Clock className="w-3.5 h-3.5 mr-1.5" /> {new Date(c.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-4 group-hover:text-brand-600 transition-colors">
                    {c.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                          <User className="w-3.5 h-3.5 mr-2" /> {c.instructor}
                       </span>
                       <span className={`text-[10px] font-black uppercase ${c.classType === 'paid' ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {c.classType === 'paid' ? `₹${c.price}` : 'Free Session'}
                       </span>
                    </div>
                    <button 
                      onClick={() => c.classType === 'paid' ? handlePayment(c) : toast.success('Reminder set!')}
                      disabled={processing === c._id}
                      className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-slate-400 hover:text-brand-600 transition-all border border-slate-100 dark:border-slate-800 group-hover:bg-brand-500 group-hover:text-white"
                    >
                      {c.classType === 'paid' ? <CreditCard className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No upcoming classes scheduled</p>
              </div>
            )}
          </div>
        </section>

        {/* COMPLETED CLASSES */}
        {completed.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-widest flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-500" />
                Recorded Sessions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {completed.map((c) => (
                <div key={c._id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm opacity-70 hover:opacity-100 transition-all cursor-pointer group">
                  <div className="w-full aspect-video bg-slate-50 dark:bg-slate-950 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <Video className="w-8 h-8 text-slate-300 z-10" />
                    <div className="absolute inset-0 bg-brand-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </div>
                  <h4 className="text-sm font-black dark:text-white uppercase tracking-tight mb-2 truncate group-hover:text-brand-600">{c.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.scheduledTime).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Information Banner */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10">
           <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-10 h-10 text-brand-600" />
           </div>
           <div>
              <h4 className="text-sm font-black dark:text-white uppercase tracking-widest mb-3">Participation & Security</h4>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-relaxed max-w-4xl">
                FinFleet Academy Live Classes are hosted on Google Meet and Zoom. Paid sessions are strictly gated—links are only visible after payment verification. 
                Please ensure you join with the same email used for your FinFleet Academy account.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
