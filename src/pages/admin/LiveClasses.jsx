import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, User, ExternalLink, 
  Trash2, PlusCircle, MoreVertical, ShieldCheck,
  Search, Filter, Play, Square, Settings, Users,
  Globe, Lock
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminLiveClasses = ({ classes = [], loadData }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', instructor: '', scheduledTime: '', duration: 60, platform: 'google_meet', classType: 'free', price: 0, meetingLink: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/live-classes', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Class scheduled successfully!");
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule class");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session? This action is permanent.")) return;
    try {
      await axios.delete(`/api/live-classes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Session removed.");
      loadData();
    } catch (error) {
      toast.error("Failed to delete session");
    }
  };

  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
             <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Class Management.</h2>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                <Video className="w-4 h-4 mr-2 text-indigo-600" /> Control live sessions & student access
             </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
          >
             <PlusCircle className="w-5 h-5" />
             <span>Schedule New Class</span>
          </button>
       </div>

       {/* Toolbar */}
       <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 w-full group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Search by class title or instructor..." 
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
             />
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100 dark:border-slate-800">
                <Filter className="w-5 h-5 mx-auto" />
             </button>
             <button className="flex-1 md:flex-none p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100 dark:border-slate-800">
                <Settings className="w-5 h-5 mx-auto" />
             </button>
          </div>
       </div>

       {/* Classes Table */}
       <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Session Details</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Platform & Type</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Time & Duration</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
             </thead>
             <tbody>
                {(classes || []).map((c) => (
                  <tr key={c._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-none">
                     <td className="px-10 py-8">
                        <div className="flex items-center space-x-6">
                           <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Video className="w-7 h-7" />
                           </div>
                           <div>
                              <h4 className="text-base font-black dark:text-white tracking-tighter leading-none mb-2 uppercase">{c.title}</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                 <User className="w-3.5 h-3.5 mr-2" /> {c.instructor}
                              </p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-8">
                        <div className="flex flex-col space-y-2">
                           <span className="flex items-center text-[10px] font-black uppercase tracking-widest">
                              <Globe className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {c.platform === 'zoom' ? 'Zoom API' : 'Google Meet'}
                           </span>
                           <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md w-fit border ${
                             c.classType === 'paid' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                           }`}>
                              {c.classType === 'paid' ? <Lock className="w-3 h-3 mr-1.5" /> : <ShieldCheck className="w-3 h-3 mr-1.5" />}
                              {c.classType === 'paid' ? `₹${c.price}` : 'Free'}
                           </span>
                        </div>
                     </td>
                     <td className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <div className="flex flex-col space-y-1">
                           <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {new Date(c.scheduledTime).toLocaleDateString()}</div>
                           <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {new Date(c.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                     </td>
                     <td className="px-8 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          c.status === 'live' ? 'bg-red-500 text-white border-red-500 animate-pulse' :
                          c.status === 'upcoming' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' :
                          'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                           {c.status}
                        </span>
                     </td>
                     <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                              <Play className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(c._id)} className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {classes.length === 0 && (
             <div className="py-24 text-center">
                <Video className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No sessions found matching your search</p>
             </div>
          )}
       </div>

       {/* Create Class Modal */}
       <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
               >
                  <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
                     <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Schedule Session.</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Deploy a new live experience</p>
                  </div>
                  <form onSubmit={handleSubmit} className="p-10 space-y-8">
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Class Title</label>
                              <input 
                                required placeholder="e.g. Trading Fundamentals" 
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Instructor</label>
                              <input 
                                required placeholder="Instructor Name" 
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Platform</label>
                              <select 
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase outline-none transition-all"
                                value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                              >
                                 <option value="google_meet">Google Meet</option>
                                 <option value="zoom">Zoom API</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Session Type</label>
                              <select 
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase outline-none transition-all"
                                value={form.classType} onChange={e => setForm({...form, classType: e.target.value})}
                              >
                                 <option value="free">Free Session</option>
                                 <option value="paid">Paid (Monetized)</option>
                              </select>
                           </div>
                        </div>

                        {form.classType === 'paid' && (
                           <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Price (INR)</label>
                              <input 
                                type="number" required placeholder="₹499" 
                                className="w-full bg-amber-500/5 border border-amber-500/20 rounded-2xl px-6 py-4 text-sm font-bold text-amber-600 outline-none"
                                value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value)})}
                              />
                           </motion.div>
                        )}

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Schedule Time</label>
                           <input 
                             type="datetime-local" required 
                             className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-[11px] font-black uppercase outline-none"
                             value={form.scheduledTime} onChange={e => setForm({...form, scheduledTime: e.target.value})}
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Meeting Link</label>
                           <input 
                             required placeholder="https://..." 
                             className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none"
                             value={form.meetingLink} onChange={e => setForm({...form, meetingLink: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="flex items-center space-x-4 pt-4">
                        <button 
                          type="button" onClick={() => setShowModal(false)}
                          className="flex-1 py-5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                        >
                           Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                           Schedule Class
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
  );
};

export default AdminLiveClasses;
