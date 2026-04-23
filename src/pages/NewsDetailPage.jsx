import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Tag, ExternalLink, 
  ShieldAlert, Sparkles, MessageCircle, 
  Share2, Bookmark, Clock, Star
} from 'lucide-react';
import CommentSection from '../components/shared/CommentSection';

const NewsDetailPage = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/news/${slug}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  const handleExplain = async () => {
    try {
      setExplaining(true);
      const response = await axios.post('/api/news/explain', { content: news.content });
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error('Error explaining news:', error);
      setExplanation('Protocol failure in AI simplification engine.');
    } finally {
      setExplaining(false);
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] flex flex-col items-center justify-center py-24">
        <ShieldAlert className="w-16 h-16 text-slate-300 mb-6" />
        <h2 className="text-3xl font-black dark:text-white mb-8 uppercase tracking-tighter">Intel Not Found.</h2>
        <Link to="/finor" className="btn-brand py-4 px-8 text-xs font-black uppercase tracking-widest flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Console
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] py-20 lg:py-32 font-sans selection:bg-brand-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <Link 
          to="/finor" 
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Intel Console
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-16 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[120px] opacity-10 -mr-32 -mt-32" />

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-10 relative">
            <span className="px-4 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-brand-100 dark:border-brand-800">
              {news.category}
            </span>
            <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              {new Date(news.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 mr-2" />
              4 Min Read
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-12 leading-[0.95] tracking-tighter relative">
            {news.title}
          </h1>

          {/* AI Intelligence Simplified */}
          <div className="mb-16 p-8 md:p-10 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Sparkles className="w-20 h-20 text-brand-600" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative">
              <div className="flex items-center">
                 <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-brand-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black dark:text-white uppercase tracking-widest">AI Intelligence Recap</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simplifying complex market signals</p>
                 </div>
              </div>
              {!explanation && (
                <button 
                  onClick={handleExplain} 
                  disabled={explaining}
                  className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {explaining ? 'Processing...' : 'Initiate Recap'}
                </button>
              )}
            </div>
            
            <AnimatePresence>
               {explanation && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800 pt-8">
                   {explanation}
                 </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* Content Body */}
          <div className="prose prose-slate dark:prose-invert max-w-none mb-16 relative">
            {news.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed mb-8">
                {para}
              </p>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 py-10 border-t border-slate-50 dark:border-slate-800">
             <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">
                   <Share2 className="w-4 h-4" /> <span>Strategic Share</span>
                </button>
                <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">
                   <Bookmark className="w-4 h-4" /> <span>Secure Link</span>
                </button>
             </div>
             {news.sourceLink && (
                <a 
                  href={news.sourceLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-500 transition-colors"
                >
                  View Original Source
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
             )}
          </div>

          {/* Disclaimer Protocol */}
          <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-100 dark:border-amber-900/20 flex items-start space-x-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldAlert className="w-12 h-12 text-amber-600" />
            </div>
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed font-bold uppercase tracking-wide relative">
              <span className="font-black">Legal Protocol:</span> This intelligence packet is provided for educational purposes only. It does not constitute financial advice, market manipulation, or institutional recommendation. Invest at your own risk.
            </p>
          </div>

          {/* Engagement Section */}
          <div className="mt-20 pt-20 border-t border-slate-50 dark:border-slate-800">
             <div className="flex items-center space-x-3 mb-12">
                <MessageCircle className="w-6 h-6 text-brand-600" />
                <h2 className="text-xl font-black dark:text-white uppercase tracking-widest">Public Discussion</h2>
             </div>
             <CommentSection targetId={news._id} targetType="news" />
          </div>

        </motion.article>

        {/* Footer Navigation Shortcut */}
        <div className="mt-20 text-center">
           <Link to="/finor" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-600 transition-colors flex items-center justify-center">
              Explore More Intel <Star className="w-4 h-4 ml-3 fill-brand-600 text-brand-600" />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
