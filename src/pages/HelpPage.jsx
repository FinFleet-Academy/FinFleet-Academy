import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Send, Plus, Clock, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  open:        { label: 'Open',        color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400',   icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',      icon: AlertCircle },
  resolved:    { label: 'Resolved',    color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle2 },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      <span>{cfg.label}</span>
    </span>
  );
};

const HelpPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets]       = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState({ subject: '', description: '', screenshotUrl: '' });

  useEffect(() => {
    if (isAuthenticated) fetchMyTickets();
  }, [isAuthenticated]);

  const fetchMyTickets = async () => {
    try {
      const { data } = await axios.get('/api/help/my-tickets');
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) return toast.error('Subject and description are required');
    setSubmitting(true);
    try {
      await axios.post('/api/help', form);
      toast.success('Ticket submitted! We\'ll get back to you soon.');
      setForm({ subject: '', description: '', screenshotUrl: '' });
      setShowForm(false);
      fetchMyTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center">
                <LifeBuoy className="w-7 h-7 text-brand-600" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold dark:text-white">Help & Support</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Our team typically responds within 24 hours.</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 btn-primary py-2.5 px-5 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSubmit}
            className="card-premium p-8 mb-8 space-y-5"
          >
            <h2 className="text-lg font-bold dark:text-white">Submit a Support Ticket</h2>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Subject</label>
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Brief description of your issue..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                maxLength={2000}
                placeholder="Describe your issue in detail..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition resize-none"
              />
              <p className="text-[10px] text-slate-400 text-right">{form.description.length}/2000</p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Screenshot URL (Optional)</label>
              <input
                name="screenshotUrl"
                type="url"
                value={form.screenshotUrl}
                onChange={handleChange}
                placeholder="https://imgur.com/your-screenshot.png"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-secondary py-3 text-sm">Cancel</button>
              <button type="submit" disabled={submitting}
                className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all disabled:opacity-60 text-sm">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{submitting ? 'Submitting...' : 'Submit Ticket'}</span>
              </button>
            </div>
          </motion.form>
        )}

        {/* Ticket List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold dark:text-white">Your Tickets ({tickets.length})</h2>
          {tickets.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <LifeBuoy className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No support tickets yet. Click "New Ticket" if you need help.</p>
            </div>
          ) : (
            tickets.map((ticket, idx) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card-premium p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <h3 className="font-bold dark:text-white mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{ticket.description}</p>
                    <p className="text-[10px] text-slate-400 mt-2">{new Date(ticket.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
