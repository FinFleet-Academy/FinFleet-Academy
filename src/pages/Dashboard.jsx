import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trophy, TrendingUp, Award, Star, Bell, CheckCircle2, Wallet, Users, MessageSquare, Zap, Calculator, ChevronRight, FileText, Send, Sparkles, ShieldCheck, Link2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth, PLANS } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, plan, notifications, markNotificationRead } = useAuth();
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

  const userNotifs = notifications.filter(n => n.userEmail === 'ALL' || n.userEmail === user?.email);
  const unreadCount = userNotifs.filter(n => !n.read).length;

  const handleQuickChat = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      // In a real app, we might pass this via state to the ChatPage
      navigate('/chatbot');
    }
  };

  const copyReferral = () => {
    const link = `https://finfleetacademy.com/signup?ref=${user?.referralCode || ''}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] pb-24 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mb-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name?.split(' ')[0] || 'Student'}. Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/courses" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
              Browse Courses
            </Link>
            <Link to="/chatbot" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Open AI Assistant
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. TOP KPI ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Community</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">15,234</div>
              <div className="text-xs text-emerald-500 mt-1 font-medium">+12% this month</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">AI Usage</span>
              <Zap className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{user?.chatCount || 0} <span className="text-sm text-slate-400 font-normal">msgs</span></div>
              <div className="text-xs text-slate-500 mt-1">Resets daily at midnight</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Subscription</span>
              <Star className="w-4 h-4 text-brand-500" />
            </div>
            <div>
              <div className="text-2xl font-bold capitalize">{plan === 'ELITE PRIME' ? 'Prime' : plan.toLowerCase()}</div>
              <div className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">
                {plan === PLANS.FREE ? <Link to="/pricing" className="hover:underline">Upgrade available</Link> : 'Active plan'}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Revenue / Usage</span>
              <Wallet className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">₹{plan === PLANS.PRIME ? '1999' : plan === PLANS.ELITE ? '699' : plan === PLANS.PRO ? '199' : '0'}</div>
              <div className="text-xs text-slate-500 mt-1">Current monthly value</div>
            </div>
          </div>
        </div>

        {/* 2. MAIN ACTION ZONE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Chat Panel (Primary) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-semibold flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-brand-600" />
                Quick AI Assistant
              </h2>
              <Link to="/chatbot" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center">
                Full interface <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-end bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
              <div className="space-y-4 mb-6">
                <div className="flex items-start max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mr-3 shrink-0">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-700 dark:text-slate-300">
                    Hello! I'm FinFleet AI. What financial topic would you like to explore right now?
                  </div>
                </div>
              </div>
              <form onSubmit={handleQuickChat} className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about SIPs, market trends, or stock analysis..."
                  className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-shadow dark:text-white"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-semibold flex items-center">
                <Calculator className="w-4 h-4 mr-2 text-brand-600" />
                Smart Tools
              </h2>
            </div>
            <div className="p-4 space-y-2">
              <Link to="/tools" className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mr-4">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold dark:text-white">SIP Calculator</h3>
                    <p className="text-xs text-slate-500">Plan your investments</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </Link>

              <Link to="/tools" className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mr-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold dark:text-white">Risk Profiler</h3>
                    <p className="text-xs text-slate-500">Know your tolerance</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. SECONDARY SECTION & DATA TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Saved Items / Bookmarks */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-semibold flex items-center text-sm">
                <BookOpen className="w-4 h-4 mr-2 text-slate-500" />
                Saved Content
              </h2>
            </div>
            <div className="p-0">
              {bookmarks.length > 0 ? (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookmarks.map((b, i) => (
                    <li key={i} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <Link to={`/finor/${b.itemId}`} className="flex items-start">
                        <FileText className="w-4 h-4 text-slate-400 mr-3 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium dark:text-white line-clamp-1">{b.title || 'Saved Article'}</p>
                          <p className="text-xs text-slate-500 mt-1 capitalize">{b.itemType}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  No saved items yet. Explore the News hub to bookmark articles.
                </div>
              )}
            </div>
          </div>

          {/* Learning Progress Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-semibold flex items-center text-sm">
                <Trophy className="w-4 h-4 mr-2 text-brand-600" />
                Learning Progress
              </h2>
              <Link to="/courses" className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Course Name</th>
                    <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 w-1/3">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {courses.length > 0 ? courses.map((course, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-medium dark:text-white">{course.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${course.progress === 100 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'}`}>
                          {course.progress === 100 ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-grow h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${course.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 font-medium w-8">{course.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                        You haven't started any courses yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* 4. ENGAGEMENT ZONE (Insights, Referrals, Community) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Daily Insight */}
          <div className="bg-brand-900 rounded-xl border border-brand-800 shadow-sm text-white overflow-hidden flex flex-col relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
            <div className="px-6 py-4 border-b border-brand-800/50 flex justify-between items-center z-10">
              <h2 className="font-semibold flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-2 text-brand-300" />
                Today's Insight
              </h2>
            </div>
            <div className="p-6 flex-grow z-10">
              {dailyInsight ? (
                <>
                  <h3 className="font-bold text-lg mb-2">{dailyInsight.title}</h3>
                  <p className="text-sm text-brand-100/80 mb-4 line-clamp-3">{dailyInsight.content}</p>
                </>
              ) : (
                <p className="text-sm text-brand-100/80">Check back later for today's market insight.</p>
              )}
            </div>
          </div>

          {/* Referral Dashboard */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-semibold flex items-center text-sm">
                <Link2 className="w-4 h-4 mr-2 text-brand-600" />
                Invite & Earn
              </h2>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-center text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Invite friends and get <strong className="text-slate-900 dark:text-white">+10 AI Messages</strong> for each successful signup!
              </p>
              <div className="flex items-center bg-slate-100 dark:bg-slate-950 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
                <code className="flex-grow text-xs font-bold text-slate-700 dark:text-slate-300">
                  {user?.referralCode || 'GENERATING...'}
                </code>
                <button onClick={copyReferral} className="p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <Copy className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Community Chat Shortcut */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col group cursor-pointer hover:border-brand-500/50 transition-colors" onClick={() => navigate('/community')}>
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 transition-colors group-hover:bg-brand-50/50 dark:group-hover:bg-brand-900/10">
              <h2 className="font-semibold flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-brand-600" />
                Community Space
              </h2>
            </div>
            <div className="p-6 flex-grow flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm mb-1 dark:text-white">Join the Conversation</h3>
              <p className="text-xs text-slate-500">Connect with other traders in real-time.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
