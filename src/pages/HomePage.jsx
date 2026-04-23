import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Bot, BookOpen, Newspaper, Calculator, 
  CheckCircle2, Star, Users, ShieldCheck, Heart, 
  MessageSquare, Zap, TrendingUp, Globe, Sparkles,
  ShieldAlert, PlayCircle, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LiveChartHero = lazy(() => import('../components/shared/LiveChartHero'));

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
      
      {/* 1. PREMIUM HERO SECTION */}
      <Suspense fallback={<div className="h-[700px] flex items-center justify-center bg-slate-950"><div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <LiveChartHero />
      </Suspense>

      {/* 2. METRICS SECTION */}
      <section className="py-14 border-y border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Students', value: '12K+', icon: Users, color: 'text-brand-600' },
                { label: 'Rating', value: '4.8/5', icon: Star, color: 'text-amber-500' },
                { label: 'Daily News', value: '50+', icon: Newspaper, color: 'text-blue-500' },
                { label: 'Expert Mentors', value: '100+', icon: Sparkles, color: 'text-emerald-500' }
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

      {/* 3. COURSES SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="max-w-2xl">
              <motion.div {...fadeInUp} className="flex items-center space-x-3 mb-6">
                 <BookOpen className="w-6 h-6 text-brand-600" />
                 <h2 className="text-[10px] font-black dark:text-white uppercase tracking-[0.4em]">Learn from Experts</h2>
              </motion.div>
              <h3 className="text-3xl md:text-5xl font-black dark:text-white tracking-tight leading-tight">
                Featured <br /> <span className="text-gradient">Courses.</span>
              </h3>
            </div>
            <Link to="/courses" className="text-[11px] font-black uppercase tracking-widest text-brand-600 flex items-center hover:translate-x-3 transition-transform group">
              View All Courses <ArrowRight className="w-4 h-4 ml-3" />
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
                      "{course.description || "Master the art of investing with our comprehensive guide."}"
                    </p>
                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                       <div className="flex items-center -space-x-3">
                          {[1,2,3].map(j => <div key={j} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800" />)}
                          <span className="ml-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">+1.2K Enrolled</span>
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

      {/* 4. ANNOUNCEMENTS SECTION */}
      <section className="py-16 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <motion.div {...fadeInUp} className="inline-flex items-center space-x-3 mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10">
               <Newspaper className="w-4 h-4 text-brand-400" />
               <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Latest Updates</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">Latest <span className="text-brand-500">News.</span></h2>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">Stay updated with the latest market insights and announcements.</p>
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
                      <span className="text-[9px] font-black text-brand-500 uppercase tracking-[0.2em]">New</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter group-hover:text-brand-500 transition-colors leading-tight">{ann.title}</h3>
                  <p className="text-slate-400 text-sm font-bold leading-relaxed mb-10 line-clamp-2 italic opacity-80">"{ann.content}"</p>
                  <Link to="/community" className="inline-flex items-center text-[10px] font-black text-white uppercase tracking-[0.3em] group/btn">
                    Learn More <ArrowRight className="w-4 h-4 ml-3 group-hover/btn:translate-x-3 transition-transform text-brand-500" />
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 relative text-center px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-500 rounded-full blur-[200px] opacity-[0.03]" />
        
        <motion.div 
          whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-inner border border-brand-100 dark:border-brand-800 animate-float">
             <Sparkles className="w-10 h-10 text-brand-600" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black dark:text-white mb-6 tracking-tight leading-tight">Start Your <br /> <span className="text-gradient">Journey.</span></h2>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners and start mastering the markets today with expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             <Link to="/signup" className="btn-brand py-6 px-16 text-[12px] font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-2xl shadow-brand-500/40 group">
               Join Now
             </Link>
             <Link to="/pricing" className="btn-secondary py-6 px-16 text-[12px] font-black uppercase tracking-[0.3em] rounded-[2.5rem] group">
               Pricing Plans
             </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <Globe className="w-10 h-10" />
             <Activity className="w-10 h-10" />
             <TrendingUp className="w-10 h-10" />
             <ShieldCheck className="w-10 h-10" />
          </div>
        </motion.div>
      </section>

      {/* FOOTER BACKGROUND TEXT */}
      <div className="py-20 text-center select-none pointer-events-none overflow-hidden opacity-[0.03]">
         <h2 className="text-[20vw] font-black leading-none tracking-tighter dark:text-white">FINFLEET</h2>
      </div>

    </div>
  );
};

export default HomePage;
