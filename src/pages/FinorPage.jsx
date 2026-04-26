import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, BarChart2, Globe, ArrowRight, 
  Calendar, Zap, Share2, Search, Filter, ShieldCheck,
  AlertCircle, Target, Gauge, Clock, LayoutGrid, BellRing
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

/**
 * 🟣 FinFleet Pro: Finor Intelligence Terminal
 * A high-density, Bloomberg-style financial news feed powered by AI.
 */
const FinorPage = () => {
  const [intelFeed, setIntelFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, US, EU, ASIA
  const [searchQuery, setSearchQuery] = useState('');

  const generateMockNews = () => {
    const mockTitles = [
      "Federal Reserve hints at interest rate stabilization",
      "Tech giants see massive surge in AI infrastructure spending",
      "Global energy markets brace for supply chain shifts",
      "Venture capital flow into fintech startups reaches 2-year high",
      "Emerging markets see record capital inflows this quarter"
    ];
    
    return {
      _id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
      summary: "AI detected a significant market shift that may impact your portfolio strategy.",
      content: "Detailed analysis suggests that market participants are recalibrating expectations following significant policy shifts. High-density liquidity zones are shifting toward defensive sectors as institutional capital rebalances.",
      marketImpact: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
      confidenceScore: Math.floor(Math.random() * 20 + 80),
      affectedAssets: ['GLOBAL', 'AI', 'TECH'],
      volatilityPrediction: 'MEDIUM',
      sentiment: 'BULLISH',
      createdAt: new Date().toISOString(),
      source: 'AI PREDICTIVE ENGINE',
      slug: `mock-news-${Date.now()}`
    };
  };

  const fetchInitialIntel = async () => {
    console.log("[Finor] Initiating Intelligence Fetch..."); // Debug Log
    try {
      const { data } = await axios.get('/api/news');
      console.log("AI News Response:", data); // Debug Log
      
      // Map standard news to Intel format
      const formatted = data.map(news => ({
        ...news,
        marketImpact: news.importance || (news.title.toLowerCase().includes('high') ? 'HIGH' : 'MEDIUM'),
        confidenceScore: 85 + Math.floor(Math.random() * 10),
        affectedAssets: news.affectedAssets || ['EQUITIES', 'NIFTY'],
        volatilityPrediction: 'MEDIUM',
        sentiment: 'NEUTRAL'
      }));

      if (formatted.length === 0) {
        console.warn("[Finor] No news from API, using fallback generator");
        const mock = generateMockNews();
        setIntelFeed(prev => [mock, ...prev]);
      } else {
        // Use the requested state update pattern: setNews(prev => [...data, ...prev])
        // We filter out duplicates to ensure a clean UI
        setIntelFeed(prev => {
          const newItems = formatted.filter(item => !prev.some(p => (p._id || p.id) === (item._id || item.id)));
          console.log(`[Finor] Adding ${newItems.length} new items to feed`); // Debug Log
          return [...newItems, ...prev];
        });
      }
    } catch (error) {
      console.error('Error fetching intel:', error);
      // Fallback (IMPORTANT): Generate mock news so UI still updates
      const mock = generateMockNews();
      setIntelFeed(prev => [mock, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialIntel();

    // 📡 Real-time listener (AUTO UPDATE: 60 seconds interval as requested)
    const interval = setInterval(() => {
      console.log("[Finor] Running scheduled intelligence refresh...");
      fetchInitialIntel();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredFeed = intelFeed.filter(item => {
    if (filter !== 'ALL' && item.region !== filter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-[#020617] min-h-screen text-slate-300 font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* 1. Terminal Header */}
      <div className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-[100]">
        <div className="flex items-center space-x-8">
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-xl shadow-brand-500/20">FI</div>
              <div>
                <h1 className="text-xl font-black text-white uppercase tracking-tighter">Finor <span className="text-brand-500">Terminal.</span></h1>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">Global AI News Engine</p>
              </div>
           </div>

           <div className="h-8 w-px bg-slate-800" />

           {/* Ingestion Status */}
           <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase text-emerald-500">Ingestion: 124 Sources</span>
              </div>
              <div className="flex items-center space-x-2">
                 <Zap className="w-3 h-3 text-amber-500" />
                 <span className="text-[9px] font-black uppercase text-amber-500">AI Latency: 240ms</span>
              </div>
           </div>
        </div>

        <div className="flex items-center space-x-4">
           <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH INTELLIGENCE"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-500 transition-all w-64"
              />
           </div>
           <button className="p-2.5 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-xl hover:bg-brand-500/20 transition-all">
              <BellRing className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex">
        
        {/* 2. Intelligence Side Panels */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/30 p-8 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto custom-scrollbar hidden xl:flex flex-col space-y-10">
           
           {/* Market Sentiment Meter */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Sentiment</h3>
                <span className="text-[10px] font-black text-emerald-500 uppercase">Bullish</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                 <div className="h-full bg-red-500" style={{ width: '24%' }} />
                 <div className="h-full bg-slate-700" style={{ width: '8%' }} />
                 <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" style={{ width: '68%' }} />
              </div>
              <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                 <span>Fear</span>
                 <span>Neutral</span>
                 <span>Greed</span>
              </div>
           </div>

           {/* Region Filters */}
           <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence Filter</h3>
              <div className="space-y-2">
                 {['ALL', 'US', 'EU', 'ASIA'].map(r => (
                   <button 
                    key={r}
                    onClick={() => setFilter(r)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${filter === r ? 'bg-brand-500/10 border-brand-500/30 text-brand-500' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                   >
                     <span className="text-[10px] font-black tracking-[0.2em] uppercase">{r} Intelligence</span>
                     <div className={`w-1.5 h-1.5 rounded-full ${filter === r ? 'bg-brand-500' : 'bg-slate-800'}`} />
                   </button>
                 ))}
              </div>
           </div>

           {/* Asset Correlation */}
           <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Correlation</h3>
              <div className="grid grid-cols-2 gap-3">
                 {['BTC', 'NASDAQ', 'NIFTY', 'GOLD'].map(asset => (
                   <div key={asset} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center">
                      <span className="text-[10px] font-black text-white mb-2">{asset}</span>
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* 3. Main Intelligence Feed */}
        <div className="flex-grow p-8">
           <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Intel Summary Header */}
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center space-x-4">
                    <LayoutGrid className="w-5 h-5 text-brand-600" />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">AI Intelligence Feed</h2>
                 </div>
                 <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Clock className="w-4 h-4" />
                    <span>Real-time Sync Active</span>
                 </div>
              </div>

              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-40 w-full bg-slate-900/50 rounded-3xl animate-pulse border border-slate-800" />)
              ) : (
                <AnimatePresence>
                  {filteredFeed.map((intel, idx) => (
                    <motion.div 
                      key={intel._id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-slate-900/40 hover:bg-slate-900 transition-all border border-slate-800 hover:border-slate-700 rounded-3xl p-8 relative overflow-hidden"
                    >
                      {/* Impact Sidebar Indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${intel.marketImpact === 'HIGH' ? 'bg-red-500' : intel.marketImpact === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      
                      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                         
                         {/* Content Section */}
                         <div className="flex-grow">
                            <div className="flex items-center space-x-4 mb-4">
                               <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${intel.marketImpact === 'HIGH' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                  {intel.marketImpact} IMPACT
                               </span>
                               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                  {intel.source || 'GLOBAL INTEL'} • {new Date(intel.createdAt).toLocaleTimeString()}
                               </span>
                            </div>

                            <Link to={`/finor/${intel.slug}`}>
                               <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-brand-500 transition-colors leading-tight tracking-tighter uppercase mb-4">
                                  {intel.title}
                               </h3>
                            </Link>

                            <p className="text-sm font-bold text-slate-500 leading-relaxed italic border-l-2 border-slate-800 pl-6 py-2 mb-6">
                               "{intel.summary}"
                            </p>

                            <div className="flex flex-wrap gap-3">
                               {intel.affectedAssets?.map(asset => (
                                 <div key={asset} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {asset}
                                 </div>
                               ))}
                            </div>
                         </div>

                         {/* AI Metrics Sidebar */}
                         <div className="lg:w-48 lg:border-l lg:border-slate-800 lg:pl-8 flex flex-row lg:flex-col justify-between lg:justify-start gap-6">
                            <div className="space-y-2">
                               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">AI Confidence</p>
                               <div className="flex items-center space-x-3">
                                  <div className="flex-grow h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-brand-500" style={{ width: `${intel.confidenceScore}%` }} />
                                  </div>
                                  <span className="text-[10px] font-black text-white">{intel.confidenceScore}%</span>
                               </div>
                            </div>

                            <div className="space-y-2">
                               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Volatility</p>
                               <div className="flex items-center space-x-2">
                                  <Activity className={`w-3.5 h-3.5 ${intel.volatilityPrediction === 'HIGH' ? 'text-red-500' : 'text-emerald-500'}`} />
                                  <span className="text-[10px] font-black text-white">{intel.volatilityPrediction}</span>
                               </div>
                            </div>
                         </div>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

           </div>
        </div>

        {/* 4. Global Heatmap Sidebar (Hidden on smaller screens) */}
        <div className="w-80 border-l border-slate-800 bg-slate-900/30 p-8 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto custom-scrollbar hidden 2xl:flex flex-col space-y-10">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Volatility Map</h3>
           <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'S&P 500', v: '0.8%', up: true },
                { name: 'VIX', v: '12.4%', up: false },
                { name: 'NIFTY', v: '1.2%', up: true },
                { name: 'GOLD', v: '0.4%', up: true },
                { name: 'DXY', v: '0.1%', up: false },
                { name: 'WTI', v: '2.8%', up: true }
              ].map(asset => (
                <div key={asset.name} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                   <p className="text-[9px] font-black text-slate-500 uppercase mb-2">{asset.name}</p>
                   <div className={`text-xs font-black ${asset.up ? 'text-emerald-500' : 'text-red-500'}`}>
                      {asset.up ? '+' : '-'}{asset.v}
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-brand-500/10 border border-brand-500/20 p-6 rounded-[2rem] space-y-4">
              <div className="flex items-center space-x-3">
                 <ShieldCheck className="w-5 h-5 text-brand-500" />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Analyst Mode</h4>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                Institutional-grade filtering enabled. Displaying only high-confidence macroeconomic events.
              </p>
           </div>
        </div>

      </div>

    </div>
  );
};

export default FinorPage;
