import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Instagram, Linkedin, Twitter, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      await axios.post('/api/subscribers', { 
        email, 
        source: 'footer' 
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
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-100 dark:border-slate-900">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Rocket className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold dark:text-white">
                FinFleet<span className="text-brand-600">Academy</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Empowering traders and investors with premium education and AI-powered insights. Join the elite fleet today.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.instagram.com/finfleetacademy/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg hover:text-brand-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/113126241/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg hover:text-brand-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://x.com/finfleetacademy" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg hover:text-brand-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Learning</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/courses" className="text-slate-500 hover:text-brand-600 transition-colors">All Courses</Link></li>
              <li><a href="#" className="text-slate-500 hover:text-brand-600 transition-colors">Live Webinars</a></li>
              <li><a href="#" className="text-slate-500 hover:text-brand-600 transition-colors">Free E-books</a></li>
              <li><Link to="/finor" className="text-slate-500 hover:text-brand-600 transition-colors">Market News</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="text-slate-500 hover:text-brand-600 transition-colors">About Us</Link></li>
              <li><Link to="/finor/about" className="text-slate-500 hover:text-brand-600 transition-colors">Finor</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-brand-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-slate-500 hover:text-brand-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-500 hover:text-brand-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Stay Updated</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Get the latest market insights and academy updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all disabled:opacity-50"
              />
              <button type="submit" disabled={isSubmitting} className="btn-primary py-2.5 text-sm disabled:opacity-50">
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center md:text-left">
            <span className="font-bold text-slate-900 dark:text-slate-200">Legal Disclaimer:</span> Trading involves risk. Results may vary. No profit guarantee. The content provided is for educational purposes only and should not be considered as financial advice. Past performance is not indicative of future results.
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-500 space-y-4 md:space-y-0">
          <p>© {currentYear} FinFleet Academy. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-brand-600 transition-colors">Security</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Sitemap</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
