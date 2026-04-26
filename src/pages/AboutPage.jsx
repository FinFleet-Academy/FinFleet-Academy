import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Lightbulb, TrendingUp, Compass, GraduationCap, 
  BarChart3, Layers, BrainCircuit, ArrowRight, Star,
  ShieldCheck, Zap, Globe, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -10 }}
    className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all group"
  >
    <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-brand-600" />
    </div>
    <h3 className="text-xl font-black dark:text-white mb-4 uppercase tracking-tighter">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">{description}</p>
  </motion.div>
);

const AboutPage = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Zero to Master",
      description: "Comprehensive paths designed for the retail mind. No prior experience required to reach mastery."
    },
    {
      icon: BarChart3,
      title: "Practical Learning",
      description: "We focus on actual market mechanics. Moving beyond paper theory to real-world execution."
    },
    {
      icon: Layers,
      title: "Step-by-Step",
      description: "A structured approach designed to build your knowledge piece by piece with precision."
    },
    {
      icon: BrainCircuit,
      title: "Mindset & Discipline",
      description: "Building resilient psychology. We prioritize risk management over high-leverage gambles."
    }
  ];

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden border-b border-slate-200 dark:border-slate-800/50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500 rounded-full blur-[150px] opacity-10 -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-10 -ml-32 -mb-32" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-8 border border-brand-100 dark:border-brand-800">
             <Star className="w-3 h-3 text-brand-600 fill-brand-600" />
             <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Our Mission</span>
          </motion.div>
          <div className="max-w-4xl">
             <motion.h1 
               {...fadeInUp} transition={{ delay: 0.1 }}
               className="text-6xl md:text-9xl font-black dark:text-white mb-10 leading-[0.9] tracking-tighter"
             >
               We are the <span className="text-gradient">Community.</span>
             </motion.h1>
             <motion.p 
               {...fadeInUp} transition={{ delay: 0.2 }}
               className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 font-bold leading-tight"
             >
               Making professional trading education accessible to everyone. <br className="hidden md:block" />
               Empowering one learner at a time.
             </motion.p>
          </div>
        </div>
      </section>

      {/* 2. Mission Section */}
      <section className="py-32 bg-white dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-xs font-black dark:text-white uppercase tracking-[0.4em] text-slate-400">Why We Exist</h2>
              <div className="space-y-8 text-lg font-bold leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  FinFleet Academy emerged from a single realization: the gap between retail hope and professional execution is wider than ever.
                </p>
                <p>
                  We are not another "get rich" scheme. We are a comprehensive learning platform designed for those who view finance as a serious craft.
                </p>
                <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform"><Target className="w-16 h-16 text-white" /></div>
                  <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-4">Our Core Goal</h4>
                  <p className="text-white text-2xl font-black italic tracking-tight">"To transform raw market interest into real-world market expertise."</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-8"
            >
              <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6">
                   <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-black dark:text-white mb-4 uppercase tracking-tighter">Global Vision</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">
                  To become the primary resource for the next generation of global investors. We believe financial literacy is a fundamental right.
                </p>
              </div>
              <div className="p-10 bg-brand-600 rounded-[3rem] text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20"><Zap className="w-16 h-16" /></div>
                <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">What You'll Learn</h3>
                <ul className="space-y-4">
                  {['Market Mechanics', 'Investor Psychology', 'Risk Management', 'Step-by-Step Learning'].map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center md:text-left mb-20">
            <h2 className="text-4xl font-black dark:text-white mb-4 uppercase tracking-tighter">The FinFleet Academy Advantage.</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">World-Class Learning Platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full blur-[150px] opacity-20 -mr-48 -mt-48" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.95] tracking-tighter"
              >
                Start your <br /> <span className="text-brand-500">learning journey.</span>
              </motion.h2>
              <p className="text-slate-400 text-lg md:text-xl font-bold mb-12 leading-relaxed">
                Join 50,000+ members in the world's most advanced financial education ecosystem.
              </p>
              <Link 
                to="/signup"
                className="inline-flex items-center space-x-3 px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-slate-700">
               <Heart className="w-3 h-3 fill-red-500/20" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Made with love by the FinFleet Academy Team</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
