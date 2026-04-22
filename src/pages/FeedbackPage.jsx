import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating, setRating }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className="transition-transform hover:scale-110"
      >
        <Star
          className={`w-8 h-8 transition-colors ${
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
          }`}
        />
      </button>
    ))}
  </div>
);

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent!' };

const FeedbackPage = () => {
  const { user } = useAuth();
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '', message: '' });
  const [rating, setRating]   = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    if (!form.message.trim()) return toast.error('Please write a message');

    setSubmitting(true);
    try {
      await axios.post('/api/feedback', { ...form, rating });
      setSubmitted(true);
      toast.success('Thank you for your feedback! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-premium p-12 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white mb-3">Feedback Submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Thank you for helping us improve FinFleet Academy. Your feedback means a lot to us.</p>
          <button onClick={() => { setSubmitted(false); setRating(0); setForm({ name: user?.name || '', email: user?.email || '', message: '' }); }}
            className="btn-secondary w-full">
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl mb-6">
            <MessageCircle className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-extrabold dark:text-white mb-3">Share Your Feedback</h1>
          <p className="text-slate-500 dark:text-slate-400">Help us make FinFleet Academy better for everyone.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card-premium p-8 space-y-6"
        >
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Your Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
            />
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Your Rating</label>
            <StarRating rating={rating} setRating={setRating} />
            {rating > 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm font-bold text-amber-500">
                {RATING_LABELS[rating]}
              </motion.p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Your Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              maxLength={1000}
              placeholder="Tell us what you think about FinFleet Academy..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition resize-none"
            />
            <p className="text-[10px] text-slate-400 text-right">{form.message.length}/1000</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors shadow-sm disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default FeedbackPage;
