import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Instagram, Linkedin, Twitter, ShieldAlert, ArrowRight, Zap, Globe, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useCookies } from '../../context/CookieContext';
import BrandLogo from '../ui/BrandLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setShowSettings } = useCookies();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) return;

      setIsSubmitting(true);
      const { data } = await axios.post('/api/subscribers', { email: trimmedEmail, source: 'footer' });
      toast.success(data.message || 'Success! You have subscribed to our newsletter.');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-white dark:bg-[#080C10] border-t border-slate-100 dark:border-slate-900 pt-24 pb-12 relative overflow-hidden font-sans selection:bg-brand-500/20">
      
      {/* Background Ambience */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-500 rounded-full blur-[150px] opacity-[0.03] -mr-64 -mb-64 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 pb-20">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-4 space-y-10">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-14 h-14 bg-slate-950 dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:bg-brand-600 group-hover:scale-110 transition-all">
                <BrandLogo className="text-white dark:text-brand-600 w-8 h-8" />
              </div>
              <div>
                 <span className="text-2xl font-black dark:text-white tracking-tighter uppercase leading-none block">FinFleet</span>
                 <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.4em] leading-none mt-1 block">Academy</span>
              </div>
            </Link>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The world's most advanced financial education platform. Empowering retail traders with institutional-grade knowledge and AI-powered insights.
            </p>
            <div className="flex items-center space-x-4">
              {[
                { icon: Instagram, link: "https://www.instagram.com/finfleetacademy/" },
                { icon: Linkedin, link: "https://www.linkedin.com/company/113126241/" },
                { icon: Twitter, link: "https://x.com/finfleetacademy" }
              ].map((social, i) => (
                <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-500/20 transition-all shadow-sm">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-10">
            <div className="space-y-8">
              <h4 className="text-[11px] font-black dark:text-white uppercase tracking-[0.3em] flex items-center">
                 <Zap className="w-4 h-4 mr-3 text-brand-600" /> Resources
              </h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <li><Link to="/courses" className="hover:text-brand-600 transition-colors">Courses</Link></li>
                <li><Link to="/community" className="hover:text-brand-600 transition-colors">Community</Link></li>
                <li><Link to="/tools" className="hover:text-brand-600 transition-colors">Trading Tools</Link></li>
                <li>
                  <Link to="/finor" className="hover:text-brand-600 transition-colors flex flex-col group">
                    <span>Finor</span>
                    <span className="text-[7px] opacity-60 normal-case tracking-normal group-hover:opacity-100 transition-opacity">by FinFleet Academy</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[11px] font-black dark:text-white uppercase tracking-[0.3em] flex items-center">
                 <Globe className="w-4 h-4 mr-3 text-brand-600" /> Company
              </h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <li><Link to="/about" className="hover:text-brand-600 transition-colors">About Us</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-600 transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="hover:text-brand-600 transition-colors">Help Center</Link></li>
                <li><Link to="/feedback" className="hover:text-brand-600 transition-colors">Feedback</Link></li>
                <li>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="hover:text-brand-600 transition-colors text-[10px] font-black uppercase tracking-widest"
                  >
                    Cookies
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-10">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
               <h4 className="text-[11px] font-black dark:text-white uppercase tracking-[0.3em] mb-6 flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-brand-600" /> Newsletter
               </h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-6">
                 Subscribe to receive the latest market updates and course news.
               </p>
               <form onSubmit={handleSubscribe} className="space-y-3">
                 <input
                   type="email" placeholder="YOUR@EMAIL.COM" required 
                   value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting}
                   className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                 />
                 <button type="submit" disabled={isSubmitting} className="w-full btn-brand py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center group shadow-xl">
                   {isSubmitting ? 'Subscribing...' : (
                     <>
                        Subscribe Now <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                     </>
                   )}
                 </button>
               </form>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="py-8 border-y border-slate-100 dark:border-slate-900 mb-12">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-6 max-w-3xl">
                 <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20">
                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                   <span className="text-slate-900 dark:text-slate-200 font-black">Disclaimer:</span> Capital markets involve substantial risk. Content is for educational purposes only. No financial advice provided. Past performance does not guarantee future results.
                 </p>
              </div>
              <div className="flex items-center space-x-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy</Link>
                 <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms</Link>
                 <Link to="/security" className="hover:text-brand-600 transition-colors">Security</Link>
              </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] gap-6">
          <p>© {currentYear} FinFleet Academy. All Rights Reserved.</p>
          <div className="flex items-center space-x-3 text-slate-300 dark:text-slate-800">
             <Sparkles className="w-4 h-4 fill-current" />
             <div className="w-12 h-px bg-current" />
             <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
