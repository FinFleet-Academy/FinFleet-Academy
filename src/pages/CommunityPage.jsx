import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Users, MessageSquare, Megaphone, Search, Send, Heart, MessageCircle, Trash2, UserPlus, UserCheck, ChevronRight, X, MessageSquareQuote } from 'lucide-react';
import LikeButton from '../components/shared/LikeButton';
import CommentSection from '../components/shared/CommentSection';

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
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text" value={search} onChange={handleSearch}
          placeholder="Search members by name..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading members...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No members found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {users.map(u => (
            <div key={u._id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 font-bold flex items-center justify-center text-sm">
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold dark:text-white">{u.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{u.plan?.toLowerCase()} member</p>
                </div>
              </div>
              <button
                onClick={() => handleFollow(u._id, u.isFollowing)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  u.isFollowing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                {u.isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>{u.isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PRIVATE CHAT TAB ─────────────────────────────────────────────────────────
const ChatsTab = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/api/private-chat/conversations');
      setConversations(data);
    } catch { } finally { setLoadingConvs(false); }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const { data } = await axios.get(`/api/private-chat/${partnerId}`);
      setMessages(data);
    } catch { toast.error('Failed to load messages'); }
  };

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.partner._id);
      const iv = setInterval(() => fetchMessages(activeChat.partner._id), 3000);
      return () => clearInterval(iv);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;
    try {
      const msg = input; setInput('');
      await axios.post('/api/private-chat', { receiverId: activeChat.partner._id, text: msg });
      fetchMessages(activeChat.partner._id);
      fetchConversations();
    } catch { toast.error('Failed to send'); }
  };

  return (
    <div className="flex h-[62vh] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full sm:w-72 border-r border-slate-200 dark:border-slate-800 flex flex-col ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold dark:text-white">Messages</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="p-4 text-center text-sm text-slate-400">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">No conversations yet. Follow someone to start chatting.</div>
          ) : (
            conversations.map((conv, i) => (
              <button
                key={i}
                onClick={() => setActiveChat(conv)}
                className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${activeChat?.partner._id === conv.partner._id ? 'bg-brand-50 dark:bg-brand-900/10' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 font-bold flex items-center justify-center text-sm shrink-0">
                  {conv.partner.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium dark:text-white truncate">{conv.partner.name}</p>
                  <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="ml-auto bg-brand-600 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">{conv.unread}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
            <button onClick={() => setActiveChat(null)} className="sm:hidden text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 font-bold flex items-center justify-center text-sm">
              {activeChat.partner.name?.[0]?.toUpperCase()}
            </div>
            <p className="text-sm font-semibold dark:text-white">{activeChat.partner.name}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => {
              const isMe = msg.sender === currentUser?._id;
              return (
                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex space-x-2">
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-white"
            />
            <button type="submit" disabled={!input.trim()} className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white rounded-xl transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center text-slate-400 flex-col space-y-3">
          <MessageSquare className="w-10 h-10" />
          <p className="text-sm">Select a conversation</p>
        </div>
      )}
    </div>
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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

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
      toast.success('Announcement posted!');
    } catch { toast.error('Failed to create'); }
  };

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div>
          {!showCreateForm ? (
            <button onClick={() => setShowCreateForm(true)} className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
              <Megaphone className="w-4 h-4 mr-2" /> Post New Announcement
            </button>
          ) : (
            <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold dark:text-white">New Announcement</h3>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title" required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Content..." rows={4} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none" />
              <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma separated)" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
              <div className="flex space-x-3">
                <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors">Post</button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No announcements yet.</div>
      ) : (
        announcements.map(ann => {
          const isExpanded = expanded === ann._id;
          return (
            <div key={ann._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {ann.isPinned && (
                <div className="bg-brand-600 text-white text-xs font-bold px-4 py-1.5 flex items-center">
                  📌 Pinned Announcement
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {ann.tags?.map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">{ann.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">By {ann.createdBy?.name} · {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDelete(ann._id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>{ann.content}</p>
                {ann.content.length > 200 && (
                  <button onClick={() => setExpanded(isExpanded ? null : ann._id)} className="text-xs font-semibold text-brand-600 hover:text-brand-700 mt-2">
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}

                <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <LikeButton targetId={ann._id} targetType="announcement" size="sm" />
                  <button onClick={() => setExpanded(isExpanded ? null : ann._id)} 
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${isExpanded ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}>
                    <MessageSquareQuote className="w-4 h-4" />
                    <span>Comments</span>
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <CommentSection targetId={ann._id} targetType="announcement" />
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// ─── MAIN COMMUNITY PAGE ──────────────────────────────────────────────────────
const CommunityPage = () => {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState('announcements');

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'people', label: 'People', icon: Users },
    { id: 'chats', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Community</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Connect with fellow learners, read admin announcements, and chat privately.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex space-x-1 mb-8 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'announcements' && <AnnouncementsTab currentUser={user} isAdmin={isAdmin} />}
        {tab === 'people' && <PeopleTab currentUser={user} />}
        {tab === 'chats' && <ChatsTab currentUser={user} />}
      </div>
    </div>
  );
};

export default CommunityPage;
