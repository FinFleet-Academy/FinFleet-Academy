import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Video, Users, CreditCard, BarChart3, Settings, 
  Search, Bell, LogOut, ChevronLeft, Menu, Command, Zap,
  Moon, Sun, ShieldCheck, Activity, Globe, History
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../ui/BrandLogo';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live_classes', label: 'Live Classes', icon: Video },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit_logs', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] dark:bg-[#080C10] font-sans selection:bg-indigo-500/20 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-[100] relative"
      >
        <div className="p-6 flex items-center justify-between overflow-hidden">
          <div className="flex items-center space-x-3">
             <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
               <BrandLogo className="w-7 h-7 text-white" />
             </div>
             {isSidebarOpen && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h1 className="text-lg font-black uppercase tracking-tighter leading-none">FinFleet Academy</h1>
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Admin Control</p>
               </motion.div>
             )}
          </div>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all relative group ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? '' : 'opacity-70'}`} />
              {isSidebarOpen && (
                <span className="text-[11px] font-black uppercase tracking-widest truncate">{item.label}</span>
              )}
              {activeTab === item.id && !isSidebarOpen && (
                 <div className="absolute left-0 w-1.5 h-6 bg-white rounded-full -ml-0.5" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="w-full flex items-center justify-center p-3 text-slate-400 hover:text-indigo-600 transition-colors"
           >
             {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </motion.aside>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-[90]">
           <div className="flex items-center space-x-6">
              <div className="relative group hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search (Ctrl + K)" 
                   className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/5 w-64 lg:w-96 transition-all"
                   onFocus={() => setIsCommandOpen(true)}
                 />
              </div>
           </div>

           <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">System Healthy</span>
              </div>
              <button className="p-3 text-slate-400 hover:text-indigo-600 relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:border-slate-800" />
              <div className="flex items-center space-x-3 pl-2">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white leading-none">{user?.name || 'Admin'}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super Admin</p>
                 </div>
                 <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-indigo-600 font-black">
                    {user?.name?.[0].toUpperCase() || 'A'}
                 </div>
              </div>
           </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
           </AnimatePresence>
        </main>
      </div>

      {/* 3. Command Palette Modal */}
      <AnimatePresence>
        {isCommandOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
             >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                   <Command className="w-6 h-6 text-indigo-600" />
                   <input 
                     autoFocus
                     placeholder="Search commands, users, or classes..." 
                     className="flex-1 bg-transparent border-none outline-none text-lg font-bold dark:text-white"
                   />
                   <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[9px] font-black text-slate-400">ESC</span>
                   </div>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto">
                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3 mt-4">Quick Navigation</div>
                   {menuItems.map(item => (
                     <button 
                       key={item.id}
                       onClick={() => { setActiveTab(item.id); setIsCommandOpen(false); }}
                       className="w-full flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group"
                     >
                        <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                     </button>
                   ))}
                </div>
                <div 
                   className="absolute inset-0 z-[-1]" 
                   onClick={() => setIsCommandOpen(false)}
                />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
