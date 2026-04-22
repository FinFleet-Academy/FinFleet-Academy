import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Globe, Activity, TrendingUp, ArrowRight, Newspaper, Zap, ShieldCheck, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl hover:border-brand-500/50 transition-all group"
  >
    <div className="w-14 h-14 bg-brand-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-brand-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const AboutFinorPage = () => {
  const features = [
    {
      icon: Lightbulb,
      title: "Simplified News",
      description: "We break down complex financial jargon into clear, easy-to-understand stories for everyone."
    },
    {
      icon: Globe,
      title: "Market Coverage",
      description: "Comprehensive insights across Stock Markets, Crypto, and Global Economic shifts."
    },
    {
      icon: Activity,
      title: "Actionable Insights",
      description: "We don't just report news; we help you understand the 'why' and how it affects your portfolio."
    },
    {
      icon: Zap,
      title: "Modern Approach",
      description: "Designed specifically for today's fast-paced learners, traders, and long-term investors."
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-slate-900">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-600/10 blur-[150px] rounded-full"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-brand-500/10 text-brand-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-brand-500/20">
              <Newspaper className="w-4 h-4" />
              <span>Finor by FinFleet Academy</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Finor</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
              Financial News, Simplified. We cut through the noise to bring you the insights that truly matter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-slate-900/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-600/20 blur-3xl rounded-full"></div>
              <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
                Why we created <span className="text-brand-500">Finor</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-400">
                <p>
                  Finor is a financial news platform by FinFleet Academy, built to deliver clear, reliable, and simplified insights from the world of finance.
                </p>
                <p>
                  In a market full of noise, complex jargon, and overwhelming information, Finor focuses on what truly matters—helping you understand the news, not just read it.
                </p>
                <p>
                  Whether you're a beginner starting your first investment or an active market follower, Finor keeps you updated without the confusion.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6"
            >
              <div className="p-8 bg-slate-900/80 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                 <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-brand-600/20 rounded-2xl">
                       <ShieldCheck className="w-6 h-6 text-brand-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Trust & Clarity</h3>
                 </div>
                 <p className="text-slate-400 mb-6">
                    Our editors work around the clock to verify data and present it in a way that is actionable and honest.
                 </p>
                 <div className="h-1 w-full bg-gradient-to-r from-brand-600 to-transparent rounded-full opacity-30"></div>
              </div>
              <div className="p-8 bg-brand-600/10 rounded-[2.5rem] border border-brand-500/20">
                 <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-brand-600/20 rounded-2xl">
                       <Target className="w-6 h-6 text-brand-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Our Focus</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {['Stock Market', 'Crypto Assets', 'Economic Trends', 'Expert Opinion'].map((item, i) => (
                      <div key={i} className="flex items-center space-x-2 text-slate-300 font-bold text-sm">
                        <TrendingUp className="w-4 h-4 text-brand-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-6">Built for Modern Investors</h2>
            <div className="w-20 h-1.5 bg-brand-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-slate-900 to-brand-900/30 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-6">Stay Ahead with Smarter News</h2>
                <p className="text-slate-400 text-xl mb-10">
                   Join thousands of modern investors who rely on Finor for clear financial insights.
                </p>
                <Link to="/finor" className="btn-primary inline-flex items-center px-10 py-4 text-lg">
                   Explore Latest News <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutFinorPage;
