import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Sparkles, AlertCircle, TrendingUp, 
  HelpCircle, Lock, Crown, Users, ChevronRight, X, UserCheck, 
  MessageCircle, Zap, ShieldCheck
} from 'lucide-react';
import { PLANS, useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// ─── PRIVATE CHAT INTERFACE ──────────────────────────────────────────────────
const PrivateChat = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/api/private-chat/conversations');
      setConversations(data);
    } catch { } finally { setLoading(false); }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const { data } = await axios.get(`/api/private-chat/${partnerId}`);
      setMessages(data);
    } catch { }
  };

  const location = useLocation();

  useEffect(() => { 
    fetchConversations(); 
    if (location.state?.initialPartner) {
      setActiveChat({ partner: location.state.initialPartner, lastMessage: '' });
    }
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.partner._id);
      const iv = setInterval(() => fetchMessages(activeChat.partner._id), 3000);
      return () => clearInterval(iv);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="flex h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
      {/* Sidebar */}
      <div className={`w-full sm:w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Direct Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <MessageCircle className="w-10 h-10 text-slate-200 mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Private Chats</p>
              <Link to="/community" className="inline-block text-[10px] font-black uppercase text-brand-600">Explore People</Link>
            </div>
          ) : (
            conversations.map((conv, i) => (
              <button
                key={i}
                onClick={() => setActiveChat(conv)}
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all ${activeChat?.partner._id === conv.partner._id ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center font-black shrink-0">
                  {conv.partner.name?.[0]?.toUpperCase()}
                </div>
                <div className="text-left overflow-hidden">
                  <p className={`text-sm font-bold truncate ${activeChat?.partner._id === conv.partner._id ? 'text-white' : 'dark:text-white'}`}>{conv.partner.name}</p>
                  <p className={`text-[10px] truncate ${activeChat?.partner._id === conv.partner._id ? 'text-brand-100' : 'text-slate-400'}`}>{conv.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-950/20">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setActiveChat(null)} className="sm:hidden p-2"><X className="w-5 h-5 text-slate-400" /></button>
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black">{activeChat.partner.name[0]}</div>
              <div>
                <p className="text-sm font-black dark:text-white">{activeChat.partner.name}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Verified Connection</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => {
              const isMe = m.sender === currentUser?._id;
              return (
                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-5 py-3 rounded-[1.5rem] text-sm font-medium ${isMe ? 'bg-brand-600 text-white rounded-tr-none shadow-lg shadow-brand-500/10' : 'bg-white dark:bg-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-800'}`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
             <form onSubmit={handleSend} className="flex space-x-2">
                <input
                  type="text" value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-brand-500/20 dark:text-white"
                />
                <button type="submit" disabled={!input.trim()} className="p-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all">
                  <Send className="w-5 h-5" />
                </button>
             </form>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center bg-slate-50/50 dark:bg-slate-950/20">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border border-slate-100 dark:border-slate-800">
              <Sparkles className="w-10 h-10 text-brand-600" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AI CHAT INTERFACE ───────────────────────────────────────────────────────
const AIChat = ({ user, plan, chatCount, setChatCount }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your FinFleet AI assistant. I have live market access and can simplify complex trading concepts. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.initialMessage) {
      handleSend(null, location.state.initialMessage);
    }
  }, []);

  const LIMITS = { [PLANS.FREE]: 3, [PLANS.PRO]: 20, [PLANS.ELITE]: 100, [PLANS.PRIME]: Infinity };
  const limit = LIMITS[plan] || 3;
  const limitReached = plan !== PLANS.PRIME && chatCount >= limit;

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = async (e, forcedInput) => {
    if (e) e.preventDefault();
    const msgText = forcedInput || input;
    if (!msgText.trim() || limitReached) return;

    const userMessage = { role: 'user', content: msgText };
    setMessages(prev => [...prev, userMessage]);
    if (!forcedInput) setInput('');
    setIsTyping(true);

    try {
      const { data } = await axios.post('/api/chat', { message: msgText, history: messages });
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      if (setChatCount) setChatCount(data.chatCount);
    } catch {
      toast.error("AI is thinking. Please wait.");
      setMessages(prev => prev.slice(0, -1));
    } finally { setIsTyping(false); }
  };

  return (
    <div className="flex h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
      {/* Sidebar Info */}
      <div className="hidden lg:flex w-72 border-r border-slate-100 dark:border-slate-800 flex-col bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-8">
           <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 mb-6">
              <Zap className="w-6 h-6 text-white" />
           </div>
           <h2 className="text-sm font-black uppercase tracking-widest dark:text-white mb-2">Platform Insights</h2>
           <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-10">Access real-time stock analysis, SIP projections, and risk modeling.</p>
           
           <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                 <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Usage Limit</div>
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xl font-black dark:text-white">{chatCount}/{limit === Infinity ? '∞' : limit}</span>
                 </div>
                 <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (chatCount/limit)*100)}%` }} className="h-full bg-brand-600" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Chat Space */}
      <div className="flex-1 flex flex-col">
        <div className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
           <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-brand-600 animate-pulse" />
              <h2 className="text-xs font-black uppercase tracking-widest dark:text-white">FinFleet Assistant</h2>
           </div>
           <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-tighter">Active</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20 dark:bg-slate-950/20">
           {messages.map((m, i) => (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-4 rounded-[1.75rem] text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white dark:bg-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                   {m.content}
                </div>
             </motion.div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
               <div className="px-6 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
             </div>
           )}
           <div ref={scrollRef} />
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
           {limitReached ? (
             <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-500">Daily interaction limit reached. Upgrade to Pro for unlimited insights.</p>
             </div>
           ) : (
             <form onSubmit={handleSend} className="flex space-x-3">
                <input 
                  value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything about markets..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:ring-4 focus:ring-brand-500/5"
                />
                <button type="submit" className="px-8 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 transition-all">
                  <Send className="w-5 h-5" />
                </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN CHAT PAGE CONTAINER ────────────────────────────────────────────────
const ChatPage = () => {
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.initialMode || 'ai'); // 'ai' | 'private'
  const { user, plan, chatCount, setChatCount, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-brand-600" />
          </div>
          <h2 className="text-2xl font-black dark:text-white mb-4 uppercase tracking-tighter">Access Restricted</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-10 leading-relaxed">Please sign in to access the AI assistant and your private messages.</p>
          <Link to="/login" className="btn-primary block w-full py-4 text-sm uppercase tracking-widest">Sign In</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F9FAFB] dark:bg-[#080C10] py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 h-[750px] flex flex-col">
        
        {/* Mode Toggle */}
        <div className="flex space-x-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit mb-8 mx-auto md:mx-0">
          <button 
            onClick={() => setMode('ai')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${mode === 'ai' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>
          <button 
            onClick={() => setMode('private')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${mode === 'private' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Private Chat</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {mode === 'ai' ? (
              <motion.div key="ai" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="h-full">
                <AIChat user={user} plan={plan} chatCount={chatCount} setChatCount={setChatCount} />
              </motion.div>
            ) : (
              <motion.div key="private" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full">
                <PrivateChat currentUser={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
