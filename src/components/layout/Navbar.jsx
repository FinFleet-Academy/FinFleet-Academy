import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Rocket, User, LogOut, ChevronDown, MessageCircle, LifeBuoy, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Academy', path: '/courses' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Finor', path: '/finor' },
    { name: 'AI Chatbot', path: '/chatbot' },
  ];

  if (isAuthenticated) navLinks.push({ name: 'Dashboard', path: '/dashboard' });
  if (isAdmin) navLinks.push({ name: 'Admin', path: '/admin' });

  const isActive = (path) => location.pathname === path;

  const initials = (user?.name || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => { logout(); setDropdownOpen(false); setIsOpen(false); };

  return (
    <nav className="sticky top-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Rocket className="text-white w-5 h-5" />
            </div>
            {location.pathname === '/finor' ? (
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold text-slate-900 dark:text-white">Finor</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">By FinFleet</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                FinFleet<span className="text-brand-600">Academy</span>
              </span>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}
                className={`text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                  isActive(link.path) ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'
                }`}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 text-xs font-bold">{initials}</div>
                  )}
                  <span className="text-sm font-medium dark:text-white">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link to="/profile" onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <User className="w-4 h-4" /> <span>Profile</span>
                        </Link>
                        <Link to="/help" onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <LifeBuoy className="w-4 h-4" /> <span>Help & Support</span>
                        </Link>
                        <Link to="/feedback" onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <MessageCircle className="w-4 h-4" /> <span>Give Feedback</span>
                        </Link>

                        {/* Dark mode toggle */}
                        <button onClick={() => { toggleTheme(); setDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex items-center space-x-3">
                            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                          </div>
                          <div className={`w-8 h-4 rounded-full transition-colors ${isDark ? 'bg-brand-600' : 'bg-slate-200'} relative`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0.5'}`} />
                          </div>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                        <button onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                          <LogOut className="w-4 h-4" /> <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle theme">
                  {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                </button>
                <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400">Login</Link>
                <Link to="/signup" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button onClick={toggleTheme} className="p-2">{isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}</button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-slate-600 dark:text-slate-400">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated ? (
                <div className="pt-4 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-2.5 rounded-lg bg-brand-600 text-white font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-sm font-bold dark:text-white">{user.name}</div>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base font-bold text-brand-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
