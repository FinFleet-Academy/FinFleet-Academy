import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Send, Users, Search, Info, 
  TrendingUp, Bot, BookOpen, AlertCircle, Trash2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminNotifications = () => {
  const [target, setTarget] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('announcement');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (target === 'selected') {
      fetchUsers();
    }
  }, [target]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users?limit=50');
      setUsersList(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title || !message) return toast.error('Title and message are required');
    
    setLoading(true);
    try {
      await axios.post('/api/admin/notify', {
        target,
        userIds: selectedUsers.map(u => u._id),
        title,
        message,
        type,
        link
      });
      toast.success('Notification dispatched successfully');
      setTitle('');
      setMessage('');
      setSelectedUsers([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (user) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Global Dispatch.</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
            <Bell className="w-4 h-4 mr-2 text-indigo-600" /> Broadcast announcements & trading alerts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Configuration Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <form onSubmit={handleSend} className="space-y-8">
            
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Target Audience</label>
              <div className="flex space-x-3">
                {['all', 'selected'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTarget(t)}
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      target === t 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {t === 'all' ? 'Broadcast to All' : 'Select Specific Users'}
                  </button>
                ))}
              </div>
            </div>

            {target === 'selected' && (
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.length === 0 && <span className="text-[10px] font-bold text-slate-400 uppercase">No users selected</span>}
                  {selectedUsers.map(u => (
                    <span key={u._id} className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-black flex items-center space-x-2">
                      <span>{u.name}</span>
                      <button onClick={() => toggleUserSelection(u)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Notification Title</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g., Major Market Breakout"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Type</label>
                <select 
                  value={type} onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:border-indigo-500 outline-none transition-all appearance-none"
                >
                  <option value="announcement">Announcement</option>
                  <option value="trading_alert">Trading Alert</option>
                  <option value="ai_signal">AI Signal</option>
                  <option value="course_update">Course Update</option>
                  <option value="system_alert">System Alert</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Message Content</label>
              <textarea 
                value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:border-indigo-500 outline-none transition-all h-32 resize-none"
                placeholder="Write your message here..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Redirect Link (Optional)</label>
              <input 
                type="text" value={link} onChange={(e) => setLink(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:border-indigo-500 outline-none transition-all"
                placeholder="/courses/some-course-id"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-6 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/20 hover:scale-[1.01] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              <span>Dispatch Notification</span>
            </button>
          </form>
        </div>

        {/* User Selector */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">User Selection</h3>
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter users..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            {target === 'all' ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 px-6">
                <Users className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-[9px] font-black uppercase tracking-widest">Broadcast mode active. Individual selection disabled.</p>
              </div>
            ) : (
              filteredUsers.map(u => (
                <button
                  key={u._id}
                  onClick={() => toggleUserSelection(u)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all text-left ${
                    selectedUsers.find(sel => sel._id === u._id) 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 group'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                    selectedUsers.find(sel => sel._id === u._id) ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase truncate">{u.name}</p>
                    <p className={`text-[8px] font-bold uppercase tracking-widest truncate ${
                      selectedUsers.find(sel => sel._id === u._id) ? 'text-white/60' : 'text-slate-400'
                    }`}>{u.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminNotifications;
