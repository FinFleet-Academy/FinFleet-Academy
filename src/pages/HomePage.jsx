import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, BookOpen, Newspaper, Calculator, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans selection:bg-brand-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Learn Finance. <br className="hidden md:block" />
            <span className="text-brand-600">Use AI.</span> Make Better Decisions.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            FinFleet is an AI-powered platform for financial learning, insights, and smart tools for beginners.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/chatbot" className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all flex items-center justify-center">
              Try AI Assistant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/courses" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all">
              Start Learning
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. PRODUCT PREVIEW SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl md:rounded-[2rem] bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Chat Preview Mockup */}
          <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-800">
            <div className="flex items-center space-x-2 mb-6">
              <Bot className="w-6 h-6 text-brand-400" />
              <span className="text-sm font-bold text-white uppercase tracking-widest">AI Interface</span>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-xl rounded-tl-sm w-3/4">
                <p className="text-slate-300 text-sm">Explain how a SIP works like I'm 10 years old.</p>
              </div>
              <div className="bg-brand-600 p-4 rounded-xl rounded-tr-sm w-5/6 ml-auto">
                <p className="text-white text-sm">Imagine you have a piggy bank. Instead of putting all your birthday money in at once, you put exactly ₹10 in it every single week. A SIP is just doing that with the stock market...</p>
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview Mockup */}
          <div className="flex-1 p-8 md:p-12 bg-slate-950">
            <div className="flex items-center justify-between mb-6">
               <span className="text-sm font-bold text-white uppercase tracking-widest">Dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Messages Used</p>
                <p className="text-xl font-bold text-white">12 / 20</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Saved Items</p>
                <p className="text-xl font-bold text-white">4</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl col-span-2">
                <p className="text-xs text-slate-500 mb-2">Market Insight</p>
                <p className="text-sm text-slate-300">NIFTY 50 shows strong resistance at 22,500. Tech sector leads rally...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Everything you need to grow</h2>
            <p className="text-slate-500 dark:text-slate-400">A complete ecosystem designed to make you a better investor.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI Assistant',
                desc: 'Ask complex financial queries and get instant, simplified answers based on live context.',
                icon: Bot
              },
              {
                title: 'Learning Hub',
                desc: 'Structured courses from beginner to advanced. Track your progress automatically.',
                icon: BookOpen
              },
              {
                title: 'Finor News',
                desc: 'Curated financial news. Use AI to instantly translate jargon into plain English.',
                icon: Newspaper
              },
              {
                title: 'Smart Tools',
                desc: 'Interactive SIP calculators, risk profile quizzes, and investment planners.',
                icon: Calculator
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-colors">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRICING PREVIEW */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-slate-500 dark:text-slate-400">Upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Basic</h3>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">₹199<span className="text-base font-medium text-slate-500">/mo</span></div>
            <ul className="space-y-4 mb-8">
              {['3 AI Prompts per day', 'Basic Learning Hub', 'Daily Finor News'].map((f, i) => (
                <li key={i} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 mr-3 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block w-full py-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">Get Started</Link>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-3xl bg-slate-900 dark:bg-slate-950 border-2 border-brand-500 relative transform md:-translate-y-4 shadow-xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">Most Popular</div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <div className="text-4xl font-extrabold text-white mb-6">₹699<span className="text-base font-medium text-slate-400">/mo</span></div>
            <ul className="space-y-4 mb-8">
              {['20 AI Prompts per day', 'All Premium Courses', 'Unlimited Bookmarks', 'Community Comments'].map((f, i) => (
                <li key={i} className="flex items-center text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 mr-3 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block w-full py-3 text-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors">Subscribe Pro</Link>
          </div>

          {/* Elite Plan */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Elite</h3>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">₹1999<span className="text-base font-medium text-slate-500">/mo</span></div>
            <ul className="space-y-4 mb-8">
              {['100 AI Prompts per day', 'Advanced Calculators', 'Priority Support'].map((f, i) => (
                <li key={i} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 mr-3 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block w-full py-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">Subscribe Elite</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
