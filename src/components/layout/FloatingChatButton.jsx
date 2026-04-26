import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const FloatingChatButton = () => {
  const location = useLocation();

  // Don't show the button on the chat page itself
  if (location.pathname === '/chatbot') return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link
        to="/chatbot"
        className="flex items-center justify-center w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg group relative transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-4 h-4 text-accent-gold fill-current" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest border border-slate-700">
          Ask FinFleet Academy AI
        </div>
      </Link>
    </motion.div>
  );
};

export default FloatingChatButton;
