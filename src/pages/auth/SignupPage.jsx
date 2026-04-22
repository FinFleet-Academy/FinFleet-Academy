import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, PLANS } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [selectedPlan, setSelectedPlan] = useState(PLANS.FREE);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData.name, formData.email, formData.password, selectedPlan);
      toast.success(`Welcome to the Fleet, ${formData.name}! Your ${selectedPlan} plan is active.`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Side: Brand/Value Prop */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-6">
          <div className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold dark:text-white">FinFleet Academy</span>
          </div>
          
          <h2 className="text-4xl font-extrabold dark:text-white leading-tight">
            Start your journey to <br />
            <span className="text-brand-600">Financial Mastery</span>
          </h2>

          <div className="space-y-6">
            {[
              "Access to 50+ Premium Courses",
              "Real-time Market Insights",
              "AI-Powered Trading Assistant",
              "Verified Industry Certificates"
            ].map((text, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-5 h-5 text-accent-success" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="p-6 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800">
            <p className="text-sm text-brand-800 dark:text-brand-300 italic">
              "Joining FinFleet was the best decision for my trading career. The Elite Prime mentorship is unparalleled."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full" />
              <div className="text-xs">
                <div className="font-bold dark:text-white">Sarah Jenkins</div>
                <div className="text-slate-500">Professional Trader</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="card-premium p-8">
          <div className="text-center lg:text-left mb-8 lg:hidden">
             <h1 className="text-2xl font-bold dark:text-white">Create Account</h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Select Starting Plan</label>
              <div className="grid grid-cols-2 gap-3">
                {[PLANS.FREE, PLANS.PRO, PLANS.ELITE, PLANS.PRIME].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPlan(p)}
                    className={`text-xs py-2 rounded-lg border font-bold transition-all ${
                      selectedPlan === p 
                        ? 'bg-brand-600 border-brand-600 text-white' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary w-full py-4 text-sm flex items-center justify-center space-x-2">
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">Log In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
