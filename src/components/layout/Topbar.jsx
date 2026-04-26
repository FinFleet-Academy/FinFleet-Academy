import React from 'react';
import { 
  Search, Bell, Moon, Sun, User, 
  Menu, LogOut, Settings, HelpCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import useNotifications from '../../hooks/useNotifications';
import NotificationPanel from './NotificationPanel';
import Badge from '../ui/Badge';

const Topbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between z-[80] transition-colors duration-500">
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="p-3 text-slate-400 hover:text-brand-600 transition-all rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search platform... (Ctrl + K)" 
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-500/5 w-64 lg:w-96 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-3 text-slate-400 hover:text-brand-600 transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-3 text-slate-400 hover:text-brand-600 relative rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[8px] font-black text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <NotificationPanel 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-2 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white leading-none">
              {user?.name || 'Guest'}
            </p>
            <div className="mt-1">
              <Badge variant={user?.plan === 'prime' ? 'emerald' : 'slate'} className="text-[7px]">
                {user?.plan || 'Free'}
              </Badge>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            {user?.name?.[0].toUpperCase() || 'G'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
