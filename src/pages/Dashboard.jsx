import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trophy, Clock, TrendingUp, Award, PlayCircle, Star, ShieldCheck, Bell, CheckCircle2, LayoutDashboard, Wallet, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BudgetTracker from '../components/dashboard/BudgetTracker';
import axios from 'axios';

const Dashboard = () => {
  const { user, plan, notifications, markNotificationRead } = useAuth();
  const [courses, setCourses] = React.useState([]);
  const [bookmarks, setBookmarks] = React.useState([]);
  const [dailyInsight, setDailyInsight] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
          icon: BookOpen,
          color: p.courseId.color || 'text-brand-600',
          bg: p.courseId.bg || 'bg-brand-100'
        }));
        setCourses(mappedCourses);
        setBookmarks(bookmarkRes.data.slice(0, 3)); // Show top 3 bookmarks
        setDailyInsight(insightRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter notifications for this user or 'ALL' broadcast
  const userNotifs = notifications.filter(n => n.userEmail === 'ALL' || n.userEmail === user?.email);
  const unreadCount = userNotifs.filter(n => !n.read).length;

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Welcome back, {user?.name || 'Student'}!</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Check your progress and continue your learning journey.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-brand-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-brand-700 transition-colors cursor-pointer">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold">{plan} Member</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Plan Status', value: plan || 'Free', icon: Star, detail: 'Active Subscription' },
            { label: 'Messages Used', value: user?.chatCount || '0', icon: MessageSquare, detail: 'Daily AI Usage' },
            { label: 'Saved Items', value: bookmarks.length || '0', icon: Award, detail: 'Bookmarks' },
            { label: 'Learning Progress', value: courses.length || '0', icon: BookOpen, detail: 'Active Courses' },
          ].map((stat, i) => (
            <div key={i} className="card-premium p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <stat.icon className="w-5 h-5 text-brand-600" />
                </div>
                <span className="text-[10px] font-bold text-accent-success uppercase tracking-wider">{stat.detail}</span>
              </div>
              <div className="text-2xl font-bold dark:text-white capitalize">{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Budget Tracker Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold dark:text-white flex items-center mb-6">
            <Wallet className="w-5 h-5 mr-2 text-brand-600" />
            Financial Overview
          </h3>
          <BudgetTracker />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Courses */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold dark:text-white flex items-center">
              <PlayCircle className="w-5 h-5 mr-2 text-brand-600" />
              Continue Learning
            </h3>
            <div className="space-y-4">
              {courses.map((course, i) => (
                <div key={i} className="card-premium p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className={`w-14 h-14 ${course.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                    <course.icon className={`w-7 h-7 ${course.color}`} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold dark:text-white mb-2">{course.title}</h4>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        className="h-full bg-brand-600"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between md:flex-col md:items-end gap-2">
                    <span className="text-sm font-bold text-brand-600">{course.progress}%</span>
                    <button className="text-xs font-bold text-slate-400 hover:text-brand-600 transition-colors">Resume Lesson</button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Notifications Panel */}
            <div className="mt-8">
              <h3 className="text-xl font-bold dark:text-white flex items-center mb-6">
                <Bell className="w-5 h-5 mr-2 text-brand-600" />
                Notifications
                {unreadCount > 0 && (
                   <span className="ml-3 bg-brand-600 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">
                     {unreadCount} New
                   </span>
                )}
              </h3>
              <div className="card-premium p-0 overflow-hidden">
                {userNotifs.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    No notifications at this time.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    <AnimatePresence>
                      {userNotifs.map((notif) => (
                        <motion.div 
                          key={notif._id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-4 transition-colors ${notif.read ? 'bg-white dark:bg-slate-900' : 'bg-brand-50 dark:bg-brand-900/10'}`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                               <p className={`text-sm ${notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white font-bold'}`}>
                                 {notif.message}
                               </p>
                               <span className="text-xs text-slate-400 mt-1 block">
                                 {new Date(notif.date).toLocaleDateString()} at {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </span>
                            </div>
                            {!notif.read && (
                              <button 
                                onClick={() => markNotificationRead(notif.id)}
                                className="text-brand-600 hover:text-brand-700 p-1"
                                title="Mark as read"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Column (Certifications & Badges) */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold dark:text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-brand-600" />
              Achievements
            </h3>
            <div className="card-premium p-6 space-y-6">
              <div className="flex items-center space-x-4 p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-800/50">
                <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <div className="text-sm font-bold dark:text-white">Trading Basics</div>
                  <div className="text-[10px] text-slate-500">Verified April 2024</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 grayscale opacity-50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Trophy className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-bold dark:text-white">Pro Analyst</div>
                  <div className="text-[10px] text-slate-500">In Progress (60%)</div>
                </div>
              </div>

              <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-brand-600 border border-slate-200 dark:border-slate-800 rounded-xl transition-all">
                View All Certificates
              </button>
            </div>

            {/* Newsletter/Insights Card */}
            <div className="card-premium p-6 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold mb-2 dark:text-white flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-brand-600" />
                Daily Insight
              </h4>
              {dailyInsight ? (
                <>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{dailyInsight.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">{dailyInsight.content}</p>
                </>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Stay tuned for today's market insight.</p>
              )}
              <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Read Full Brief</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
