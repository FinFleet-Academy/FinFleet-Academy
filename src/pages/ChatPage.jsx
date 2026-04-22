import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, AlertCircle, TrendingUp, HelpCircle, Lock, Crown } from 'lucide-react';
import { PLANS, useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  const { plan, chatCount, setChatCount, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your FinFleet AI assistant. How can I help you with your trading journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastSent, setLastSent] = useState(0);
  const scrollRef = useRef(null);

  const LIMITS = {
    [PLANS.FREE]: 3,
    [PLANS.PRO]: 20,
    [PLANS.ELITE]: 100,
    [PLANS.PRIME]: Infinity
  };

  const limit = LIMITS[plan] || 3;
  const isUnlimited = plan === PLANS.PRIME;
  const limitReached = !isUnlimited && chatCount >= limit;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || limitReached) return;

    // Rate limiting (3 seconds)
    const now = Date.now();
    if (now - lastSent < 3000) {
      toast.error("Please wait a few seconds before sending another message.");
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setLastSent(now);

    try {
      const { data } = await axios.post('/api/chat', { 
        message: input, 
        history: messages 
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      setChatCount(data.chatCount);
    } catch (error) {
      const errMsg = error.response?.data?.message || "FinFleet AI is currently busy. Please try again later.";
      toast.error(errMsg);
      // Remove the last message if it failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto h-[700px] flex flex-col md:flex-row gap-6">
        
        {/* Sidebar / Info */}
        <div className="w-full md:w-80 space-y-4">
          <div className="card-premium p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="font-bold dark:text-white">FinFleet AI</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Your Plan</div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-bold text-brand-600">{plan}</div>
                  {isUnlimited && <Crown className="w-4 h-4 text-accent-gold" />}
                </div>
              </div>

              {!isUnlimited && (
                <div className="p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-800">
                  <div className="text-xs text-brand-600 uppercase tracking-widest mb-1">Daily Usage</div>
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold dark:text-white">{chatCount}/{limit}</span>
                    <span className="text-xs text-slate-500">messages</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${limitReached ? 'bg-red-500' : 'bg-brand-600'}`} 
                      style={{ width: `${Math.min(100, (chatCount / limit) * 100)}%` }}
                    />
                  </div>
                  {limitReached && (
                    <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tight">Limit Reached</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Popular Topics</h4>
              <button 
                onClick={() => setInput("What is the current trend in the Indian stock market?")}
                className="w-full text-left p-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Nifty/Sensex Trend?</span>
              </button>
              <button 
                onClick={() => setInput("Explain RSI indicator in simple terms.")}
                className="w-full text-left p-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Explain RSI</span>
              </button>
            </div>
          </div>

          {!isAuthenticated && (
             <div className="card-premium p-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
                <h4 className="font-bold mb-2">Login Required</h4>
                <p className="text-xs text-brand-100 mb-4">Please log in to check your plan status and access the AI.</p>
                <Link to="/login" className="block w-full text-center py-2 bg-white text-brand-700 rounded-lg text-sm font-bold shadow-lg">Login Now</Link>
             </div>
          )}

          {limitReached && (
            <div className="card-premium p-6 bg-amber-50 dark:bg-amber-900/10 border-amber-200">
              <h4 className="font-bold text-amber-800 dark:text-amber-500 mb-2">Need more?</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400/80 mb-4">Upgrade your plan to get more daily messages and advanced insights.</p>
              <Link to="/pricing" className="btn-primary w-full py-2 text-center text-sm shadow-brand-500/20">View Plans</Link>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="flex-grow flex flex-col card-premium p-0 overflow-hidden relative border-brand-500/10 shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold dark:text-white">FinFleet AI Assistant</div>
                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online & Ready</div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20"
          >
            {messages.map((m, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80">
            {limitReached ? (
              <div className="flex flex-col items-center text-center p-4 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500" />
                <div>
                  <h4 className="font-bold text-sm dark:text-white">Daily Limit Reached</h4>
                  <p className="text-[11px] text-slate-500">Upgrade your plan for more AI messages today.</p>
                </div>
                <Link to="/pricing" className="btn-primary py-2 px-6 text-xs font-bold">Upgrade Now</Link>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about markets, stocks, or investing..."
                  className="flex-grow bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white outline-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
            <div className="mt-2 text-center">
               <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Powered by FinFleet Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
