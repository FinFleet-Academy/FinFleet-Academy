import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, BarChart2, Globe, ArrowRight, Calendar, Bookmark, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FinorPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allNews, trending] = await Promise.all([
          axios.get('/api/news'),
          axios.get('/api/news/trending')
        ]);
        setNewsList(allNews.data);
        setTrendingNews(trending.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      await axios.post('/api/subscribers', { 
        email, 
        source: 'finor' 
      });
      toast.success('You’ll be notified when Finor launches 🚀');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      {/* Hero Header */}
      <section className="relative pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                <span>Live Market Insights</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
                Finor News Platform
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Your trusted source for real-time market news, crypto insights, and global economic trends. 
                <span className="text-brand-600 font-bold ml-1">Stay ahead of the curve.</span>
              </p>
            </div>
            
            <div className="flex-shrink-0">
               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Market Sentiment</div>
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center text-accent-success font-bold text-xl">
                        <TrendingUp className="w-5 h-5 mr-1" />
                        74.2
                     </div>
                     <div className="text-xs text-slate-500 font-medium">Strongly Bullish</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Finor Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold dark:text-white mb-2">About Finor</h2>
                <p className="text-brand-600 font-bold text-lg">Financial News, Simplified</p>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  Finor is a financial news platform by FinFleet Academy, built to deliver clear, reliable, and simplified insights from the world of finance.
                </p>
                <p>
                  In a market full of noise, complex jargon, and overwhelming information, Finor focuses on what truly matters—helping you understand the news, not just read it.
                </p>
                <p>
                  Our goal is to break down complex financial information into simple, meaningful insights that help you stay informed and think smarter.
                </p>
              </div>
              <div className="pt-4">
                <button 
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                  className="btn-primary flex items-center"
                >
                  Stay ahead with smarter news <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Lightbulb, title: 'Simplified News', desc: 'Complex topics explained clearly.' },
                { icon: Globe, title: 'Market Coverage', desc: 'Stocks, crypto, and economy.' },
                { icon: Activity, title: 'Actionable Insights', desc: 'Understand the “why” behind news.' },
                { icon: TrendingUp, title: 'Built for Modern Investors', desc: 'Designed for today’s learners.' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl"
                >
                  <item.icon className="w-8 h-8 text-brand-600 mb-3" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending News Section */}
      {trendingNews.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-2 h-8 bg-brand-600 rounded-full" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter italic">Trending Now</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trendingNews.map((news, idx) => (
                <Link key={news._id} to={`/finor/${news.slug}`} className="group relative h-80 rounded-3xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                  {/* Decorative background for news without image */}
                  <div className="absolute inset-0 bg-slate-800 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {news.category}
                    </span>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-brand-400 transition-colors">
                      {news.title}
                    </h3>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(news.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* News Feed */}
            <div className="lg:col-span-2">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-brand-600" />
                  Latest Financial News
               </h2>

               <div className="space-y-8">
                  {loading ? (
                    [1,2,3].map(i => (
                      <div key={i} className="animate-pulse flex flex-col gap-4">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </div>
                    ))
                  ) : newsList.length === 0 ? (
                    <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl">
                      <p className="text-slate-500">No news articles found.</p>
                    </div>
                  ) : (
                    newsList.map((news) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={news._id} 
                        className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-300"
                      >
                        <div className="p-6 md:p-8">
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                              {news.category}
                            </span>
                            <button className="text-slate-400 hover:text-brand-600 transition-colors">
                              <Bookmark className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">
                            {news.title}
                          </h3>
                          
                          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 text-base leading-relaxed">
                            {news.summary}
                          </p>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center text-xs text-slate-500 font-medium">
                              <Calendar className="w-4 h-4 mr-1.5" />
                              {new Date(news.createdAt).toLocaleDateString()}
                            </div>
                            <Link to={`/finor/${news.slug}`} className="inline-flex items-center font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 text-sm group/btn">
                              Read Full Article
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
               {/* Categories */}
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold dark:text-white mb-6">Categories</h3>
                  <div className="grid grid-cols-1 gap-3">
                     {[
                        { name: 'Stock Market', icon: TrendingUp },
                        { name: 'Crypto', icon: Activity },
                        { name: 'Economy', icon: Globe },
                        { name: 'Global News', icon: Globe },
                        { name: 'Opinion', icon: BarChart2 }
                     ].map((cat, i) => (
                        <button key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                           <div className="flex items-center">
                              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-brand-500 transition-colors">
                                 <cat.icon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-white" />
                              </div>
                              <span className="ml-3 text-sm font-bold text-slate-600 dark:text-slate-300">{cat.name}</span>
                           </div>
                           <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                        </button>
                     ))}
                  </div>
               </div>

               {/* Newsletter Sidebar */}
               <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-3">Newsletter</h3>
                     <p className="text-brand-100 text-sm mb-6 leading-relaxed">
                        Get expert financial insights delivered straight to your inbox daily.
                     </p>
                     <form onSubmit={handleSubscribe} className="space-y-3">
                        <input 
                           type="email" 
                           placeholder="your@email.com" 
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           disabled={isSubmitting}
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white/20 transition-all placeholder:text-white/40"
                        />
                        <button type="submit" disabled={isSubmitting} className="w-full bg-white text-brand-700 font-bold py-3 rounded-xl hover:bg-brand-50 transition-all text-sm disabled:opacity-50">
                           {isSubmitting ? '...' : 'Notify Me'}
                        </button>
                     </form>
                     <p className="text-[10px] text-brand-200 mt-4 text-center">Join 5,000+ financial enthusiasts.</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Branding Overlay */}
      <div className="pt-20 text-center opacity-30 select-none">
        <div className="inline-flex flex-col items-center">
          <span className="text-6xl font-black text-slate-200 dark:text-slate-900 tracking-tighter">FINOR</span>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-[0.5em] -mt-4">Premium Intelligence</span>
        </div>
      </div>
    </div>
  );
};

export default FinorPage;
