import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, ExternalLink, ShieldAlert } from 'lucide-react';

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
      setExplanation('Failed to generate explanation. Please try again later.');
    } finally {
      setExplaining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24">
        <h2 className="text-3xl font-bold dark:text-white mb-4">Article Not Found</h2>
        <Link to="/finor" className="text-brand-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/finor" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 md:p-12 shadow-xl shadow-black/5"
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-full uppercase tracking-wider">
              {news.category}
            </span>
            <div className="flex items-center text-slate-500 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(news.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight">
            {news.title}
          </h1>

          {/* AI Explanation Feature */}
          <div className="mb-10 p-6 bg-brand-50 dark:bg-brand-900/10 rounded-2xl border border-brand-100 dark:border-brand-800/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold dark:text-white flex items-center">
                <span className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center mr-3 text-sm">AI</span>
                Explain this News
              </h3>
              {!explanation && (
                <button 
                  onClick={handleExplain} 
                  disabled={explaining}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {explaining ? 'Analyzing...' : 'Simplify'}
                </button>
              )}
            </div>
            
            {explanation && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {explanation}
              </motion.div>
            )}
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
            {news.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                {para}
              </p>
            ))}
          </div>

          {news.sourceLink && (
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <a 
                href={news.sourceLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-brand-600 hover:text-brand-500 font-bold transition-colors"
              >
                View Original Source
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          )}

          <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-start space-x-4">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
              <span className="font-bold">Disclaimer:</span> This content is for educational purposes only and not financial advice.
            </p>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default NewsDetailPage;
