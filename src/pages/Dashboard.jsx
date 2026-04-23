import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Trophy, TrendingUp, Star, Zap, Calculator, 
  ChevronRight, FileText, Send, Sparkles, ShieldCheck, 
  Link2, Copy, Users, MessageSquare, Clock, Bot, Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth, PLANS } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, plan, notifications } = useAuth();
  const [courses, setCourses] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [dailyInsight, setDailyInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, bookmarkRes, insightRes] = await Promise.all([
          axios.get('/api/courses/progress').catch(() => ({ data: [] })),
          axios.get('/api/bookmarks').catch(() => ({ data: [] })),
          axios.get('/api/insights/today').catch(() => ({ data: null }))
        ]);
        
        const mappedCourses = courseRes.data.map(p => ({
          id: p.courseId._id || p.courseId,
          title: p.courseId.title,
          progress: p.completed ? 100 : 50,
        }));
        setCourses(mappedCourses);
        setBookmarks(bookmarkRes.data.slice(0, 4));
        setDailyInsight(insightRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickChat = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      navigate('/chatbot', { state: { initialMessage: chatInput } });
    }
  };

  const copyReferral = () => {
    const link = `https://finfleetacademy.com/signup?ref=${user?.referralCode || ''}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  // Animation Variants
  const containerVars = {
    show: { transition: { staggerChildren: 0.05 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/3" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVars}
      className="bg-[#F9FAFB] dark:bg-[#080C10] min-h-[calc(100vh-64px)] pb-24 font-sans selection:bg-brand-500/20"
    >
      {/* 1. TOP KPI ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <motion.div variants={itemVars} className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Ready for today's market analysis, {user?.name?.split(' ')[0]}?</p>
        </motion.div>

        <motion.div variants={containerVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Followers', value: user?.followersCount || 0, sub: '+2 new today', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-900/10' },
            { label: 'AI Usage', value: user?.chatCount || 0, sub: 'Daily quota: 20', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
            { label: 'Membership', value: plan === 'ELITE PRIME' ? 'Prime' : plan, sub: 'Active Plan', icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
            { label: 'Usage Value', value: `₹${plan === PLANS.PRIME ? '1999' : plan === PLANS.ELITE ? '699' : '0'}`, sub: 'Current Value', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' }
          ].map((kpi, i) => (
            <motion.div key={i} variants={itemVars} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stats</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{kpi.value}</div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-500">{kpi.label} · <span className="text-emerald-500">{kpi.sub}</span></p>
            </motion.div>
          ))}
        </motion.div>

        {/* 2. MAIN ACTION ZONE (Dominant AI Chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <motion.div variants={itemVars} className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[450px]">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">AI Insight Hub</h2>
                  <div className="flex items-center text-[10px] text-emerald-500 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                    Online & Calibrated
                  </div>
                </div>
              </div>
              <Link to="/chatbot" className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-400 hover:text-brand-600" />
              </Link>
            </div>
            
            <div className="p-8 flex-grow flex flex-col justify-between relative">
              <div className="space-y-6">
                <div className="flex items-start max-w-[80%]">
                  <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-[1.5rem] rounded-tl-none text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
                    Welcome back! Markets are showing interesting trends in the energy sector today. What would you like to analyze together?
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                  {['"Analyze Nifty 50 trends"', '"SIP vs Lumpsum guide"', '"Explain Inflation"', '"Risk profiles"'].map((q, i) => (
                    <button key={i} onClick={() => setChatInput(q.replace(/"/g, ''))} className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:border-brand-500/50 hover:text-brand-600 transition-all bg-slate-50/50 dark:bg-slate-900/50">
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleQuickChat} className="mt-8 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                <div className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask anything about finance..."
                    className="w-full pl-6 pr-16 py-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all dark:text-white"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="flex flex-col space-y-6">
             <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex-grow group shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-40 -mr-10 -mt-10" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-400 mb-6 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Daily Insight
                </h3>
                {dailyInsight ? (
                  <>
                    <h4 className="text-xl font-bold mb-4 group-hover:text-brand-400 transition-colors leading-tight">{dailyInsight.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-4">{dailyInsight.content}</p>
                    <Link to="/finor" className="text-xs font-black uppercase tracking-widest text-white border-b border-brand-500 pb-1 hover:text-brand-400 transition-colors">Read Full Article</Link>
                  </>
                ) : (
                  <p className="text-slate-500 italic">Connecting to intelligence feed...</p>
                )}
             </div>

             <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center">
                  <Link2 className="w-4 h-4 mr-2" />
                  Quick Invite
                </h3>
                <p className="text-xs font-bold text-slate-500 mb-6 leading-relaxed">Refer a friend and unlock <span className="text-indigo-500">+10 AI Messages</span> instantly.</p>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-xl p-1.5 border border-slate-200 dark:border-slate-800">
                  <code className="flex-grow text-[10px] font-black text-slate-700 dark:text-slate-300 px-3 uppercase tracking-tighter truncate">
                    {user?.referralCode || 'FN-PRO-721'}
                  </code>
                  <button onClick={copyReferral} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition-colors active:scale-90">
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
             </div>
          </motion.div>
        </div>

        {/* 3. SECONDARY SECTION (Progress & Bookmarks) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <motion.div variants={itemVars} className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                  Learning Progress
                </h3>
                <Link to="/courses" className="text-xs font-black text-brand-600 hover:underline">Continue All</Link>
              </div>
              <div className="p-0">
                {courses.length > 0 ? (
                  <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {courses.map((c, i) => (
                      <div key={i} className="px-8 py-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${c.progress === 100 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-brand-50 text-brand-600 dark:bg-brand-900/20'}`}>
                             {c.progress === 100 ? <Award className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{c.progress === 100 ? 'Completed' : 'Action Required'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                           <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${c.progress}%` }} 
                                className={`h-full rounded-full ${c.progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`} 
                              />
                           </div>
                           <Link to={`/courses/${c.id}`} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-600 hover:text-white transition-all">
                              <ChevronRight className="w-4 h-4" />
                           </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-sm font-bold text-slate-400 mb-4">You haven't started any learning modules yet.</p>
                    <Link to="/courses" className="btn-primary py-2.5 px-6 text-xs">Explore Academy</Link>
                  </div>
                )}
              </div>
           </motion.div>

           <motion.div variants={itemVars} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                  <Star className="w-4 h-4 mr-2 text-amber-500" />
                  Bookmarks
                </h3>
              </div>
              <div className="p-0 divide-y divide-slate-50 dark:divide-slate-800/50">
                 {bookmarks.length > 0 ? bookmarks.map((b, i) => (
                   <Link key={i} to={`/finor/${b.itemId}`} className="flex items-center p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-4 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
                      </div>
                      <div className="flex-grow truncate">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{b.title}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{b.itemType}</p>
                      </div>
                   </Link>
                 )) : (
                   <div className="p-12 text-center text-slate-400">
                      <p className="text-xs font-bold">No bookmarks saved.</p>
                   </div>
                 )}
              </div>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
