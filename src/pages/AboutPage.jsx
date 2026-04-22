import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, TrendingUp, Compass, GraduationCap, BarChart3, Layers, BrainCircuit, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl hover:border-brand-500/50 transition-all group"
  >
    <div className="w-12 h-12 bg-brand-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-brand-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const AboutPage = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Beginner Friendly",
      description: "Learn from scratch with simple explanations. No prior financial knowledge required."
    },
    {
      icon: BarChart3,
      title: "Practical Learning",
      description: "Focus on real-world financial understanding. We move beyond theory to actual application."
    },
    {
      icon: Layers,
      title: "Structured Content",
      description: "A step-by-step learning approach designed to build your knowledge logically and effectively."
    },
    {
      icon: BrainCircuit,
      title: "Growth Mindset",
      description: "Build long-term thinking, not quick profits. We focus on sustainable wealth creation."
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">FinFleet Academy</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-8 font-medium">
                Learn Finance. Build Confidence. Create Wealth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Our Story & Mission</h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  FinFleet Academy is a modern financial education platform designed to help students, beginners, and aspiring investors understand money, markets, and wealth creation in a simple and practical way.
                </p>
                <p>
                  In today’s world, many people start investing without proper knowledge—often relying on random tips, trends, or incomplete information. FinFleet Academy was built to solve this problem by providing structured, easy-to-understand financial learning.
                </p>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <h4 className="text-brand-500 font-bold mb-3 uppercase tracking-wider text-sm">Our Mission</h4>
                  <p className="text-white italic">"To make financial literacy accessible and actionable for everyone."</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 gap-6"
            >
              <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700">
                <Target className="w-10 h-10 text-brand-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                <p className="text-slate-400">
                  To empower individuals to make smarter financial decisions with confidence. We believe that the right knowledge, at the right time, can completely change a person’s financial future.
                </p>
              </div>
              <div className="p-8 bg-gradient-to-br from-brand-900/20 to-slate-900 rounded-3xl border border-brand-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">What We Focus On</h3>
                <ul className="space-y-3">
                  {['Stock market fundamentals', 'Personal finance education', 'Investment mindset', 'Practical learning over theory'].map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-brand-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Us?</h2>
            <p className="text-slate-400">We provide the tools you need to master your finances.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-brand-600 to-blue-700 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Master Your Money?</h2>
              <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
                Start your financial learning journey today with FinFleet Academy and build the future you deserve.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-white text-brand-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all flex items-center mx-auto"
              >
                Join Now <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
