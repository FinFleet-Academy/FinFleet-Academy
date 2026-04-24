import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, BookOpen, TrendingUp, Video, MessageSquare, 
  Settings, ShieldCheck, History, Menu, X, Bot, Zap, LayoutDashboard, Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { uiContent } from '../../config/ui-content';

const Sidebar = ({ isMobile }) => {
  const { user, isSidebarOpen, setSidebarOpen } = useAppStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { label: uiContent.navigation.dashboard, icon: Home, path: '/dashboard' },
    { label: 'Finor Intel', icon: Bot, path: '/finor' },
    { label: uiContent.navigation.proTrading, icon: TrendingUp, path: '/trading' },
    { label: uiContent.navigation.courses, icon: BookOpen, path: '/courses' },
    { label: uiContent.navigation.liveClasses, icon: Video, path: '/live-classes' },
    { label: uiContent.navigation.community, icon: MessageSquare, path: '/community' },
  ];

  const adminItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { label: 'System Health', icon: ShieldCheck, path: '/admin/health' },
    { label: 'User Management', icon: Users, path: '/admin/users' },
  ];

  const navItems = isAdmin && pathname.startsWith('/admin') ? adminItems : menuItems;

  return (
    <motion.aside
      initial={isMobile ? { x: -300 } : false}
      animate={{ 
        x: 0,
        width: isSidebarOpen ? 280 : 96,
      }}
      className={`
        bg-white dark:bg-[#0A0F14] border-r border-slate-100 dark:border-slate-800/50 
        h-full flex flex-col z-[100] relative transition-colors duration-500
        ${isMobile ? 'fixed left-0 top-0 bottom-0 shadow-2xl' : 'relative'}
      `}
    >
      <div className="p-8 flex items-center justify-between overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-lg font-black uppercase tracking-tighter leading-none dark:text-white">FinFleet</h1>
              <p className="text-[9px] font-black text-brand-600 uppercase tracking-widest">Academy</p>
            </motion.div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-4 px-4 py-4 rounded-[1.25rem] transition-all relative group
                ${isActive 
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-brand-600'}
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? '' : 'opacity-70'}`} />
              {isSidebarOpen && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {isSidebarOpen && (
        <div className="p-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-600" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">AI Assistant</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-4">Master the markets with our neural analytics engine.</p>
            <button className="w-full py-3 bg-white dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Launch AI</button>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
