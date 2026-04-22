import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Users, Award, BookOpen, MessageSquare, PlayCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      await axios.post('/api/subscribers', { 
        email, 
        source: 'newsletter' 
      });
      toast.success('Successfully subscribed to updates!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-52">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-success/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-950/30 px-4 py-2 rounded-full border border-brand-100 dark:border-brand-900 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs font-bold text-brand-700 dark:text-brand-400 tracking-wider uppercase">Live Sessions Now Available</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Master Trading. <br />
              <span className="text-brand-600">
                Build Wealth.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              Join FinFleet Academy and unlock premium trading knowledge, 
              AI-powered insights, and a community of elite investors. 
              Start your journey from beginner to professional today.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="btn-primary flex items-center group w-full sm:w-auto">
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/courses" className="btn-secondary w-full sm:w-auto">
                View All Plans
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 dark:border-slate-800 pt-10"
            >
              {[
                { label: 'Active Students', value: '15k+', icon: Users },
                { label: 'Success Rate', value: '94%', icon: TrendingUp },
                { label: 'Courses', value: '50+', icon: BookOpen },
                { label: 'Live Classes', value: '24/7', icon: PlayCircle },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <stat.icon className="w-6 h-6 text-brand-500 mb-2" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            {/* Glow effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full -mr-32 -mt-32 blur-3xl mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-success/10 rounded-full -ml-32 -mb-32 blur-3xl mix-blend-screen" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 dark:bg-slate-950/50 px-4 py-2 rounded-full border border-slate-600 mb-8 backdrop-blur-sm">
                <span className="text-xs font-bold text-brand-400 tracking-wider uppercase">🚀 NEW FEATURES COMING SOON</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Something Big is Coming</h2>
              <p className="text-slate-300 text-lg md:text-xl mb-2 max-w-2xl mx-auto">
                We're building powerful new features including AI tools, advanced trading insights, and new courses.
              </p>
              <p className="text-brand-300 font-medium mb-10">Stay tuned for updates from Finfleet Academy.</p>
              
              <div className="max-w-md mx-auto">
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 bg-slate-800/50 dark:bg-slate-950/50 border border-slate-700 focus:border-brand-500 text-white px-5 py-4 rounded-full outline-none transition-all placeholder:text-slate-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button type="submit" disabled={isSubmitting} className="bg-brand-600 text-white font-bold px-8 py-4 rounded-full hover:bg-brand-700 transition-colors w-full sm:w-auto flex-shrink-0 disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Notify Me'}
                  </button>
                </form>
                <p className="text-xs text-slate-400 mt-4">Be the first to access new features</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white">Everything you need to <span className="text-brand-600">Succeed</span></h2>
            <p className="text-slate-600 dark:text-slate-400">Our platform is designed to provide comprehensive tools and education for every stage of your trading career.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Live Trading Classes',
                desc: 'Watch professionals trade live markets and explain their strategies in real-time.',
                icon: PlayCircle,
                color: 'bg-blue-500'
              },
              {
                title: 'AI Trading Assistant',
                desc: 'Get instant answers to complex financial questions with our modern AI chatbot.',
                icon: MessageSquare,
                color: 'bg-accent-premium'
              },
              {
                title: 'Market Analysis',
                desc: 'Daily breakdowns of the global economy and specific trade setups for you to study.',
                icon: TrendingUp,
                color: 'bg-accent-success'
              },
              {
                title: 'Premium E-books',
                desc: 'Access our exclusive library of guides covering everything from basics to expert strategies.',
                icon: BookOpen,
                color: 'bg-amber-500'
              },
              {
                title: 'Verified Certificates',
                desc: 'Earn industry-recognized certificates as you complete modules and pass assessments.',
                icon: Award,
                color: 'bg-brand-600'
              },
              {
                title: 'Secure & Trusted',
                desc: 'Your learning journey is backed by our commitement to excellence and student success.',
                icon: ShieldCheck,
                color: 'bg-slate-700'
              }
            ].map((feature, idx) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={idx} 
                className="card-premium h-full transition-all border-slate-100 hover:border-brand-500/30"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-black/10`}>
                  <feature.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Mock brand logos */}
            <div className="text-xl font-bold text-slate-400">FINANCE INSIGHTS</div>
            <div className="text-xl font-bold text-slate-400">TRADER WEEKLY</div>
            <div className="text-xl font-bold text-slate-400">BULLS & BEARS</div>
            <div className="text-xl font-bold text-slate-400">MARKET PULSE</div>
            <div className="text-xl font-bold text-slate-400">WEALTH FLOW</div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Is this suitable for absolute beginners?', a: 'Yes! Our course structure starts from the very basics of financial markets and moves towards advanced strategies.' },
              { q: 'Can I access the classes on mobile?', a: 'Absolutely. FinFleet Academy is fully responsive and optimized for mobile learning.' },
              { q: 'What is the AI assistant?', a: 'Our AI Chatbot (available for Elite plans) helps you analyze market conditions and answers financial queries 24/7.' }
            ].map((faq, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-dark-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <h4 className="font-bold mb-2 dark:text-white">{faq.q}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-600 rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-success/20 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-6 relative">Ready to start your journey?</h2>
            <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto relative">
              Join 15,000+ students and gain access to the tools you need to build long-term wealth.
            </p>
            <div className="relative">
              <Link to="/signup" className="px-8 py-4 bg-white text-brand-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg">
                Join the Academy Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
