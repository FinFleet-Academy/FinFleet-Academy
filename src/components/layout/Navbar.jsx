import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, Sun, Moon, Menu, X, ChevronDown, User, LifeBuoy, MessageCircle, LogOut, Sparkles, ShieldCheck, Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from '../ui/BrandLogo';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); 
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { name: 'Courses', path: '/courses' },
    { name: 'Finor', path: '/finor' },
    { name: 'Live Classes', path: '/live-classes' },
    { name: 'Tools', path: '/tools' },
    { name: 'Community', path: '/community' },
    { name: 'Learn & Trade', path: '/trading' },
    { name: 'Pricing', path: '/pricing' }
  ];

  if (isAuthenticated) navLinks.unshift({ name: 'Dashboard', path: '/dashboard' });

  const isActive = (path) => location.pathname === path;
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  return (
    <nav className="sticky top-0 z-[100] h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center space-x-3 group relative">
            <BrandLogo className="h-8 w-auto" />
            <div className="flex flex-col -space-y-1">
               <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                 {location.pathname.startsWith('/finor') ? 'Finor' : 'FinFleet Academy'}
               </span>
               <span className="text-[9px] font-black text-brand-600 uppercase tracking-[0.2em]">
                 {location.pathname.startsWith('/finor') ? 'By FinFleet Academy' : 'Academy'}
               </span>
            </div>
          </Link>

          {/* CENTER NAV (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${
                  isActive(link.path) 
                    ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT ACTIONS (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
             <button onClick={toggleTheme} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl hover:scale-105 transition-all text-slate-500 hover:text-brand-600">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
             </button>

             {isAuthenticated ? (
               <div className="flex items-center space-x-4">
                 {/* Notifications Bell */}
                 <div className="relative" ref={notifRef}>
                   <button 
                     onClick={() => setNotifOpen(!notifOpen)}
                     className={`p-3 rounded-2xl transition-all relative ${notifOpen ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-brand-600'}`}
                   >
                     <Bell className="w-4 h-4" />
                     {unreadCount > 0 && (
                       <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
                     )}
                   </button>

                   <AnimatePresence>
                     {notifOpen && (
                       <motion.div
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                       >
                         <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Notifications</span>
                            {unreadCount > 0 && (
                              <button onClick={markAllAsRead} className="text-[9px] font-black uppercase tracking-widest text-brand-600 hover:underline">Mark all as read</button>
                            )}
                         </div>
                         <div className="max-h-[350px] overflow-y-auto">
                            {!notifications || notifications.length === 0 ? (
                              <div className="p-10 text-center">
                                 <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                 <p className="text-[10px] font-bold text-slate-400">No new notifications</p>
                              </div>
                            ) : (
                              notifications.map((n) => (
                                <div key={n._id} className={`p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group relative ${!n.isRead ? 'bg-brand-50/30 dark:bg-brand-900/5' : ''}`}>
                                   <div className="flex items-start space-x-3">
                                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? 'bg-brand-600' : 'bg-transparent'}`} />
                                      <div className="flex-1">
                                         <p className="text-[11px] font-black dark:text-white uppercase tracking-tight leading-tight mb-1">{n.title || 'Notification'}</p>
                                         <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-normal">{n.message}</p>
                                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                                      </div>
                                   </div>
                                   {!n.isRead && (
                                     <button onClick={() => markAsRead(n._id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-600">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                     </button>
                                   )}
                                </div>
                              ))
                            )}
                         </div>
                         <Link to="/dashboard" onClick={() => setNotifOpen(false)} className="block w-full p-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-950/50 hover:text-brand-600 transition-colors">
                            View All Notifications
                         </Link>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>

                 {/* User Dropdown */}
                 <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center space-x-3 p-1.5 pr-4 bg-slate-900 dark:bg-white rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
                    >
                       <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-xs shadow-inner">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt="" loading="lazy" className="w-full h-full rounded-xl object-cover" />
                          ) : initials}
                       </div>
                       <span className="text-xs font-black text-white dark:text-slate-900 uppercase tracking-widest">{user?.name?.split(' ')[0]}</span>
                       <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-4 w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden"
                        >
                           <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                              <p className="text-xs font-black dark:text-white uppercase tracking-widest mb-1 truncate">{user?.name}</p>
                              <div className="flex items-center text-[10px] font-bold text-brand-600">
                                 <ShieldCheck className="w-3 h-3 mr-1.5" /> Verified Account
                              </div>
                           </div>
                           <div className="p-2">
                              {[
                                { label: 'My Profile', icon: User, path: '/profile' },
                                { label: 'AI Assistant', icon: Sparkles, path: '/chatbot' },
                                { label: 'Help & Support', icon: LifeBuoy, path: '/help' },
                              ].map((item, i) => (
                                <Link key={i} to={item.path} onClick={() => setDropdownOpen(false)} className="flex items-center space-x-3 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                   <item.icon className="w-4 h-4" />
                                   <span>{item.label}</span>
                                </Link>
                              ))}
                           </div>
                           <div className="flex flex-col border-t border-slate-100 dark:border-slate-800">
                             <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full flex items-center space-x-3 px-7 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                                <LogOut className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Log Out</span>
                             </button>
                             <button onClick={() => { 
                               if(window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                 alert('Account deletion initiated.');
                                 setDropdownOpen(false); 
                               }
                             }} className="w-full flex items-center space-x-3 px-7 py-4 bg-red-50/50 dark:bg-red-950/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border-t border-red-100 dark:border-red-900/30">
                                <Trash2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Delete Account</span>
                             </button>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               </div>
             ) : (
               <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white">Login</Link>
                  <Link to="/signup" className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Join Now</Link>
               </div>
             )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden flex items-center space-x-4">
             <button onClick={toggleTheme} className="p-2">{isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}</button>
             <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900">{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
         {isOpen && (
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block py-4 border-b border-slate-50 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-500">{link.name}</Link>
              ))}
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <Link to="/login" onClick={() => setIsOpen(false)} className="py-4 text-center text-xs font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 rounded-2xl">Login</Link>
                   <Link to="/signup" onClick={() => setIsOpen(false)} className="py-4 text-center text-xs font-black uppercase tracking-widest bg-brand-600 text-white rounded-2xl shadow-xl">Join</Link>
                </div>
              ) : (
                <button onClick={() => { logout(); setIsOpen(false); }} className="w-full py-4 text-red-500 font-black text-xs uppercase tracking-widest bg-red-50 dark:bg-red-950/10 rounded-2xl">Logout</button>
              )}
           </motion.div>
         )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
