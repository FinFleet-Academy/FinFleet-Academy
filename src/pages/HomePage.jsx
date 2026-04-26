import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, BookOpen, Newspaper, Users, Star, Sparkles, Zap, Globe, PlayCircle, Activity,
  ShieldCheck, BarChart4, LineChart, Cpu, PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { uiContent } from '../config/ui-content';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const PremiumLiveChart = lazy(() => import('../components/shared/PremiumLiveChart'));

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const res = await axios.get('/api/courses');
        setCourses((res.data.courses || res.data).slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreviewData();
  }, []);

  return (
    <div className="bg-white dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20 overflow-x-hidden">
      
      {/* 1. Hero */}
      <Suspense fallback={<div className="h-[700px] bg-slate-950 animate-pulse" />}>
        <PremiumLiveChart />
      </Suspense>

      {/* 1.5. Quant Platform (Coming Soon) */}
      <section className="relative py-32 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950 to-brand-950/30 opacity-60" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center space-x-3 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em]">Institutional Grade System</span>
              </div>

              <h2 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                FinFleet <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Quant Platform.</span>
              </h2>

              <p className="text-lg font-bold text-slate-400 leading-relaxed italic max-w-xl">
                FinFleet Quant Platform is our upcoming advanced financial system designed to deliver institutional-grade intelligence to traders and investors.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: Globe, text: 'Real-time market data' },
                  { icon: Sparkles, text: 'AI-powered insights' },
                  { icon: LineChart, text: 'Quantitative analysis' },
                  { icon: ShieldCheck, text: 'Risk management tools' },
                  { icon: PieChart, text: 'Portfolio intelligence' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-400 border border-white/5">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-10">
                <motion.div 
                  initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  <div className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    COMING SOON
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} transition={{ duration: 1 }}
              className="relative aspect-square lg:aspect-video rounded-[3rem] bg-slate-900/50 border border-white/5 overflow-hidden flex items-center justify-center shadow-3xl group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
              
              {/* Abstract Visual Elements */}
              <div className="relative flex flex-col items-center space-y-6">
                <Cpu className="w-24 h-24 text-brand-500/30 animate-pulse" />
                <div className="flex space-x-4">
                  {[1,2,3].map(i => (
                    <motion.div 
                      key={i} animate={{ height: [20, 60, 20] }} 
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="w-2 bg-brand-500/20 rounded-full" 
                    />
                  ))}
                </div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Neural Engine v4.0 Active</div>
              </div>

              {/* Glowing Corner */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Trust Metrics */}
      <section className="py-20 border-y border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { label: 'Active Learners', value: '12K+', icon: Users, color: 'text-brand-600' },
                { label: 'Platform Rating', value: '4.9/5', icon: Star, color: 'text-amber-500' },
                { label: 'Real-time Assets', value: '500+', icon: Activity, color: 'text-blue-500' },
                { label: 'Expert Mentors', value: '100+', icon: Sparkles, color: 'text-emerald-500' }
              ].map((stat, i) => (
                <motion.div 
                  key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} 
                  viewport={{ once: true }} className="text-center"
                >
                   <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-6 opacity-40`} />
                   <div className="text-4xl font-black dark:text-white tracking-tighter mb-2">{stat.value}</div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. Courses Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                 <Zap className="w-5 h-5 text-brand-600" />
                 <span className="text-[10px] font-black dark:text-white uppercase tracking-[0.4em]">{uiContent.navigation.courses}</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black dark:text-white tracking-tighter uppercase leading-none">
                Master the <br /> <span className="text-brand-600">Ecosystem.</span>
              </h2>
            </div>
            <Link to="/courses">
              <Button variant="ghost" className="text-brand-600 font-black tracking-widest uppercase text-[11px] group">
                Exploration Hub <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-96 bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] animate-pulse" />)
            ) : (
              courses.map((course, i) => (
                <Card key={course._id} padding="p-10" className="group hover:scale-[1.02] transition-all">
                  <div className="aspect-[16/10] bg-slate-50 dark:bg-slate-950 rounded-[2rem] mb-8 flex items-center justify-center relative overflow-hidden border border-slate-100 dark:border-slate-800/50">
                    <BookOpen className="w-16 h-16 text-brand-600 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-6 right-6">
                      <Badge variant="indigo">Syllabus {i + 1}</Badge>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-4 group-hover:text-brand-600 transition-colors">{course.title}</h3>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 line-clamp-2 leading-relaxed italic">"{course.description}"</p>
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center -space-x-3">
                      {[1,2,3].map(j => <div key={j} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800" />)}
                    </div>
                    <Link to={`/courses/${course._id}`}>
                      <Button variant="brand" size="sm" className="rounded-xl w-10 h-10 p-0 flex items-center justify-center">
                        <PlayCircle className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500 rounded-full blur-[200px] opacity-[0.05]" />
        <div className="max-w-4xl mx-auto relative z-10 px-6">
          <Sparkles className="w-12 h-12 text-brand-600 mx-auto mb-10 animate-float" />
          <h2 className="text-5xl lg:text-8xl font-black dark:text-white tracking-tighter uppercase leading-none mb-8">
            Your Future <br /> <span className="text-brand-600">Unlocked.</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
            <Link to="/signup">
              <Button variant="brand" size="lg" className="px-16 py-8 rounded-full text-[12px] font-black shadow-2xl shadow-brand-500/30">
                Join Enterprise
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary" size="lg" className="px-16 py-8 rounded-full text-[12px] font-black">
                View Access Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. About & Ecosystem */}
      <section className="py-32 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* About Academy */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter mb-8">About <span className="text-brand-600">FinFleet Academy</span></h2>
              <p className="text-lg font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                FinFleet Academy is a next-generation financial education platform designed to help individuals learn, practice, and master the stock market. We combine structured learning, real-time tools, and AI-powered insights to create a complete trading ecosystem.
              </p>
            </motion.div>

            {/* About Finor */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter mb-8">About <span className="text-indigo-500">Finor AI</span></h2>
              <p className="text-lg font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                Finor is our AI-powered financial intelligence engine that analyzes market trends, generates real-time insights, and delivers smart financial news to help users make data-driven decisions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Connect with FinFleet */}
      <section className="py-32 bg-[#080C10] relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
            >
              Connect with <span className="text-brand-500">FinFleet</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-slate-400 font-bold text-sm tracking-wide"
            >
              Reach out, follow updates, or get support
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: 'WhatsApp', subtitle: 'Chat with us instantly', icon: <Zap className="w-5 h-5" />, link: 'https://wa.me/918986165504' },
              { name: 'Instagram', subtitle: 'Follow for updates', icon: <Globe className="w-5 h-5" />, link: 'https://www.instagram.com/finfleetacademy/' },
              { name: 'LinkedIn', subtitle: 'Institutional network', icon: <Users className="w-5 h-5" />, link: 'https://www.linkedin.com/company/finfleet-academy/' },
              { name: 'YouTube', subtitle: 'Video masterclasses', icon: <PlayCircle className="w-5 h-5" />, link: 'https://youtube.com/@finfleetacademy' },
              { name: 'Finor AI', subtitle: 'Intelligence updates', icon: <Activity className="w-5 h-5" />, link: 'https://www.instagram.com/finor.in/' },
              { name: 'Email', subtitle: 'Contact support', icon: <Newspaper className="w-5 h-5" />, link: 'mailto:info@finfleetacademy.com' }
            ].map((social, i) => (
              <motion.a
                key={i} href={social.link} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(99,102,241,0.3)' }}
                className="flex flex-col p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] group transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  {social.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{social.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{social.subtitle}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Huge Background Branding */}
      <div className="pb-20 text-center select-none pointer-events-none opacity-[0.02]">
        <h2 className="text-[25vw] font-black leading-none tracking-tighter dark:text-white uppercase">FLEET</h2>
      </div>
    </div>
  );
};

export default HomePage;
