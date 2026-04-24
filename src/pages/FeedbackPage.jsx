import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, MessageCircle, Heart, ShieldCheck, Sparkles, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating, setRating }) => (
  <div className="flex space-x-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className="transition-all hover:scale-125 active:scale-90 p-1"
      >
        <Star
          className={`w-10 h-10 transition-all ${
            star <= rating ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-slate-200 dark:text-slate-800'
          }`}
        />
      </button>
    ))}
  </div>
);

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent!' };

const FeedbackPage = () => {
  const { user } = useAuth();
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '', message: '' });
  const [rating, setRating]   = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Rating is required');
    if (!form.message.trim()) return toast.error('Message is required');

    setSubmitting(true);
    try {
      await axios.post('/api/feedback', { ...form, rating });
      setSubmitted(true);
      toast.success('Feedback submitted successfully. Thank you!');
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] flex items-center justify-center px-4 font-sans">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-16 text-center max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16" />
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black dark:text-white mb-4 uppercase tracking-tighter">Thank You!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed mb-12">Your feedback helps us improve FinFleet for everyone. We appreciate your time!</p>
          <button onClick={() => { setSubmitted(false); setRating(0); }}
            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2">
            <RefreshCcw className="w-4 h-4" />
            <span>Submit More Feedback</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] py-20 md:py-32 font-sans selection:bg-brand-500/20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-3xl mb-8 border border-brand-100 dark:border-brand-800">
            <Sparkles className="w-10 h-10 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black dark:text-white mb-6 tracking-tighter">Share <span className="text-gradient">Feedback.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed max-w-md mx-auto">Help us improve FinFleet by sharing your thoughts and experiences.</p>
        </motion.div>

        <motion.form
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-10"
        >
          {/* Identity Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
               <input
                 name="name" type="text" value={form.name} onChange={handleChange} required
                 placeholder="Full Name"
                 className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
               <input
                 name="email" type="email" value={form.email} onChange={handleChange} required
                 placeholder="Email Address"
                 className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
               />
             </div>
          </div>

          {/* Rating Engine */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Rating</label>
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center">
               <StarRating rating={rating} setRating={setRating} />
               <AnimatePresence mode="wait">
                  {rating > 0 && (
                    <motion.p key={rating} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-xs font-black text-amber-500 uppercase tracking-widest mt-6">
                      {RATING_LABELS[rating]}
                    </motion.p>
                  )}
               </AnimatePresence>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
            <textarea
              name="message" value={form.message} onChange={handleChange} required rows={5} maxLength={1000}
              placeholder="Tell us what you think..."
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none"
            />
            <p className="text-[9px] font-black text-slate-400 uppercase text-right px-1">{form.message.length}/1000</p>
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full py-5 rounded-2xl bg-brand-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{submitting ? 'Sending...' : 'Submit Feedback'}</span>
          </button>
        </motion.form>

        <div className="mt-20 text-center">
           <div className="flex items-center justify-center space-x-2 text-slate-400 mb-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Built for the community</span>
           </div>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Your feedback is strictly confidential and used for platform improvement.</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
