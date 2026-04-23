import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Bot, BookOpen, Newspaper, Calculator, 
  CheckCircle2, Star, Users, ShieldCheck, Heart, 
  MessageSquare, Zap, TrendingUp, Globe, Sparkles,
  ShieldAlert, PlayCircle, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const [coursesRes, annRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/announcements')
        ]);
        setCourses(coursesRes.data.slice(0, 3));
        setAnnouncements(annRes.data.slice(0, 2));
      } catch (err) {
        console.error('Failed to fetch home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreviewData();
  }, []);

  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20 overflow-x-hidden">
      
      {/* 1. INSTITUTIONAL HERO */}
      <section className="relative pt-32 pb-40 md:pt-56 md:pb-64 px-6 overflow-hidden">
        {/* Background Sophistication */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500 rounded-full blur-[160px] opacity-10 -mr-64 -mt-64 animate-glow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[140px] opacity-10 -ml-64 -mb-64 animate-glow" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-3 bg-brand-50 dark:bg-brand-900/20 px-5 py-2.5 rounded-full mb-12 border border-brand-100 dark:border-brand-800"
          >
             <div className="flex h-2 w-2">
                <div className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-brand-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></div>
             </div>
             <span className="text-[10px] font-black text-brand-700 dark:text-brand-300 uppercase tracking-[0.3em]">Institutional Protocol v2.4</span>
          </motion.div>

          <motion.h1 
            {...fadeInUp} transition={{ duration: 0.8 }}
            className="text-6xl md:text-[9.5rem] font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter mb-12"
          >
            Wealth <br /> <span className="text-gradient">Engine.</span>
          </motion.h1>

          <motion.p 
            {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 mb-16 max-w-3xl mx-auto font-bold leading-tight"
          >
            High-fidelity courses, real-time market intelligence, and a private network for the elite retail mind.
          </motion.p>
          
          <motion.div 
            {...fadeInUp} transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8"
          >
            <Link to="/courses" className="btn-brand py-6 px-12 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/30 flex items-center group">
              Start Protocol
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/community" className="btn-secondary py-6 px-12 text-[11px] font-black uppercase tracking-[0.2em] dark:text-white flex items-center group">
              Enter Community
              <Globe className="w-4 h-4 ml-3 group-hover:rotate-12 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. FLEET METRICS (Trust Bar) */}
      <section className="py-24 border-y border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Active Fleet', value: '12K+', icon: Users, color: 'text-brand-600' },
                { label: 'Intel Accuracy', value: '98.4%', icon: ShieldCheck, color: 'text-emerald-500' },
                { label: 'Daily Alpha', value: '142', icon: Zap, color: 'text-amber-500' },
                { label: 'Market Nodes', value: '500+', icon: Globe, color: 'text-blue-500' }
              ].map((stat, i) => (
                <motion.div 
                  key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} 
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                >
                   <div className="flex flex-col items-center">
                      <stat.icon className={`w-8 h-8 ${stat.color} mb-4 opacity-50`} />
                      <div className="text-4xl font-black dark:text-white tracking-tighter mb-1">{stat.value}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. STRATEGIC MODULES (Courses) */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
            <div className="max-w-2xl">
              <motion.div {...fadeInUp} className="flex items-center space-x-3 mb-6">
                 <BookOpen className="w-6 h-6 text-brand-600" />
                 <h2 className="text-[10px] font-black dark:text-white uppercase tracking-[0.4em]">Academy Infrastructure</h2>
              </motion.div>
              <h3 className="text-4xl md:text-7xl font-black dark:text-white tracking-tighter leading-[0.9]">
                Tactical <br /> <span className="text-gradient">Curriculum.</span>
              </h3>
            </div>
            <Link to="/courses" className="text-[11px] font-black uppercase tracking-widest text-brand-600 flex items-center hover:translate-x-3 transition-transform group">
              Access Full Database <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
          </div>

          <motion.div 
            variants={staggerContainer} whileInView="animate" initial="initial" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-[500px] bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] animate-pulse" />)
            ) : (
              courses.map((course, i) => (
                <motion.div key={course._id} variants={fadeInUp} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3.5rem] p-10 group hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
                  
                  <div className="aspect-[4/3] rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-10 relative overflow-hidden border border-slate-100 dark:border-slate-800/50">
                    <BookOpen className="w-20 h-20 text-brand-600 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                    <div className="absolute top-6 right-6">
                       <span className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm">Module {i + 1}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                       <h3 className="text-2xl font-black dark:text-white group-hover:text-brand-600 transition-colors tracking-tighter leading-tight uppercase">{course.title}</h3>
                       <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      "{course.description || "Mastering the structural components of capital growth."}"
                    </p>
                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                       <div className="flex items-center -space-x-3">
                          {[1,2,3].map(j => <div key={j} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800" />)}
                          <span className="ml-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">+1.2K Active</span>
                       </div>
                       <Link to={`/courses/${course._id}`} className="w-12 h-12 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                          <PlayCircle className="w-6 h-6" />
                       </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* 4. INTEL BROADCASTS (Announcements) */}
      <section className="py-40 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <motion.div {...fadeInUp} className="inline-flex items-center space-x-3 mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10">
               <Newspaper className="w-4 h-4 text-brand-400" />
               <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Global Heatmap Logs</span>
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">Fleet <span className="text-brand-500">Commms.</span></h2>
            <p className="text-slate-400 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">Official strategic updates directly from the high-command terminal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {loading ? (
              [...Array(2)].map((_, i) => <div key={i} className="h-64 bg-white/5 rounded-[3rem] animate-pulse" />)
            ) : (
              announcements.map((ann) => (
                <motion.div 
                  key={ann._id} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -20 }} viewport={{ once: true }}
                  className="p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3.5rem] hover:border-brand-500/40 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><MessageSquare className="w-24 h-24 text-white" /></div>
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center space-x-3 px-4 py-1.5 bg-brand-500/10 rounded-full border border-brand-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                      <span className="text-[9px] font-black text-brand-500 uppercase tracking-[0.2em]">Live Node</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter group-hover:text-brand-500 transition-colors leading-tight">{ann.title}</h3>
                  <p className="text-slate-400 text-sm font-bold leading-relaxed mb-10 line-clamp-2 italic opacity-80">"{ann.content}"</p>
                  <Link to="/community" className="inline-flex items-center text-[10px] font-black text-white uppercase tracking-[0.3em] group/btn">
                    Secure Participation <ArrowRight className="w-4 h-4 ml-3 group-hover/btn:translate-x-3 transition-transform text-brand-500" />
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. ELITE UPGRADE CTA */}
      <section className="py-56 relative text-center px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-500 rounded-full blur-[200px] opacity-[0.03]" />
        
        <motion.div 
          whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-inner border border-brand-100 dark:border-brand-800 animate-float">
             <Sparkles className="w-10 h-10 text-brand-600" />
          </div>
          <h2 className="text-5xl md:text-9xl font-black dark:text-white mb-10 tracking-tighter leading-[0.85]">Join the <br /> <span className="text-gradient">Expansion.</span></h2>
          <p className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 mb-16 font-bold tracking-tight max-w-2xl mx-auto">
            The private fleet is scaling. Secure your institutional seat and master the global markets.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             <Link to="/community" className="btn-brand py-6 px-16 text-[12px] font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-2xl shadow-brand-500/40 group">
               Initial Entry Protocol
             </Link>
             <Link to="/pricing" className="btn-secondary py-6 px-16 text-[12px] font-black uppercase tracking-[0.3em] rounded-[2.5rem] group">
               View Tiers
             </Link>
          </div>
          
          <div className="mt-24 flex items-center justify-center space-x-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <Globe className="w-10 h-10" />
             <Activity className="w-10 h-10" />
             <TrendingUp className="w-10 h-10" />
             <ShieldCheck className="w-10 h-10" />
          </div>
        </motion.div>
      </section>

      {/* FOOTER OVERLAY */}
      <div className="py-20 text-center select-none pointer-events-none overflow-hidden opacity-[0.03]">
         <h2 className="text-[20vw] font-black leading-none tracking-tighter dark:text-white">FINFLEET</h2>
      </div>

    </div>
  );
};

export default HomePage;
