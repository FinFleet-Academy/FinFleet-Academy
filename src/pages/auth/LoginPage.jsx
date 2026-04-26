import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, PLANS } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success("Welcome back! You're now logged in.");
      if (userData.isAdmin) navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-brand-500/20">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500 rounded-full blur-[150px] opacity-10 -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-10 -ml-32 -mb-32" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-6 border border-brand-100 dark:border-brand-800">
             <ShieldCheck className="w-3 h-3 text-brand-600" />
             <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Secure Login</span>
          </motion.div>
          <motion.div 
            {...fadeInUp} transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
             <h1 className="text-4xl md:text-5xl font-black dark:text-white tracking-tight mb-3">Welcome <span className="text-gradient">Back.</span></h1>
             <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to your FinFleet Academy account</p>
          </motion.div>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 -mr-16 -mt-16 transition-opacity" />
          
          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-5 text-sm dark:text-white outline-none focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-16 py-5 text-sm dark:text-white outline-none focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="Enter your password"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center space-x-4 shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-white dark:border-slate-600 dark:border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              New to FinFleet Academy?{' '}
              <Link to="/signup" className="text-brand-600 font-bold hover:text-brand-700 underline underline-offset-4">Create an account</Link>
            </p>
          </div>
        </div>

        {/* Bottom Branding */}
        <div className="mt-10 text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">FinFleet Academy &copy; 2024</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
