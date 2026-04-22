import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, BarChart2, Globe, Rocket } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FinorPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      await axios.post('/api/subscribers', { 
        email, 
        source: 'finor' 
      });
      toast.success('Successfully subscribed to Finor updates!');
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
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-success/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-950/30 px-4 py-2 rounded-full border border-brand-100 dark:border-brand-900 mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs font-bold text-brand-700 dark:text-brand-400 tracking-wider uppercase">🚀 Coming Soon</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Finor – Financial News & Insights
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Your trusted source for market news, analysis, and financial updates. 
              <br className="hidden md:block"/>
              We will deliver real-time market news, stock updates, crypto insights, and economic trends.
            </motion.p>
            
            <motion.div variants={itemVariants} className="text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 py-3 px-6 rounded-xl inline-block border border-brand-100 dark:border-brand-800/30">
              Finor (finor.in) is an upcoming financial news platform by Finfleet Academy.
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl border border-slate-700 dark:border-slate-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full -mr-32 -mt-32 blur-3xl mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-success/10 rounded-full -ml-32 -mb-32 blur-3xl mix-blend-screen" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">Launching Soon</h2>
            <p className="text-slate-300 text-lg mb-2 max-w-2xl mx-auto relative z-10">
              We're building a powerful financial news platform for modern investors.
            </p>
            <p className="text-brand-300 font-medium mb-10 relative z-10">Stay tuned for Finor.in</p>
            
            <div className="max-w-md mx-auto relative z-10">
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
                <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-lg hover:shadow-brand-500/25 transition-all w-full sm:w-auto flex-shrink-0 disabled:opacity-50">
                  {isSubmitting ? '...' : 'Notify Me'}
                </button>
              </form>
              <p className="text-xs text-slate-400 mt-4">Be the first to access new features when we launch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Stock Market News', icon: TrendingUp, color: 'text-brand-500' },
              { title: 'Crypto Updates', icon: Activity, color: 'text-accent-success' },
              { title: 'Economic Trends', icon: Globe, color: 'text-amber-500' },
              { title: 'Expert Opinions', icon: BarChart2, color: 'text-purple-500' }
            ].map((card, idx) => (
               <div key={idx} className="card-premium h-full group border-slate-100 hover:border-brand-500/30 transition-all">
                  <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-sm`}>
                    <card.icon className={`${card.color} w-6 h-6`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{card.title}</h3>
                  <div className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                    Coming Soon
                  </div>
               </div>
            ))}
          </div>
        </div>
      </section>
      <div className="pb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <span className="text-xl font-bold text-slate-400 dark:text-slate-500 tracking-tight">Finor</span>
          <span className="text-[10px] font-bold text-brand-600/60 dark:text-brand-400/60 uppercase tracking-[0.2em] -mt-1">By FinFleet Academy</span>
        </div>
      </div>
    </div>
  );
};

export default FinorPage;
