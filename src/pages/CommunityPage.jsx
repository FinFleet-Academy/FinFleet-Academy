import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Megaphone, Search, Send, Heart, 
  MessageCircle, Trash2, UserPlus, UserCheck, ChevronRight, 
  X, MessageSquareQuote, Star, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LikeButton from '../components/shared/LikeButton';
import CommentSection from '../components/shared/CommentSection';

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};

// ─── PEOPLE TAB ───────────────────────────────────────────────────────────────
const PeopleTab = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (q = '') => {
    try {
      const { data } = await axios.get(`/api/follow/discover${q ? `?search=${q}` : ''}`);
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers(e.target.value);
  };

  const handleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.delete(`/api/follow/${userId}`);
      } else {
        await axios.post(`/api/follow/${userId}`);
      }
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isFollowing: !isFollowing } : u));
    } catch { toast.error('Action failed'); }
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
        <input
          type="text" value={search} onChange={handleSearch}
          placeholder="Search members by name..."
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all dark:text-white shadow-sm"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {users.map(u => (
              <motion.div 
                key={u._id} 
                variants={fadeInUp} 
                layout
                className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
              >
                <Link to={`/user/${u._id}`} className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 font-black flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black dark:text-white truncate max-w-[120px]">{u.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.plan || 'MEMBER'}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleFollow(u._id, u.isFollowing)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                    u.isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      : 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700'
                  }`}
                >
                  {u.isFollowing ? 'Following' : 'Follow'}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

// ─── ANNOUNCEMENTS TAB ────────────────────────────────────────────────────────
const AnnouncementsTab = ({ currentUser, isAdmin }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get('/api/announcements');
      setAnnouncements(data);
    } catch { toast.error('Failed to load announcements'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/announcements', {
        title: form.title,
        content: form.content,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setAnnouncements(prev => [data, ...prev]);
      setForm({ title: '', content: '', tags: '' });
      setShowCreateForm(false);
      toast.success('Broadcast live!');
    } catch { toast.error('Broadcast failed'); }
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
      {isAdmin && (
        <motion.div variants={fadeInUp}>
          {!showCreateForm ? (
            <button onClick={() => setShowCreateForm(true)} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.01] shadow-xl">
              <Megaphone className="w-4 h-4 mr-2 inline" /> New Broadcast
            </button>
          ) : (
            <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
              <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">Compose Broadcast</h3>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all" />
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Broadcast content..." rows={4} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none" />
              <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma separated)" className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all" />
              <div className="flex space-x-3">
                <button type="submit" className="px-10 py-4 bg-brand-600 text-white text-xs font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-brand-500/20">Post</button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-black rounded-2xl uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          )}
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {announcements.map(ann => {
              const isExpanded = expanded === ann._id;
              return (
                <motion.div key={ann._id} variants={fadeInUp} layout className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  {ann.isPinned && (
                    <div className="bg-brand-600 text-white text-[9px] font-black uppercase tracking-[0.25em] px-8 py-2">
                      Pinned Intel
                    </div>
                  )}
                  <div className="p-8 md:p-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {ann.tags?.map((tag, i) => (
                            <span key={i} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg">{tag}</span>
                          ))}
                        </div>
                        <h3 className="text-2xl font-black dark:text-white leading-tight group-hover:text-brand-600 transition-colors">{ann.title}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 flex items-center">
                           <ShieldCheck className="w-3 h-3 mr-1.5 text-brand-600" />
                           By {ann.createdBy?.name} · {new Date(ann.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className={`text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {ann.content}
                    </p>
                    
                    {ann.content.length > 200 && (
                      <button onClick={() => setExpanded(isExpanded ? null : ann._id)} className="text-[10px] font-black uppercase tracking-widest text-brand-600 mt-4 hover:underline">
                        {isExpanded ? 'Collapse' : 'Expand Broadcast'}
                      </button>
                    )}

                    <div className="flex items-center space-x-4 mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50">
                      <LikeButton targetId={ann._id} targetType="announcement" size="sm" />
                      <button onClick={() => setExpanded(isExpanded ? null : ann._id)} 
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isExpanded ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                        <MessageSquareQuote className="w-4 h-4" />
                        <span>Intel Feed</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50 overflow-hidden">
                          <CommentSection targetId={ann._id} targetType="announcement" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

// ─── MAIN COMMUNITY PAGE ──────────────────────────────────────────────────────
const CommunityPage = () => {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState('announcements');

  const tabs = [
    { id: 'announcements', label: 'Broadcasts', icon: Megaphone },
    { id: 'people', label: 'Discover', icon: Users },
  ];

  return (
    <div className="bg-[#F9FAFB] dark:bg-[#080C10] min-h-[calc(100vh-64px)] pb-32 font-sans selection:bg-brand-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-6 border border-brand-100 dark:border-brand-800">
             <Star className="w-3 h-3 text-brand-600 fill-brand-600" />
             <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Verified Community</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter">Community</motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-bold max-w-xl mx-auto md:mx-0">
            A secure ecosystem for financial insights, verified announcements, and private peer discovery.
          </motion.p>
        </div>

        {/* Tab Bar */}
        <div className="flex space-x-2 mb-12 bg-white dark:bg-slate-900 p-2 rounded-[1.75rem] border border-slate-200 dark:border-slate-800 shadow-sm w-fit mx-auto md:mx-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                tab === t.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {tab === 'announcements' ? (
              <motion.div key="ann" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AnnouncementsTab currentUser={user} isAdmin={isAdmin} />
              </motion.div>
            ) : (
              <motion.div key="people" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <PeopleTab currentUser={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
