import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, Globe, Activity, TrendingUp, ArrowRight, 
  Newspaper, Zap, ShieldCheck, Target, Star,
  Compass, Radio
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

const AboutFinorPage = () => {
  const features = [
    {
      icon: Lightbulb,
      title: "Crystal Clarity",
      description: "We translate complex institutional jargon into high-fidelity actionable intelligence for every trader."
    },
    {
      icon: Globe,
      title: "Fleet Coverage",
      description: "Deep-dive analysis across equity markets, digital assets, and critical global economic shifts."
    },
    {
      icon: Activity,
      title: "Market Alpha",
      description: "We don't just report events; we decode the strategic 'why' and its impact on your capital allocation."
    },
    {
      icon: Zap,
      title: "Pulse Engine",
      description: "Built for the high-velocity learner. Real-time updates delivered with precision and structural depth."
    }
  ];

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden border-b border-slate-200 dark:border-slate-800/50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500 rounded-full blur-[150px] opacity-10 -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-8 border border-brand-100 dark:border-brand-800">
             <Radio className="w-3 h-3 text-brand-600" />
             <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">The News Infrastructure</span>
          </motion.div>
          <div className="max-w-4xl">
             <motion.h1 
               {...fadeInUp} transition={{ delay: 0.1 }}
               className="text-6xl md:text-9xl font-black dark:text-white mb-10 leading-[0.9] tracking-tighter"
             >
               The Signal <br /> in the <span className="text-gradient">Noise.</span>
             </motion.h1>
             <motion.p 
               {...fadeInUp} transition={{ delay: 0.2 }}
               className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 font-bold leading-tight"
             >
               Finor is the intelligence arm of FinFleet Academy. <br className="hidden md:block" />
               Raw data, transformed into strategy.
             </motion.p>
          </div>
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section className="py-32 bg-white dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-xs font-black dark:text-white uppercase tracking-[0.4em] text-slate-400">Institutional Protocol</h2>
              <div className="space-y-8 text-lg font-bold leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  Finor was built to solve a specific market failure: the overwhelming volume of non-actionable information.
                </p>
                <p>
                  We prioritize signal over story. Our newsroom operates on a zero-noise protocol, delivering only the intelligence that shifts market structure.
                </p>
                <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform"><Compass className="w-16 h-16 text-white" /></div>
                  <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-4">Intel Strategy</h4>
                  <p className="text-white text-2xl font-black italic tracking-tight">"To provide the fundamental compass for modern capital navigators."</p>
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
                <div className="flex items-center space-x-4 mb-8">
                   <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-2xl">
                      <ShieldCheck className="w-6 h-6 text-brand-600" />
                   </div>
                   <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Verified Intel</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed mb-6">
                  Every data point in the Finor stream is cross-verified against primary institutional sources. We don't trade on rumors.
                </p>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.5 }}
                     className="h-full bg-brand-600" 
                   />
                </div>
              </div>
              <div className="p-10 bg-brand-600 rounded-[3rem] text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20"><Target className="w-16 h-16" /></div>
                <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">Sector Intelligence</h3>
                <div className="grid grid-cols-2 gap-6">
                  {['Institutional Equity', 'Digital Assets', 'Macro Frameworks', 'Strategic Policy'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest">
                      <TrendingUp className="w-3.5 h-3.5 text-white/50" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center md:text-left mb-20">
             <h2 className="text-4xl font-black dark:text-white mb-4 uppercase tracking-tighter">Intel Specifications.</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">High-Fidelity News Infrastructure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full blur-[150px] opacity-20 -mr-48 -mt-48" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.95] tracking-tighter">Connect to the <br /> <span className="text-brand-500">Live Stream.</span></h2>
              <p className="text-slate-400 text-lg md:text-xl font-bold mb-12 leading-relaxed">
                Unlock the full power of Finor intelligence with a premium institutional seat.
              </p>
              <Link 
                to="/finor" 
                className="inline-flex items-center space-x-3 px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <span>Enter Intel Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutFinorPage;
