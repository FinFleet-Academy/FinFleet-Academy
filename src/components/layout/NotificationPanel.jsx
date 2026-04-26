import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, ExternalLink, Info, 
  TrendingUp, Bot, UserPlus, BookOpen, AlertCircle
} from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const TYPE_CONFIG = {
  announcement: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  course_update: { icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  system_alert: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  social: { icon: UserPlus, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  trading_alert: { icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ai_signal: { icon: Bot, color: 'text-brand-500', bg: 'bg-brand-500/10' },
};

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (n) => {
    markAsRead(n._id);
    if (n.link) navigate(n.link);
    onClose();
  };

  const newNotifications = notifications.filter(n => !n.isRead);
  const earlierNotifications = notifications.filter(n => n.isRead);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-4 w-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl shadow-black/10 overflow-hidden z-[100]"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black dark:text-white uppercase tracking-tighter">Notifications</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  You have {unreadCount} unread alerts
                </p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="max-h-[500px] overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No notifications yet</p>
                </div>
              ) : (
                <div className="p-2">
                  {newNotifications.length > 0 && (
                    <div className="mb-4">
                      <p className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">New</p>
                      {newNotifications.map(n => (
                        <NotificationItem key={n._id} n={n} onClick={() => handleNotificationClick(n)} />
                      ))}
                    </div>
                  )}
                  {earlierNotifications.length > 0 && (
                    <div>
                      <p className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Earlier</p>
                      {earlierNotifications.map(n => (
                        <NotificationItem key={n._id} n={n} onClick={() => handleNotificationClick(n)} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
              <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-600 transition-colors">
                View All History
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const NotificationItem = ({ n, onClick }) => {
  const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system_alert;
  const Icon = config.icon;

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-start space-x-4 p-4 rounded-3xl transition-all text-left hover:bg-slate-50 dark:hover:bg-slate-800 group ${!n.isRead ? 'bg-brand-50/50 dark:bg-brand-500/5' : ''}`}
    >
      <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[11px] font-black dark:text-white uppercase tracking-tight truncate">{n.title}</h4>
          <span className="text-[8px] font-bold text-slate-400 uppercase">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
        </div>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {n.message}
        </p>
        {n.metadata?.asset && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[8px] font-black text-slate-600 dark:text-slate-300 uppercase">
              {n.metadata.asset}
            </span>
            {n.metadata.confidence && (
              <span className="text-[8px] font-black text-brand-600 uppercase">
                {Math.round(n.metadata.confidence * 100)}% Confidence
              </span>
            )}
          </div>
        )}
      </div>
      {!n.isRead && (
        <div className="w-2 h-2 bg-brand-600 rounded-full mt-2" />
      )}
    </button>
  );
};

export default NotificationPanel;
