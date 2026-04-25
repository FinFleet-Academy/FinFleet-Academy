import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, HelpCircle, MessageSquare, Book, 
  ArrowRight, ChevronDown, CheckCircle, 
  AlertCircle, Send, Mail, Zap, Shield, 
  Headphones, LifeBuoy
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const HelpSupportPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'GENERAL'
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get('/api/support-system/articles');
      setArticles(res.data);
    } catch (err) {
      console.error("Failed to load knowledge base");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/support-system/contact', formData);
      toast.success("Identity Synchronization Ticket Raised");
      setShowContactForm(false);
      setFormData({ name: '', email: '', subject: '', message: '', category: 'GENERAL' });
    } catch (err) {
      toast.error("Transmission failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(a => 
    (activeCategory === 'All' || a.category === activeCategory) &&
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 py-20 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-6 relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <LifeBuoy className="w-4 h-4 text-brand-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Knowledge Architecture</span>
           </motion.div>
           <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">How can we <span className="text-brand-600">Assist?</span></h1>
           
           <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search protocol, identity, or market articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/5 rounded-[2rem] pl-16 pr-8 py-6 text-sm font-bold text-white focus:border-brand-500/50 outline-none shadow-2xl transition-all"
              />
           </div>
        </div>

        {/* Quick Actions Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Identity Support", desc: "Issues with your professional profile or privacy settings.", icon: Headphones, color: "text-blue-500" },
             { title: "Technical Lab", icon: Zap, desc: "Bugs, integration issues, or platform outages.", color: "text-emerald-500" },
             { title: "Wealth Tracker", icon: Shield, desc: "Discrepancies in financial tracking or data.", color: "text-brand-500" }
           ].map((item, i) => (
             <div key={i} className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 group hover:border-brand-500/30 transition-all cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                   <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* Knowledge Base Area */}
        <div className="space-y-10">
           <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center">
                 <Book className="w-6 h-6 mr-3 text-brand-600" />
                 Protocol Library
              </h2>
              <button 
                onClick={() => setShowContactForm(true)}
                className="bg-white text-slate-950 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
              >
                 Raise Protocol Ticket
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12">
              {/* Category Sidebar */}
              <div className="space-y-4">
                 {['All', 'General', 'Account', 'Market Data', 'Privacy', 'Billing'].map(cat => (
                   <button 
                     key={cat} onClick={() => setActiveCategory(cat)}
                     className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       activeCategory === cat ? 'bg-brand-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {filteredArticles.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-30">
                       <p className="text-xs font-black uppercase tracking-widest">No protocol documentation found</p>
                    </div>
                 ) : filteredArticles.map((article, i) => (
                   <motion.div 
                     key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                     className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 group hover:border-brand-500/20 transition-all cursor-pointer"
                   >
                      <h4 className="text-sm font-black text-white uppercase mb-4 leading-tight group-hover:text-brand-500 transition-colors">{article.title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed line-clamp-3 mb-6">{article.content}</p>
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
                         <span>3 min read</span>
                         <div className="flex items-center text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            Read Protocol <ArrowRight className="w-3 h-3 ml-2" />
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 🚀 CONTACT MODAL (PROTOCOL TICKET) */}
      <AnimatePresence>
         {showContactForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setShowContactForm(false)}
                 className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500 rounded-full blur-[100px] opacity-10 -mr-24 -mt-24" />
                  
                  <div className="flex items-center justify-between mb-10">
                     <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center">
                           <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-white uppercase tracking-tighter">Raise Ticket</h3>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmission will be routed to Admin</p>
                        </div>
                     </div>
                     <button onClick={() => setShowContactForm(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ArrowRight className="w-5 h-5 rotate-45" />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Identity Name</label>
                           <input 
                             type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                             className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-brand-500 outline-none transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Email</label>
                           <input 
                             type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                             className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-brand-500 outline-none transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                        <select 
                          value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-brand-500 outline-none transition-all appearance-none"
                        >
                           <option value="GENERAL">General Inquiries</option>
                           <option value="BUG">Technical Lab (Bug)</option>
                           <option value="ACCOUNT">Identity / Account</option>
                           <option value="PAYMENT">Subscription / Payment</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Message Payload</label>
                        <textarea 
                          rows="4" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                          className="w-full bg-[#020617] border border-white/5 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:border-brand-500 outline-none transition-all resize-none"
                        />
                     </div>

                     <button 
                       type="submit" disabled={loading}
                       className="w-full py-5 bg-white text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                     >
                        {loading ? <div className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>Synchronize Ticket</span>
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default HelpSupportPage;
