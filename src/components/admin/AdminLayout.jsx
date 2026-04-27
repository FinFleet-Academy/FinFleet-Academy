import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Video, Users, CreditCard, BarChart3, Settings, 
  Search, Bell, LogOut, ChevronLeft, Menu, Command, Zap,
  Moon, Sun, ShieldCheck, Activity, Globe, History, BookOpen,
  ChevronRight, X, Sparkles, Plus, Layers
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import BrandLogo from '../ui/BrandLogo';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const isExpanded = !isSidebarCollapsed || isHovered;

  // Handle Command Palette (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { id: 'courses', label: 'Academy', icon: BookOpen, path: '/admin/courses' },
    { id: 'classes', label: 'Live Classes', icon: Video, path: '/admin/classes' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { id: 'support', label: 'Support', icon: Globe, path: '/admin/support' },
    { id: 'health', label: 'Health', icon: Activity, path: '/admin/health' },
    { id: 'audit', label: 'Audit Logs', icon: History, path: '/admin/audit' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleTabClick = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#080C10] font-sans selection:bg-brand-500/20 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Collapsible Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isExpanded ? 280 : 88,
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-[100] relative group shadow-2xl shadow-slate-200/50 dark:shadow-none"
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center px-6 overflow-hidden">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-brand-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-brand-600/20 shrink-0">
               <BrandLogo className="w-8 h-8 text-white" />
             </div>
             {isExpanded && (
               <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <h1 className="text-sm font-black uppercase tracking-tighter leading-none whitespace-nowrap">FinFleet Academy</h1>
                  <p className="text-[9px] font-black text-brand-600 uppercase tracking-widest mt-1">Institutional</p>
               </motion.div>
             )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all relative group/item ${
                  isActive 
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-brand-600'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover/item:scale-110 ${isActive ? '' : 'opacity-70'}`} />
                {isExpanded && (
                  <span className="text-[10px] font-black uppercase tracking-widest truncate">{item.label}</span>
                )}
                {isActive && !isExpanded && (
                   <motion.div layoutId="active-pill" className="absolute left-0 w-1.5 h-6 bg-white rounded-full -ml-0.5" />
                )}
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-20 px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover/item:opacity-100 translate-x-2 group-hover/item:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[200] shadow-2xl">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
           <button 
             onClick={() => navigate('/')}
             className="w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
           >
             <LogOut className="w-5 h-5 shrink-0" />
             {isExpanded && <span className="text-[10px] font-black uppercase tracking-widest">Exit Portal</span>}
           </button>
        </div>
      </motion.aside>

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Premium Header */}
        <header className="h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-b border-slate-200 dark:border-slate-800 px-10 flex items-center justify-between z-[90]">
           <div className="flex items-center space-x-8">
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-brand-600 transition-all hover:scale-110 active:scale-95"
              >
                 {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>

              <div className="relative group hidden lg:block">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="System Search (⌘ K)" 
                   className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] pl-14 pr-8 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-500/5 w-96 transition-all"
                   onFocus={() => setIsCommandOpen(true)}
                 />
              </div>
           </div>

           <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-3 px-5 py-2.5 bg-brand-500/5 rounded-2xl border border-brand-500/10">
                 <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
                 <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest">Elite Tier Node</span>
              </div>
              
              <button 
                onClick={() => setActiveTab('notifications')}
                className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-brand-600 transition-all relative group"
              >
                 <Bell className="w-5 h-5" />
                 {unreadCount > 0 && (
                   <span className="absolute top-3 right-3 w-2 h-2 bg-brand-600 rounded-full border-2 border-white dark:border-slate-900 ring-4 ring-brand-600/20" />
                 )}
              </button>

              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2" />

              <div className="flex items-center space-x-4 pl-2">
                 <div className="text-right hidden md:block">
                    <p className="text-[11px] font-black uppercase tracking-tighter dark:text-white leading-none">{user?.name || 'Admin'}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">Architect Access</p>
                 </div>
                 <div className="relative group">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 text-brand-600 font-black shadow-lg overflow-hidden group-hover:border-brand-500 transition-colors">
                       {user?.profileImage ? (
                         <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-sm">{user?.name?.[0].toUpperCase() || 'A'}</span>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Dynamic Canvas Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#F8FAFC] dark:bg-[#080C10]">
           <div className="max-w-7xl mx-auto">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  {children}
                </motion.div>
             </AnimatePresence>
           </div>
        </main>
      </div>

      {/* 3. Global Command Palette */}
      <AnimatePresence>
        {isCommandOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
               onClick={() => setIsCommandOpen(false)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10"
             >
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-6">
                   <div className="w-12 h-12 bg-brand-600/10 rounded-2xl flex items-center justify-center">
                     <Command className="w-6 h-6 text-brand-600" />
                   </div>
                   <input 
                     autoFocus
                     placeholder="Search functions, users, or modules..." 
                     className="flex-1 bg-transparent border-none outline-none text-xl font-black dark:text-white uppercase tracking-tight placeholder:text-slate-300"
                   />
                   <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-black text-slate-400">ESC</span>
                   </div>
                </div>
                
                <div className="p-6 max-h-[480px] overflow-y-auto no-scrollbar">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 mb-6 mt-2">Core Directives</div>
                   <div className="grid grid-cols-1 gap-2">
                     {menuItems.map(item => (
                       <button 
                         key={item.id}
                         onClick={() => { handleTabClick(item); setIsCommandOpen(false); }}
                         className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl transition-all group"
                       >
                          <div className="flex items-center space-x-5">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                               <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 group-hover:text-brand-600 transition-colors">{item.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                       </button>
                     ))}
                   </div>
                </div>
                
                <div className="p-6 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                   <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                         <div className="w-5 h-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex items-center justify-center text-[10px] font-black">↑</div>
                         <div className="w-5 h-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex items-center justify-center text-[10px] font-black">↓</div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Navigate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                         <div className="w-8 h-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex items-center justify-center text-[10px] font-black">↵</div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select</span>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
