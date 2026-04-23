import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, Send, Plus, Clock, CheckCircle2, 
  AlertCircle, ChevronDown, ShieldQuestion, 
  MessageSquare, ExternalLink, ArrowRight, Star
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  open:        { label: 'Pending',     color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',   icon: Clock },
  in_progress: { label: 'In Analysis', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',      icon: AlertCircle },
  resolved:    { label: 'Resolved',    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle2 },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${cfg.color}`}>
      <Icon className="w-3.5 h-3.5" />
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
    if (!isAuthenticated) return toast.error('Please login to submit a ticket');
    if (!form.subject.trim() || !form.description.trim()) return toast.error('Required fields missing');
    setSubmitting(true);
    try {
      await axios.post('/api/help', form);
      toast.success('Protocol Initiated. Our team will contact you.');
      setForm({ subject: '', description: '', screenshotUrl: '' });
      setShowForm(false);
      fetchMyTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Protocol failure');
    } finally {
      setSubmitting(false);
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] py-20 md:py-32 font-sans selection:bg-brand-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* 1. Header Section */}
        <div className="mb-16 md:mb-24 text-center md:text-left">
           <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-6 border border-brand-100 dark:border-brand-800">
              <Star className="w-3 h-3 text-brand-600 fill-brand-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">24/7 Intelligence Support</span>
           </motion.div>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-xl">
                 <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter mb-6">Support <span className="text-gradient">Console.</span></motion.h1>
                 <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">
                    Direct access to our financial technical team. Submit a protocol ticket for account issues, technical bugs, or premium access queries.
                 </motion.p>
              </div>
              <motion.button
                {...fadeInUp}
                transition={{ delay: 0.3 }}
                onClick={() => setShowForm(!showForm)}
                className="btn-primary py-4 px-10 text-xs shadow-xl shadow-slate-900/10"
              >
                {showForm ? <X className="w-4 h-4 mr-2 inline" /> : <Plus className="w-4 h-4 mr-2 inline" />}
                {showForm ? 'Cancel Protocol' : 'New Ticket'}
              </motion.button>
           </div>
        </div>

        {/* 2. Ticket Submission Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-16"
            >
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16" />
                
                <h2 className="text-xl font-black dark:text-white uppercase tracking-widest flex items-center">
                   <ShieldQuestion className="w-6 h-6 mr-3 text-brand-600" />
                   Submit Protocol Ticket
                </h2>

                <div className="grid grid-cols-1 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                      <input
                        name="subject" value={form.subject} onChange={handleChange} required
                        placeholder="e.g. Payment Verification Delay"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Intelligence</label>
                      <textarea
                        name="description" value={form.description} onChange={handleChange} required rows={5} maxLength={2000}
                        placeholder="Provide deep technical context..."
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none"
                      />
                      <div className="flex justify-between items-center px-1">
                         <span className="text-[9px] font-bold text-slate-400 uppercase">Min. 20 Characters</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase">{form.description.length}/2000</span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evidence URL (Optional)</label>
                      <input
                        name="screenshotUrl" type="url" value={form.screenshotUrl} onChange={handleChange}
                        placeholder="https://imgur.com/intel-screenshot.png"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                      />
                   </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={submitting}
                    className="w-full py-5 rounded-2xl bg-brand-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all disabled:opacity-50">
                    {submitting ? 'Initiating Protocol...' : 'Submit Intel'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Ticket History */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-xs font-black dark:text-white uppercase tracking-[0.3em] text-slate-400">Communication Logs</h2>
             <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-lg border border-brand-100 dark:border-brand-800">Active Sessions: {tickets.length}</span>
          </div>

          {tickets.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-20 text-center shadow-sm">
              <LifeBuoy className="w-16 h-16 text-slate-100 dark:text-slate-800 mx-auto mb-6" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No logs found in secure storage</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {tickets.map((ticket, idx) => (
                  <motion.div
                    key={ticket._id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                           <h3 className="text-lg font-black dark:text-white tracking-tight group-hover:text-brand-600 transition-colors">{ticket.subject}</h3>
                           <div className="w-1 h-1 rounded-full bg-slate-300" />
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">{ticket.description}</p>
                        <div className="flex items-center space-x-4">
                           <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors flex items-center">
                              <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> View Transcript
                           </button>
                           {ticket.screenshotUrl && (
                             <a href={ticket.screenshotUrl} target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors flex items-center">
                                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Visual Evidence
                             </a>
                           )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                         <StatusBadge status={ticket.status} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* 4. Footer Help Links */}
        <div className="mt-32 pt-16 border-t border-slate-100 dark:border-slate-800/50 text-center">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white text-left relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-8 -mt-8 group-hover:opacity-40 transition-opacity" />
                 <h3 className="text-sm font-black uppercase tracking-widest mb-4">Enterprise Inquiries</h3>
                 <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">For institutional partnerships, bulk licensing, or research collaboration.</p>
                 <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest text-brand-400 flex items-center hover:translate-x-2 transition-transform">
                    Contact Admin <ArrowRight className="w-4 h-4 ml-2" />
                 </Link>
              </div>
              <div className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-left">
                 <h3 className="text-sm font-black dark:text-white uppercase tracking-widest mb-4">Documentation</h3>
                 <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">Browse our deep-dive documentation on trading protocols and platform features.</p>
                 <button className="text-[10px] font-black uppercase tracking-widest text-brand-600 flex items-center hover:translate-x-2 transition-transform">
                    Explore Docs <ArrowRight className="w-4 h-4 ml-2" />
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HelpPage;
