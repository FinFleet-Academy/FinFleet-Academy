import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, BarChart2, Globe, ArrowRight, 
  Calendar, Bookmark, Star, Zap, Share2, Search,
  BellRing, Filter
} from 'lucide-react';
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
      await axios.post('/api/subscribers', { email, source: 'finor' });
      toast.success('Protocol Initiated. Check your inbox.');
      setEmail('');
    } catch (error) {
      toast.error('Subscription protocol failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20 pb-32">
      
      {/* 1. Technical Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 border-b border-slate-200 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="max-w-3xl">
                 <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-8 border border-brand-100 dark:border-brand-800">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Live Market Intelligence Stream</span>
                 </motion.div>
                 <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black dark:text-white tracking-tighter mb-8 leading-[0.9]">
                    Finor <span className="text-gradient">Intel.</span>
                 </motion.h1>
                 <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-slate-500 dark:text-slate-400 text-lg font-bold leading-relaxed">
                    Real-time geopolitical analysis, macro-economic shifts, and institutional market signals. Stay ahead of the global fleet.
                 </motion.p>
              </div>

              <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="flex-shrink-0">
                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16" />
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sentiment Protocol</div>
                    <div className="flex items-end space-x-6">
                       <div className="space-y-1">
                          <div className="flex items-center text-emerald-500 font-black text-4xl tracking-tighter">
                             <TrendingUp className="w-6 h-6 mr-2" /> 78.4
                          </div>
                          <div className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Ultra Bullish</div>
                       </div>
                       <div className="w-20 h-12 flex items-end space-x-1 pb-1">
                          {[30, 45, 60, 40, 70, 85].map((h, i) => (
                             <div key={i} className="flex-1 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500 transition-all duration-500" style={{ height: `${h}%` }} />
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* 2. Trending Pulse */}
      <section className="py-16 bg-white dark:bg-slate-900/20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center space-x-4">
                  <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                  <h2 className="text-xs font-black dark:text-white uppercase tracking-[0.3em]">Trending Alpha</h2>
               </div>
               <div className="hidden md:flex items-center space-x-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-2" /> Global Heatmap
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {trendingNews.slice(0, 2).map((news, idx) => (
                 <Link key={news._id} to={`/finor/${news.slug}`} className="group relative aspect-[16/9] md:aspect-auto md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                    {/* Placeholder image background */}
                    <div className="absolute inset-0 bg-slate-800 group-hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1611974717482-753ee1f66b8b?q=80&w=2070&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    
                    <div className="absolute top-8 left-8 z-20 flex space-x-3">
                       <span className="px-4 py-2 bg-brand-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-xl">
                          {news.category}
                       </span>
                       <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-[9px] font-black rounded-full uppercase tracking-widest border border-white/10">
                          Hot Intel
                       </span>
                    </div>

                    <div className="absolute bottom-12 left-12 right-12 z-20">
                       <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight group-hover:text-brand-400 transition-colors tracking-tighter">
                          {news.title}
                       </h3>
                       <div className="flex items-center space-x-6 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2" /> {new Date(news.createdAt).toLocaleDateString()}</div>
                          <div className="flex items-center"><Share2 className="w-3.5 h-3.5 mr-2" /> Strategic Share</div>
                       </div>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 3. Main Intelligence Grid */}
      <section className="py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
               
               {/* Left: Intel Stream */}
               <div className="lg:col-span-8 space-y-12">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-8">
                     <h2 className="text-xl font-black dark:text-white uppercase tracking-widest flex items-center">
                        <Globe className="w-6 h-6 mr-3 text-brand-600" />
                        Intelligence Feed
                     </h2>
                     <button className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-brand-600 transition-all">
                        <Filter className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="space-y-10">
                     {loading ? (
                        [1,2,3].map(i => (
                          <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 h-64 border border-slate-100 dark:border-slate-800" />
                        ))
                     ) : (
                        newsList.map((news) => (
                           <motion.div 
                             key={news._id} 
                             initial={{ opacity: 0, y: 20 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true }}
                             className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500"
                           >
                              <div className="p-8 md:p-12">
                                 <div className="flex items-center justify-between mb-6">
                                    <span className="px-4 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                       {news.category}
                                    </span>
                                    <button className="text-slate-300 hover:text-brand-600 transition-colors">
                                       <Bookmark className="w-5 h-5" />
                                    </button>
                                 </div>
                                 
                                 <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight tracking-tighter">
                                    {news.title}
                                 </h3>
                                 
                                 <p className="text-slate-500 dark:text-slate-400 mb-10 line-clamp-2 text-sm font-bold leading-relaxed">
                                    {news.summary}
                                 </p>
                                 
                                 <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                       <Activity className="w-3.5 h-3.5 mr-2" /> 4 min read
                                    </div>
                                    <Link to={`/finor/${news.slug}`} className="btn-brand py-3 px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/10">
                                       Access Intel <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                    </Link>
                                 </div>
                              </div>
                           </motion.div>
                        ))
                     )}
                  </div>
               </div>

               {/* Right: Technical Sidebar */}
               <div className="lg:col-span-4 space-y-12">
                  
                  {/* Category Protocol */}
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                     <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.3em] mb-10">Sector Filtering</h3>
                     <div className="space-y-4">
                        {[
                           { name: 'Stock Market', icon: TrendingUp, color: 'text-brand-600' },
                           { name: 'Crypto Pulse', icon: Activity, color: 'text-amber-500' },
                           { name: 'Macro Economy', icon: Globe, color: 'text-indigo-500' },
                           { name: 'Policy & Law', icon: ShieldCheck, color: 'text-emerald-500' }
                        ].map((cat, i) => (
                           <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                              <div className="flex items-center">
                                 <div className={`p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl group-hover:scale-110 transition-transform`}>
                                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                                 </div>
                                 <span className="ml-4 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{cat.name}</span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-brand-600 transition-colors" />
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Newsletter Terminal */}
                  <div className="bg-slate-950 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                     <div className="relative z-10 text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-white/10">
                           <BellRing className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Elite Intel Brief.</h3>
                        <p className="text-slate-400 text-[10px] font-bold mb-10 leading-relaxed uppercase tracking-widest">
                           Join 12,000+ institutional traders receiving daily macro reports.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-4">
                           <input 
                              type="email" placeholder="SECURE EMAIL NODE" required value={email}
                              onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:bg-white/10 focus:ring-4 focus:ring-brand-500/20 transition-all placeholder:text-white/20"
                           />
                           <button type="submit" disabled={isSubmitting} className="w-full bg-white text-slate-950 font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest shadow-xl">
                              {isSubmitting ? 'Syncing...' : 'Initiate Briefing'}
                           </button>
                        </form>
                     </div>
                  </div>

                  {/* Search Console */}
                  <div className="relative group">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                     <input 
                        type="text" placeholder="QUERY NEWS DATABASE"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                     />
                  </div>

               </div>
            </div>
         </div>
      </section>

      {/* Footer Decoration */}
      <div className="mt-32 text-center opacity-10 select-none pointer-events-none">
        <h2 className="text-[12vw] font-black text-slate-300 dark:text-slate-800 tracking-[0.2em] leading-none">FINOR</h2>
      </div>
    </div>
  );
};

export default FinorPage;
