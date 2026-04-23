import React, { useState, useEffect } from 'react';
import { useAuth, PLANS } from '../context/AuthContext';
import { 
  Users, Ticket, Trash2, ArrowUpCircle, XCircle, Search, ShieldAlert, 
  BellRing, Send, Newspaper, BookOpen, PlusCircle, LayoutDashboard,
  ExternalLink, Video, CheckCircle, MessageSquare, Mail, Clock,
  Star, LifeBuoy, AlertCircle, CheckCircle2, Zap, BarChart3, TrendingUp,
  ShieldCheck, ArrowRight, Filter, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { 
    isAdmin, upgradePlan, addCoupon, deleteCoupon,
    fetchUsers, fetchSubscribers, fetchCoupons,
    adminSendNotification, createNews, deleteNews,
    createCourse, deleteCourse, fetchContacts, deleteAdminContact
  } = useAuth();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [usersList, setUsersList] = useState([]);
  const [subscribersList, setSubscribersList] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [helpTickets, setHelpTickets] = useState([]);
  const [insightsList, setInsightsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Forms state
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [newsForm, setNewsForm] = useState({
    title: '', summary: '', content: '', category: 'Stock Market', sourceLink: '', isTrending: false
  });
  const [insightForm, setInsightForm] = useState({
    title: '', content: '', type: 'market_tip'
  });
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', content: '', videoUrl: '', icon: 'BookOpen', category: 'Trading', isPremium: true
  });

  const loadData = async () => {
    try {
      const [users, allCoupons, subscribers, allNews, allCourses, allContacts, allFeedback, allTickets, allInsights] = await Promise.all([
        fetchUsers(), fetchCoupons(), fetchSubscribers(),
        axios.get('/api/news'), axios.get('/api/courses'),
        fetchContacts(), axios.get('/api/feedback/admin'),
        axios.get('/api/help/admin'),
        axios.get('/api/insights', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('/api/analytics/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setUsersList(users);
      setCoupons(allCoupons);
      setSubscribersList(subscribers);
      setNewsList(allNews.data);
      setCoursesList(allCourses.data);
      setContactsList(allContacts);
      setFeedbackList(allFeedback.data);
      setHelpTickets(allTickets.data);
      setInsightsList(allInsights.data);
      setAnalyticsData(allAnalytics.data);
    } catch (error) {
      console.error("Admin Load Error:", error);
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="py-24 text-center min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-8" />
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Access Forbidden.</h2>
        <p className="text-slate-500 font-bold max-w-sm">Authorization protocol failure. Administrator privileges required for this terminal.</p>
        <button onClick={() => navigate('/')} className="mt-10 btn-brand py-4 px-10 text-[10px] uppercase tracking-widest font-black">Terminate Session</button>
      </div>
    );
  }

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await addCoupon(couponForm.code, couponForm.discountPercent);
      toast.success(`Protocol Success: Coupon Generated.`);
      setCouponForm({ code: '', discountPercent: '' });
      loadData();
    } catch (error) { toast.error("Coupon generation failed"); }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      await createNews(newsForm);
      toast.success("Intelligence Published.");
      setNewsForm({ title: '', summary: '', content: '', category: 'Stock Market', sourceLink: '', isTrending: false });
      loadData();
    } catch (error) { toast.error("Publishing protocol failure"); }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Confirm deletion of this intelligence packet?")) return;
    try {
      await deleteNews(id);
      toast.success("Packet Terminated.");
      loadData();
    } catch (error) { toast.error("Deletion failure"); }
  };

  const handleCreateInsight = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/insights', insightForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Strategic Insight Live.");
      setInsightForm({ title: '', content: '', type: 'market_tip' });
      loadData();
    } catch (error) { toast.error("Insight protocol failure"); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse(courseForm);
      toast.success("Education Protocol Initialized.");
      setCourseForm({ title: '', description: '', content: '', videoUrl: '', icon: 'BookOpen', category: 'Trading', isPremium: true });
      loadData();
    } catch (error) { toast.error("Course deployment failure"); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Confirm course termination?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course offline.");
      loadData();
    } catch (error) { toast.error("Termination failure"); }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Delete this communication log?")) return;
    try {
      await deleteAdminContact(id);
      toast.success("Log cleared.");
      loadData();
    } catch (error) { toast.error("Deletion failure"); }
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarItems = [
    { id: 'overview',  name: 'Command Hub',    icon: LayoutDashboard },
    { id: 'insights',  name: 'Daily Alpha',    icon: Zap },
    { id: 'news',      name: 'Intel Stream',   icon: Newspaper },
    { id: 'courses',   name: 'Academy Prep',   icon: BookOpen },
    { id: 'analytics', name: 'System Analytics',icon: BarChart3 },
    { id: 'messages',  name: 'Comm Logs',      icon: MessageSquare },
    { id: 'feedback',  name: 'User Intel',     icon: Star },
    { id: 'help',      name: 'Support Deck',   icon: LifeBuoy },
  ];

  const StatCard = ({ label, value, icon: Icon, color, bg, tab, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => tab && setActiveTab(tab)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center space-x-6 cursor-pointer hover:shadow-2xl transition-all group overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 -mr-12 -mt-12 transition-opacity" />
      <div className={`p-4 ${bg} dark:bg-opacity-10 rounded-2xl shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-black dark:text-white tracking-tighter leading-none mb-1">{value}</div>
        <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{label}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] font-sans selection:bg-brand-500/20">
      
      {/* 1. Sidebar Control Panel */}
      <div className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-8 flex flex-col h-screen sticky top-0 z-[100]">
        <div className="flex items-center space-x-4 mb-16">
          <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
             <h1 className="text-lg font-black dark:text-white uppercase tracking-tighter leading-none">Command</h1>
             <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Admin Terminal</p>
          </div>
        </div>
        
        <nav className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {sidebarItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[1.25rem] transition-all relative group ${
                activeTab === tab.id 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? '' : 'opacity-70'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.name}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="active-pill" className="absolute right-3 w-1 h-4 bg-brand-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                 <Users className="w-5 h-5 text-slate-400" />
              </div>
              <div className="truncate">
                 <p className="text-[10px] font-black dark:text-white uppercase truncate">Administrator</p>
                 <p className="text-[9px] font-bold text-slate-500">Fleet Control Active</p>
              </div>
           </div>
           <button onClick={() => navigate('/')} className="w-full py-4 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-950/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/20 transition-all">
              Abort Session
           </button>
        </div>
      </div>

      {/* 2. Content Terminal */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/10">
        
        <AnimatePresence mode="wait">
          {/* Tab: COMMAND HUB (Overview) */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
               <div className="flex justify-between items-end">
                  <div>
                     <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Command Hub.</h2>
                     <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-brand-600" /> Strategic Metric Analysis
                     </p>
                  </div>
                  <div className="flex items-center space-x-3">
                     <button onClick={loadData} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-brand-600 shadow-sm transition-all">
                        <TrendingUp className="w-4 h-4" />
                     </button>
                     <div className="bg-emerald-500/10 text-emerald-500 px-4 py-3 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Live Network
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {[
                    { label: 'Total Fleet',   value: usersList.length,    icon: Users,      color: 'text-blue-500',    bg: 'bg-blue-50',    tab: null },
                    { label: 'Intel Subs',    value: subscribersList.length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', tab: null },
                    { label: 'Comm Packets',  value: contactsList.length,  icon: Mail,       color: 'text-red-500',     bg: 'bg-red-50',     tab: 'messages' },
                    { label: 'Academy Modules',value: coursesList.length,   icon: BookOpen,   color: 'text-orange-500',  bg: 'bg-orange-50',  tab: 'courses' },
                    { label: 'User Rating',   value: feedbackList.length,  icon: Star,       color: 'text-amber-500',   bg: 'bg-amber-50',   tab: 'feedback' },
                    { label: 'Live Issues',   value: helpTickets.filter(t => t.status !== 'resolved').length, icon: LifeBuoy, color: 'text-purple-500', bg: 'bg-purple-50', tab: 'help' },
                  ].map((stat, i) => (
                    <StatCard key={i} {...stat} delay={i * 0.05} />
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                  {/* Fleet Registry (Users) */}
                  <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                       <div>
                          <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Fleet Registry</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time user authorization logs</p>
                       </div>
                       <div className="relative w-full md:w-64 group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                          <input 
                            type="text" placeholder="QUERY ID/EMAIL" 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                          />
                       </div>
                    </div>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                       {filteredUsers.map((u, i) => (
                         <div key={u._id} className="group p-6 bg-slate-50/50 dark:bg-slate-950/30 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 hover:border-brand-500/20 transition-all flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                               <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black text-sm">
                                  {u.name[0].toUpperCase()}
                               </div>
                               <div>
                                  <div className="text-sm font-black dark:text-white tracking-tight leading-tight">{u.name}</div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{u.email}</div>
                               </div>
                            </div>
                            <div className="flex items-center space-x-4">
                               <div className="flex flex-col items-end">
                                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                    u.plan === PLANS.PRIME ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                    u.plan === PLANS.ELITE ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                    'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                  }`}>{u.plan}</span>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">ID: {u._id.slice(-6)}</span>
                               </div>
                               <div className="flex items-center space-x-1">
                                  <button onClick={() => upgradePlan(u._id, PLANS.PRO)} className="p-2 text-slate-300 hover:text-brand-600 transition-colors"><ArrowUpCircle className="w-5 h-5" /></button>
                                  <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Quick Terminals */}
                  <div className="lg:col-span-2 space-y-10">
                    <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600 rounded-full blur-[80px] opacity-20 -mr-24 -mt-24" />
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 relative">Coupon Generator</h3>
                      <form onSubmit={handleCreateCoupon} className="space-y-6 relative">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Code</label>
                           <input 
                             placeholder="CODE" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:bg-white/10 transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Alpha Offset (%)</label>
                           <input 
                             type="number" placeholder="0" value={couponForm.discountPercent} onChange={e => setCouponForm({...couponForm, discountPercent: e.target.value})}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:bg-white/10 transition-all"
                           />
                        </div>
                        <button type="submit" className="w-full bg-white text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Generate Node</button>
                      </form>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Latest Interaction</h3>
                      {contactsList.length > 0 ? (
                        <div className="group relative">
                           <div className="absolute -left-6 top-0 bottom-0 w-1 bg-brand-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                           <h4 className="text-sm font-black dark:text-white mb-2 leading-tight uppercase tracking-tight">{contactsList[0].subject}</h4>
                           <p className="text-xs text-slate-500 line-clamp-3 mb-6 font-medium leading-relaxed">{contactsList[0].message}</p>
                           <div className="flex items-center justify-between">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{contactsList[0].name}</span>
                              <button onClick={() => setActiveTab('messages')} className="text-[9px] font-black text-brand-600 uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
                                 View Logs <ArrowRight className="w-3 h-3 ml-2" />
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="text-center py-10 opacity-30 italic text-[10px] uppercase font-black tracking-widest">No Active Logs</div>
                      )}
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* Tab: DAILY ALPHA (Insights) */}
          {activeTab === 'insights' && (
            <motion.div 
              key="insights" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Daily Alpha.</h2>
                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" /> Strategic Intelligence Packets
                   </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <form onSubmit={handleCreateInsight} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 lg:col-span-4 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                  <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.3em] mb-4">Intel Deployment</h3>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Headline</label>
                        <input required type="text" placeholder="Strategic Target" value={insightForm.title} onChange={e => setInsightForm({...insightForm, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Analysis Content</label>
                        <textarea required placeholder="Market logic..." rows="6" value={insightForm.content} onChange={e => setInsightForm({...insightForm, content: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intelligence Sector</label>
                        <select value={insightForm.type} onChange={e => setInsightForm({...insightForm, type: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all appearance-none">
                          <option value="market_tip">Market Protocol</option>
                          <option value="investing_advice">Asset Management</option>
                          <option value="crypto">Digital Assets</option>
                        </select>
                     </div>
                     <button type="submit" className="w-full btn-brand py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-500/20 active:scale-95 transition-all">Broadcast Alpha</button>
                  </div>
                </form>
                
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between px-4">
                     <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.3em]">Communication Stream</h3>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active: {insightsList.length}</span>
                  </div>
                  <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
                    {insightsList.map((insight, i) => (
                      <div key={insight._id} className="group p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 -mr-12 -mt-12 transition-opacity" />
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center">
                                 <Zap className="w-5 h-5 text-amber-500" />
                              </div>
                              <div>
                                 <h4 className="text-lg font-black dark:text-white tracking-tight uppercase group-hover:text-brand-600 transition-colors">{insight.title}</h4>
                                 <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(insight.date).toLocaleDateString()}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest">{insight.type.replace('_', ' ')}</span>
                                 </div>
                              </div>
                           </div>
                           <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{insight.content}</p>
                      </div>
                    ))}
                    {insightsList.length === 0 && (
                       <div className="bg-slate-50 dark:bg-slate-950/30 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                          <Zap className="w-12 h-12 text-slate-100 dark:text-slate-800 mx-auto mb-6" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Strategic Void</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: INTEL STREAM (News) */}
          {activeTab === 'news' && (
            <motion.div 
              key="news" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl sticky top-32 space-y-10">
                  <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.3em] flex items-center">
                    <PlusCircle className="w-5 h-5 mr-3 text-brand-600" />
                    Publish Intel
                  </h3>
                  <form onSubmit={handleCreateNews} className="space-y-6">
                    <input 
                      placeholder="Protocol Headline" required 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                      value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                    />
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all appearance-none"
                      value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})}
                    >
                      <option>Stock Market</option>
                      <option>Crypto</option>
                      <option>Economy</option>
                      <option>Global News</option>
                      <option>Opinion</option>
                    </select>
                    <textarea 
                      placeholder="Brief Briefing" rows="3" required 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none"
                      value={newsForm.summary} onChange={e => setNewsForm({...newsForm, summary: e.target.value})}
                    />
                    <textarea 
                      placeholder="Full Strategic Analysis (MD Ready)" rows="6" required 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none"
                      value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                    />
                    <div className="space-y-6">
                       <input 
                         placeholder="Source Node (URL)" 
                         className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                         value={newsForm.sourceLink} onChange={e => setNewsForm({...newsForm, sourceLink: e.target.value})}
                       />
                       <label className="flex items-center space-x-3 cursor-pointer group">
                         <div className="relative">
                            <input 
                              type="checkbox" checked={newsForm.isTrending}
                              onChange={e => setNewsForm({...newsForm, isTrending: e.target.checked})}
                              className="hidden" 
                            />
                            <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${newsForm.isTrending ? 'bg-brand-600 border-brand-600' : 'border-slate-200 dark:border-slate-800'}`}>
                               {newsForm.isTrending && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                         </div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-600 transition-colors">Strategic Priority (Trending)</span>
                       </label>
                    </div>
                    <button type="submit" className="w-full btn-brand py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-brand-500/20 active:scale-95 transition-all">Execute Publication</button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.3em]">Strategic Feed</h3>
                   <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> Active Nodes: {newsList.length}
                   </div>
                </div>
                <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
                  {newsList.map(news => (
                    <div key={news._id} className="group p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 -mr-16 -mt-16 transition-opacity" />
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="px-4 py-1 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-100 dark:border-slate-800">{news.category}</span>
                            {news.isTrending && <span className="px-4 py-1 bg-brand-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-brand-500/20">Hot Alpha</span>}
                          </div>
                          <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-4 group-hover:text-brand-600 transition-colors leading-tight">{news.title}</h4>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mb-6 leading-relaxed italic opacity-80">"{news.summary}"</p>
                          <div className="flex items-center space-x-4">
                             <a href={`/finor/${news.slug}`} target="_blank" rel="noreferrer" className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center hover:text-brand-600 transition-colors">
                                <ExternalLink className="w-3.5 h-3.5 mr-2" /> View Node
                             </a>
                             <div className="w-1 h-1 rounded-full bg-slate-200" />
                             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Hash: {news._id.slice(-8)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 self-end md:self-start">
                          <button onClick={() => handleDeleteNews(news._id)} className="p-4 bg-red-50 dark:bg-red-950/10 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-950/20 transition-all shadow-sm">
                             <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: ACADEMY PREP (Courses) */}
          {activeTab === 'courses' && (
            <motion.div 
              key="courses" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl sticky top-32 space-y-10">
                  <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.3em] flex items-center">
                    <BookOpen className="w-5 h-5 mr-3 text-brand-600" />
                    Deploy Academy Module
                  </h3>
                  <form onSubmit={handleCreateCourse} className="space-y-6">
                    <input 
                      placeholder="Module Title" required 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                      value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                    />
                    <input 
                      placeholder="Strategic Abstract" required 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                      value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                    />
                    <input 
                      placeholder="Video Endpoint (YT/Vimeo)" required 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                      value={courseForm.videoUrl} onChange={e => setCourseForm({...courseForm, videoUrl: e.target.value})}
                    />
                    <textarea 
                      placeholder="Detailed Logistics / Knowledge Base" rows="6" required 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none"
                      value={courseForm.content} onChange={e => setCourseForm({...courseForm, content: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        placeholder="Icon Ref" 
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest dark:text-white outline-none"
                        value={courseForm.icon} onChange={e => setCourseForm({...courseForm, icon: e.target.value})}
                      />
                      <input 
                        placeholder="Sector" 
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest dark:text-white outline-none"
                        value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})}
                      />
                    </div>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                         <input 
                           type="checkbox" checked={courseForm.isPremium}
                           onChange={e => setCourseForm({...courseForm, isPremium: e.target.checked})}
                           className="hidden" 
                         />
                         <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${courseForm.isPremium ? 'bg-amber-500 border-amber-500' : 'border-slate-200 dark:border-slate-800'}`}>
                            {courseForm.isPremium && <Star className="w-3 h-3 text-white fill-white" />}
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Gated Institutional Access (Premium)</span>
                    </label>
                    <button type="submit" className="w-full btn-brand py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-brand-500/20 active:scale-95 transition-all">Initialize Module</button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.3em]">Education Infrastructure</h3>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Modules Deployed: {coursesList.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {coursesList.map(course => (
                    <div key={course._id} className="group p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 -mr-16 -mt-16 transition-opacity" />
                       <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                         <div className="flex items-center space-x-8">
                           <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                             <Video className="w-8 h-8 text-brand-600" />
                           </div>
                           <div>
                             <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none group-hover:text-brand-600 transition-colors">{course.title}</h4>
                                {course.isPremium && <span className="px-3 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest border border-amber-500/20 rounded-full">★ Premium Gated</span>}
                             </div>
                             <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               <span>{course.category} Protocol</span>
                               <div className="w-1 h-1 rounded-full bg-slate-200" />
                               <span>ID: {course._id.slice(-6)}</span>
                             </div>
                           </div>
                         </div>
                         <button onClick={() => handleDeleteCourse(course._id)} className="p-5 bg-red-50 dark:bg-red-950/10 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-950/20 transition-all">
                            <Trash2 className="w-6 h-6" />
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: COMM LOGS (Messages) */}
          {activeTab === 'messages' && (
            <motion.div 
              key="messages" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
               <div className="flex justify-between items-end">
                  <div>
                     <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Communication Logs.</h2>
                     <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-indigo-500" /> Inbound Intelligence Terminal
                     </p>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl shadow-sm">
                     Total Entries: {contactsList.length}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                  {contactsList.map((contact) => (
                    <div key={contact._id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 -mr-16 -mt-16 transition-opacity" />
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-8">
                        <div className="flex items-center space-x-6">
                           <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center">
                              <Mail className="w-6 h-6 text-indigo-600" />
                           </div>
                           <div>
                              <div className="flex items-center space-x-3 mb-1">
                                 <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">{contact.name}</h4>
                                 <span className="px-3 py-1 bg-slate-50 dark:bg-slate-950 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-100 dark:border-slate-800">{contact.subject}</span>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.email}</div>
                           </div>
                        </div>
                        <div className="flex items-center space-x-6">
                           <div className="flex flex-col items-end">
                              <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Clock className="w-4 h-4 mr-2" />
                                {new Date(contact.createdAt).toLocaleString()}
                              </div>
                              <span className="text-[8px] font-bold text-slate-300 uppercase mt-1">ENTRY: #{contact._id.slice(-6)}</span>
                           </div>
                           <button onClick={() => handleDeleteContact(contact._id)} className="p-4 bg-red-50 dark:bg-red-950/10 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-950/20 transition-all">
                             <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed italic">
                        "{contact.message}"
                      </div>
                    </div>
                  ))}
                  {contactsList.length === 0 && (
                    <div className="bg-slate-50 dark:bg-slate-950/30 rounded-[4rem] p-32 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                      <MessageSquare className="w-16 h-16 text-slate-100 dark:text-slate-800 mx-auto mb-8" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Communication Silence</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {/* Tab: USER INTEL (Feedback) */}
          {activeTab === 'feedback' && (
            <motion.div 
              key="feedback" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">User Intel.</h3>
                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                      <Star className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" /> Platform Sentiment Metrics
                   </p>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl shadow-sm">
                   Strategic Entries: {feedbackList.length}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {feedbackList.length === 0 ? (
                  <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950/30 rounded-[4rem] p-32 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                     <Star className="w-16 h-16 text-slate-100 dark:text-slate-800 mx-auto mb-8" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No Sentiment Logged</p>
                  </div>
                ) : (
                  feedbackList.map((fb) => (
                    <div key={fb._id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 -mr-16 -mt-16 transition-opacity" />
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center space-x-5">
                           <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500">
                              {fb.name[0].toUpperCase()}
                           </div>
                           <div>
                              <p className="text-lg font-black dark:text-white uppercase tracking-tighter leading-none">{fb.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{fb.email}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100 dark:text-slate-800'}`} />
                          ))}
                          <span className="ml-3 text-[10px] font-black text-amber-500 uppercase tracking-widest">{fb.rating}/5</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed italic">
                        "{fb.message}"
                      </div>
                      <div className="mt-6 flex justify-end">
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Tab: SUPPORT DECK (Help Tickets) */}
          {activeTab === 'help' && (
            <motion.div 
              key="help" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Support Deck.</h3>
                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                      <LifeBuoy className="w-4 h-4 mr-2 text-red-500" /> Operational Protocol Management
                   </p>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/20 border border-amber-500/20 px-6 py-3 rounded-xl shadow-sm">
                      Open Protocols: {helpTickets.filter(t => t.status !== 'resolved').length}
                   </div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl shadow-sm">
                      Total Lifecycle: {helpTickets.length}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {helpTickets.length === 0 ? (
                  <div className="bg-slate-50 dark:bg-slate-950/30 rounded-[4rem] p-32 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                     <LifeBuoy className="w-16 h-16 text-slate-100 dark:text-slate-800 mx-auto mb-8" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Harmony</p>
                  </div>
                ) : (
                  helpTickets.map((ticket) => {
                    const statusStyles = {
                      open:        'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-500/20',
                      in_progress: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-500/20',
                      resolved:    'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/20',
                    };
                    return (
                      <div key={ticket._id} className={`group bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                          ticket.status === 'resolved' ? 'bg-emerald-500' : ticket.status === 'in_progress' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-8 relative">
                          <div className="flex-grow space-y-6">
                            <div className="flex items-center gap-4 flex-wrap">
                               <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                                  <ShieldAlert className={`w-6 h-6 ${ticket.status === 'resolved' ? 'text-emerald-500' : 'text-amber-500'}`} />
                               </div>
                               <div>
                                  <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none group-hover:text-brand-600 transition-colors mb-2">{ticket.subject}</h4>
                                  <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     <span>{ticket.name}</span>
                                     <div className="w-1 h-1 rounded-full bg-slate-200" />
                                     <span>{ticket.email}</span>
                                  </div>
                               </div>
                               <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ml-auto md:ml-0 ${statusStyles[ticket.status]}`}>
                                 {ticket.status.replace('_',' ')}
                               </span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
                               "{ticket.description}"
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-6 shrink-0">
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                               <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">NODE: #{ticket._id.slice(-6)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {ticket.status !== 'in_progress' && ticket.status !== 'resolved' && (
                                <button
                                  onClick={async () => {
                                    await axios.put(`/api/help/admin/${ticket._id}`, { status: 'in_progress' });
                                    loadData();
                                    toast.success('Protocol: Analysis Initiated.');
                                  }}
                                  className="px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                                >
                                  In Analysis
                                </button>
                              )}
                              {ticket.status !== 'resolved' && (
                                <button
                                  onClick={async () => {
                                    await axios.put(`/api/help/admin/${ticket._id}`, { status: 'resolved' });
                                    loadData();
                                    toast.success('Protocol: Solution Deployed.');
                                  }}
                                  className="px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                >
                                  Resolve
                                </button>
                              )}
                            </div>
                            {ticket.screenshotUrl && (
                              <a href={ticket.screenshotUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-brand-600 hover:translate-x-1 transition-transform">
                                <ExternalLink className="w-3.5 h-3.5" /><span>Visual Intel</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* Tab: SYSTEM ANALYTICS */}
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">System Analytics.</h3>
                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-indigo-500" /> Platform Telemetry & Usage
                   </p>
                </div>
              </div>

              {analyticsData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-500/20 p-8 rounded-[3rem] shadow-sm relative overflow-hidden">
                      <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/10" />
                      <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Total Trades Executed</h4>
                      <p className="text-6xl font-black text-indigo-600 dark:text-indigo-400">{analyticsData.totalTrades}</p>
                   </div>
                   <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-500/20 p-8 rounded-[3rem] shadow-sm relative overflow-hidden">
                      <Users className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-500/10" />
                      <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Active Nodes (24H)</h4>
                      <p className="text-6xl font-black text-emerald-600 dark:text-emerald-400">{analyticsData.activeUsers}</p>
                   </div>
                   <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-500/20 p-8 rounded-[3rem] shadow-sm relative overflow-hidden">
                      <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-brand-500/10" />
                      <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-4">Total Fleet Size</h4>
                      <p className="text-6xl font-black text-brand-600 dark:text-brand-400">{analyticsData.totalUsers}</p>
                   </div>
                   
                   <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm mt-8">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Top Trading Nodes</h3>
                     <div className="space-y-4">
                       {analyticsData.topTraders?.map((trader, i) => (
                         <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                           <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-indigo-600 dark:text-white">
                               #{i+1}
                             </div>
                             <div>
                               <p className="text-sm font-black dark:text-white uppercase tracking-tight">{trader.user?.name || 'Unknown Node'}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{trader.user?.email || 'N/A'}</p>
                             </div>
                           </div>
                           <div className="text-right">
                             <span className="text-lg font-black text-brand-600">{trader.count}</span>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Executions</p>
                           </div>
                         </div>
                       ))}
                       {(!analyticsData.topTraders || analyticsData.topTraders.length === 0) && (
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center py-8">No trading activity detected.</p>
                       )}
                     </div>
                   </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-32">
                  <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminDashboard;
