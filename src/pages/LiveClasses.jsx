import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, User, ArrowRight, ExternalLink, 
  BellRing, PlayCircle, CheckCircle2, AlertCircle, Sparkles,
  Info, ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LiveClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchClasses();
  }, []);

  const handleRemindMe = async (classId) => {
    if (!user) return toast.error('Please login to set reminders');
    try {
      await axios.post(`/api/live-classes/${classId}/interest`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Reminder set! We will notify you.');
    } catch (error) {
      toast.error('Failed to set reminder');
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
                  
                  <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center relative group overflow-hidden">
                    <PlayCircle className="w-16 h-16 text-red-500 group-hover:scale-110 transition-transform z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50" />
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="flex items-center"><User className="w-3.5 h-3.5 mr-2" /> {c.instructor}</div>
                       <div className="w-1 h-1 rounded-full bg-slate-300" />
                       <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-2" /> {c.duration}</div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter leading-tight">
                      {c.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {c.description}
                    </p>
                    <a 
                      href={c.meetLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 px-10 py-5 bg-red-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>Join Class Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
                <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-[2.5rem] h-64 border border-slate-100 dark:border-slate-800" />
              ))
            ) : upcoming.length > 0 ? (
              upcoming.map((c) => (
                <motion.div 
                  key={c._id}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-[9px] font-black text-brand-600 uppercase tracking-widest rounded-lg">
                      {new Date(c.dateTime).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                       <Clock className="w-3.5 h-3.5 mr-1.5" /> {new Date(c.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-4 group-hover:text-brand-600 transition-colors">
                    {c.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 line-clamp-2">
                    {c.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <User className="w-3.5 h-3.5 mr-2" /> {c.instructor}
                    </div>
                    <button 
                      onClick={() => handleRemindMe(c._id)}
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-brand-600 transition-all border border-slate-100 dark:border-slate-800"
                    >
                      <BellRing className="w-4 h-4" />
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
                <div key={c._id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm opacity-70 hover:opacity-100 transition-opacity">
                  <div className="w-full aspect-video bg-slate-50 dark:bg-slate-950 rounded-xl mb-4 flex items-center justify-center">
                    <Video className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-sm font-black dark:text-white uppercase tracking-tight mb-2 truncate">{c.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.dateTime).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
      
      {/* Information Banner */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
           <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
              <Info className="w-6 h-6 text-brand-600" />
           </div>
           <div>
              <h4 className="text-xs font-black dark:text-white uppercase tracking-widest mb-1">Participation Guidelines</h4>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-relaxed">
                Live classes are hosted on Google Meet. Please ensure you are logged in 5 minutes before the session starts. 
                Recordings are usually available within 24 hours of completion.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
