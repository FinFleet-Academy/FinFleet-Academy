import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Mail, User, 
  CheckCircle, Clock, Filter, 
  Search, Shield, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SupportManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/support-system/admin/messages');
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to sync support inbox");
    } finally {
      setLoading(false);
    }
  };

  const filtered = messages.filter(m => filter === 'ALL' || m.category === filter);

  return (
    <div className="space-y-10 p-8 min-h-screen bg-[#080C10] font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Support Nexus</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inbound Identity & Technical Protocol Tickets</p>
         </div>
         <div className="flex items-center space-x-4">
            <div className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 flex items-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">{messages.length} Total</span>
            </div>
         </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/50 border border-white/5 p-6 rounded-[2rem]">
         <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {['ALL', 'BUG', 'ACCOUNT', 'PAYMENT', 'GENERAL'].map(f => (
               <button 
                 key={f} onClick={() => setFilter(f)}
                 className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                   filter === f ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'
                 }`}
               >
                 {f}
               </button>
            ))}
         </div>
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Filter identity..." className="bg-slate-950 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-[10px] font-bold text-white outline-none focus:border-brand-500/50" />
         </div>
      </div>

      {/* Inbox Grid */}
      <div className="grid grid-cols-1 gap-6">
         {loading ? (
            <div className="py-20 text-center text-slate-500 animate-pulse uppercase text-[10px] font-black tracking-widest">Syncing Inbox...</div>
         ) : filtered.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 uppercase text-[10px] font-black tracking-widest">Nexus Clear - No Pending Tickets</div>
         ) : filtered.map((msg) => (
           <motion.div 
             key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
             className="group bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 hover:border-brand-500/20 transition-all cursor-pointer relative overflow-hidden"
           >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                 <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                       {msg.category === 'BUG' ? <Shield className="w-7 h-7 text-emerald-500" /> : <MessageSquare className="w-7 h-7 text-brand-500" />}
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center space-x-3">
                          <span className="text-sm font-black text-white uppercase tracking-tight">{msg.subject}</span>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            msg.category === 'BUG' ? 'bg-red-500/10 text-red-500' : 'bg-brand-500/10 text-brand-500'
                          }`}>
                            {msg.category}
                          </span>
                       </div>
                       <p className="text-xs text-slate-400 font-bold max-w-2xl leading-relaxed">{msg.message}</p>
                       <div className="flex items-center space-x-6 pt-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                          <div className="flex items-center"><User className="w-3 h-3 mr-2" /> {msg.name}</div>
                          <div className="flex items-center"><Mail className="w-3 h-3 mr-2" /> {msg.email}</div>
                          <div className="flex items-center"><Clock className="w-3 h-3 mr-2" /> {new Date(msg.createdAt).toLocaleString()}</div>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3 shrink-0">
                    <button className="px-6 py-3 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Reply Protocol</button>
                    <button className="p-3 bg-white/5 text-slate-400 rounded-xl hover:text-emerald-500 transition-all"><CheckCircle className="w-5 h-5" /></button>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

    </div>
  );
};

export default SupportManager;
