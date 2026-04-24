import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, BookOpen, Newspaper, Users, Star, Sparkles, Zap, Globe, PlayCircle, Activity
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

      {/* Huge Background Branding */}
      <div className="pb-20 text-center select-none pointer-events-none opacity-[0.02]">
        <h2 className="text-[25vw] font-black leading-none tracking-tighter dark:text-white">FLEET</h2>
      </div>
    </div>
  );
};

export default HomePage;
