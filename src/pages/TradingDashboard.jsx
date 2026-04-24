import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, BarChart2, DollarSign, Target, Award, BrainCircuit, 
  ArrowRight, ShieldCheck, Zap, PieChart, Activity, Crosshair, ArrowUpRight, ArrowDownRight,
  Calculator, ChevronRight, Lock, Search, Filter, Globe, Eye, Trash2, Info
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import MarketDataChart from '../components/shared/MarketDataChart';

const TradingDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio'); // portfolio, market, sip, quizzes, leaderboard
  const [marketType, setMarketType] = useState('INDIA'); // INDIA, US
  
  // Data State
  const [stocks, setStocks] = useState([]);
  const [sectors, setSectors] = useState(['All']);
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Market Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStock, setSelectedStock] = useState(null); // Full stock object
  const [watchlist, setWatchlist] = useState([]);

  // Trade Form
  const [tradeForm, setTradeForm] = useState({ type: 'BUY', quantity: 1 });
  
  // Quiz & SIP States (Preserved)
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sipData, setSipData] = useState({ amount: 5000, years: 10, returnRate: 12 });
  const [sipResult, setSipResult] = useState(null);

  // 1. Initial Load
  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
      const savedWatchlist = JSON.parse(localStorage.getItem(`watchlist_${user._id}`)) || [];
      setWatchlist(savedWatchlist);
    }
  }, [isAuthenticated]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [sectorsRes, portfolioRes] = await Promise.all([
        axios.get('/api/stocks/sectors'),
        axios.get('/api/trade/portfolio', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setSectors(sectorsRes.data);
      setPortfolio(portfolioRes.data.portfolio);
      setBalance(portfolioRes.data.balance);
      setPoints(portfolioRes.data.points);
    } catch (error) {
      console.error("Initial load failed", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Poll for Market Data (Live Simulation)
  const fetchMarketData = useCallback(async () => {
    try {
      const res = await axios.get('/api/stocks', {
        params: { search: searchTerm, sector: selectedSector, market: marketType }
      });
      setStocks(res.data);
      
      // Update selected stock if it's currently being viewed to show latest price
      if (selectedStock) {
        const latest = res.data.find(s => s.symbol === selectedStock.symbol);
        if (latest) {
          // If viewing details, fetch full history occasionally or update current price
          setSelectedStock(prev => ({ ...prev, ...latest }));
        }
      }
    } catch (err) {
      console.error("Market fetch error", err);
    }
  }, [searchTerm, selectedSector, marketType, selectedStock]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMarketData();
      const interval = setInterval(fetchMarketData, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchMarketData, isAuthenticated]);

  // 3. Tab Specific Data
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'quizzes') fetchQuizzes();
      if (activeTab === 'leaderboard') fetchLeaderboard();
    }
  }, [activeTab, isAuthenticated]);

  const fetchQuizzes = async () => {
    const res = await axios.get('/api/quizzes', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setQuizzes(res.data);
  };

  const fetchLeaderboard = async () => {
    const res = await axios.get('/api/quizzes/leaderboard', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setLeaderboard(res.data);
  };

  // 4. Trading Actions
  const handleTrade = async (e) => {
    e.preventDefault();
    if (!selectedStock) return toast.error("Please select a stock first");
    
    try {
      const res = await axios.post('/api/trade/execute', {
        symbol: selectedStock.symbol,
        type: tradeForm.type,
        quantity: tradeForm.quantity,
        price: selectedStock.currentPrice,
        market: marketType
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success(res.data.message);
      setBalance(res.data.balance);
      fetchInitialData(); // Refresh portfolio
    } catch (error) {
      toast.error(error.response?.data?.message || 'Trade failed');
    }
  };

  const toggleWatchlist = (stock) => {
    let newWatchlist = [...watchlist];
    const exists = newWatchlist.find(s => s.symbol === stock.symbol);
    if (exists) {
      newWatchlist = newWatchlist.filter(s => s.symbol !== stock.symbol);
      toast.success("Removed from watchlist");
    } else {
      newWatchlist.push({ symbol: stock.symbol, name: stock.name });
      toast.success("Added to watchlist");
    }
    setWatchlist(newWatchlist);
    localStorage.setItem(`watchlist_${user._id}`, JSON.stringify(newWatchlist));
  };

  const calculateSIP = () => {
    const P = sipData.amount;
    const n = sipData.years * 12;
    const r = (sipData.returnRate / 100) / 12;
    const M = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    setSipResult({ invested: P * n, wealth: M, profit: M - (P * n) });
  };

  const handleQuizSubmit = async (quizId, answers) => {
    try {
      const res = await axios.post(`/api/quizzes/submit/${quizId}`, { answers }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Score: ${res.data.score}/${res.data.total}`);
      if (res.data.passed) setPoints(prev => prev + res.data.earnedPoints);
    } catch { toast.error('Quiz submission failed'); }
  };

  // 5. Calculations
  const portfolioValue = useMemo(() => {
    return portfolio.reduce((acc, item) => {
      const stock = stocks.find(s => s.symbol === item.symbol);
      return acc + (item.quantity * (stock?.currentPrice || item.averagePrice));
    }, 0);
  }, [portfolio, stocks]);

  const totalWealth = balance + portfolioValue;

  if (!isAuthenticated) return (
    <div className="py-32 text-center bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen">
      <Lock className="w-16 h-16 text-brand-500 mx-auto mb-6" />
      <h2 className="text-3xl font-black dark:text-white mb-4 uppercase">Login Required</h2>
      <button onClick={() => window.location.href='/login'} className="btn-brand py-4 px-10 text-[10px] uppercase">Log In</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] font-sans selection:bg-brand-500/20 pt-10 pb-20">
      
      {/* 1. DISCLAIMER */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 mb-10">
         <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-3">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <p className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] text-center">
              Simulated trading environment. No real money or real market data is used.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
           <div>
              <div className="flex items-center space-x-3 mb-3">
                 <Globe className="w-5 h-5 text-brand-600" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Status: <span className="text-emerald-500">Live Simulation</span></span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter uppercase leading-none">Learn & <span className="text-gradient">Trade.</span></h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm flex items-center space-x-4">
                 <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-brand-600" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skill Points</p>
                    <p className="text-2xl font-black dark:text-white leading-none">{points}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. NAVIGATION & FILTERS */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
           <div className="flex-grow flex overflow-x-auto custom-scrollbar space-x-2 bg-slate-100 dark:bg-slate-900/50 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800">
              {[
                { id: 'portfolio', name: 'Portfolio', icon: PieChart },
                { id: 'market', name: 'Stock Market', icon: Activity },
                { id: 'sip', name: 'SIP Calc', icon: Calculator },
                { id: 'quizzes', name: 'Quizzes', icon: BrainCircuit },
                { id: 'leaderboard', name: 'Ranks', icon: Award }
              ].map(tab => (
                <button
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-950 text-brand-600 shadow-xl' : 'text-slate-500 hover:text-brand-600'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">{tab.name}</span>
                </button>
              ))}
           </div>
           
           {activeTab === 'market' && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-900/50 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                 <button onClick={() => setMarketType('INDIA')} className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${marketType === 'INDIA' ? 'bg-white dark:bg-slate-950 text-brand-600 shadow-md' : 'text-slate-500'}`}>🇮🇳 India</button>
                 <button onClick={() => setMarketType('US')} className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${marketType === 'US' ? 'bg-white dark:bg-slate-950 text-brand-600 shadow-md' : 'text-slate-500'}`}>🇺🇸 US</button>
              </div>
           )}
        </div>

        {/* 4. TAB CONTENT */}
        <AnimatePresence mode="wait">
          
          {/* PORTFOLIO TAB */}
          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-slate-950 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl border border-slate-800">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500 rounded-full blur-[120px] opacity-20 -mr-40 -mt-40" />
                     <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Total Portfolio Value</h3>
                     <div className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-12">₹{totalWealth.toLocaleString('en-IN')}</div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-10 border-t border-slate-800">
                        <div>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Available Cash</p>
                           <p className="text-2xl font-black text-white">₹{balance.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Invested Value</p>
                           <p className="text-2xl font-black text-white">₹{portfolioValue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="hidden md:block">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total ROI</p>
                           <p className="text-2xl font-black text-emerald-500">+12.5%</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black dark:text-white uppercase tracking-widest">Watchlist</h3>
                        <Eye className="w-4 h-4 text-slate-400" />
                     </div>
                     <div className="space-y-4">
                        {watchlist.map(item => (
                          <div key={item.symbol} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 group">
                             <div>
                                <p className="text-xs font-black dark:text-white">{item.symbol}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">{item.name}</p>
                             </div>
                             <button onClick={() => { setSelectedStock({symbol: item.symbol, name: item.name}); setActiveTab('market'); }} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-4 h-4 text-brand-600" /></button>
                          </div>
                        ))}
                        {watchlist.length === 0 && <p className="text-[10px] font-bold text-slate-400 italic text-center py-10">Your watchlist is empty</p>}
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
                  <h3 className="text-[12px] font-black dark:text-white uppercase tracking-widest mb-10">My Holdings</h3>
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                           <th className="pb-6">Stock</th>
                           <th className="pb-6">Qty</th>
                           <th className="pb-6">Avg Cost</th>
                           <th className="pb-6">Current</th>
                           <th className="pb-6 text-right">Returns</th>
                        </tr>
                     </thead>
                     <tbody>
                        {portfolio.map((item) => {
                            const stock = stocks.find(s => s.symbol === item.symbol);
                            const currentPrice = stock?.currentPrice || item.averagePrice;
                            const pnl = (currentPrice - item.averagePrice) * item.quantity;
                            const pnlPercent = ((currentPrice - item.averagePrice) / item.averagePrice) * 100;
                            return (
                              <tr key={item._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                 <td className="py-8"><span className="text-sm font-black dark:text-white uppercase">{item.symbol}</span></td>
                                 <td className="py-8 font-bold dark:text-white">{item.quantity}</td>
                                 <td className="py-8 font-bold dark:text-white">₹{item.averagePrice.toLocaleString()}</td>
                                 <td className="py-8 font-bold dark:text-white">₹{currentPrice.toLocaleString()}</td>
                                 <td className="py-8 text-right">
                                    <p className={`text-sm font-black ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>₹{pnl.toLocaleString()}</p>
                                    <p className={`text-[9px] font-bold ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%</p>
                                 </td>
                              </tr>
                            )
                        })}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {/* MARKET TAB */}
          {activeTab === 'market' && (
            <motion.div key="market" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               {/* Market List */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                     <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" placeholder="Search Symbol..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                        />
                     </div>
                     <div className="flex flex-wrap gap-2 mb-8">
                        {sectors.map(s => (
                          <button key={s} onClick={() => setSelectedSector(s)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${selectedSector === s ? 'bg-brand-600 border-brand-600 text-white' : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-500 hover:border-brand-500/30'}`}>{s}</button>
                        ))}
                     </div>
                     <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {stocks.map(stock => (
                          <div 
                            key={stock.symbol} onClick={() => setSelectedStock(stock)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center group ${selectedStock?.symbol === stock.symbol ? 'bg-brand-50 dark:bg-brand-900/10 border-brand-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-brand-500/20'}`}
                          >
                             <div>
                                <h4 className="text-sm font-black dark:text-white leading-none group-hover:text-brand-600 transition-colors uppercase">{stock.symbol}</h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{stock.name}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black dark:text-white">₹{stock.currentPrice.toLocaleString()}</p>
                                <p className={`text-[9px] font-bold ${stock.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Stock View & Trade */}
               <div className="lg:col-span-8 space-y-10">
                  {selectedStock ? (
                    <>
                      <div className="bg-slate-950 rounded-[3.5rem] p-1 relative overflow-hidden shadow-2xl border border-slate-800 min-h-[450px]">
                         <MarketDataChart symbol={selectedStock.symbol} data={selectedStock.history || []} colors={{ backgroundColor: '#020617', lineColor: '#22c55e' }} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                               <h3 className="text-xs font-black dark:text-white uppercase tracking-widest">Stock Insights</h3>
                               <Info className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="space-y-6">
                               <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</span>
                                  <span className="text-xs font-black dark:text-white uppercase">{selectedStock.sector}</span>
                               </div>
                               <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volatilty</span>
                                  <span className="text-xs font-black text-amber-500 uppercase">Medium</span>
                               </div>
                               <button onClick={() => toggleWatchlist(selectedStock)} className="w-full py-4 bg-slate-50 dark:bg-slate-950 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-3">
                                  <Eye className="w-4 h-4" />
                                  <span>{watchlist.find(s => s.symbol === selectedStock.symbol) ? 'In Watchlist' : 'Add to Watchlist'}</span>
                               </button>
                            </div>
                         </div>

                         <div className="bg-slate-950 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[60px] opacity-10" />
                            <form onSubmit={handleTrade} className="space-y-8">
                               <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                                  <button type="button" onClick={() => setTradeForm({...tradeForm, type: 'BUY'})} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tradeForm.type === 'BUY' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Buy</button>
                                  <button type="button" onClick={() => setTradeForm({...tradeForm, type: 'SELL'})} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tradeForm.type === 'SELL' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Sell</button>
                               </div>
                               <div className="space-y-4">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Quantity</label>
                                  <input type="number" min="1" value={tradeForm.quantity} onChange={e => setTradeForm({...tradeForm, quantity: parseInt(e.target.value) || 1})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-3xl font-black text-white text-center outline-none focus:ring-4 focus:ring-brand-500/20" />
                               </div>
                               <div className="flex justify-between items-center text-white">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Cost</span>
                                  <span className="text-xl font-black">₹{(selectedStock.currentPrice * tradeForm.quantity).toLocaleString()}</span>
                               </div>
                               <button type="submit" className="w-full bg-white text-slate-950 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Execute Order</button>
                            </form>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 text-center p-10">
                       <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-3xl flex items-center justify-center mb-8"><Activity className="w-10 h-10 text-brand-600" /></div>
                       <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-4">Select a Stock to Begin</h3>
                       <p className="text-sm text-slate-500 font-bold max-w-xs uppercase tracking-widest leading-relaxed">Choose a stock from the list to view live charts and execute simulated trades.</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {/* SIP TAB (Preserved) */}
          {activeTab === 'sip' && (
            <motion.div key="sip" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-[12px] font-black dark:text-white uppercase tracking-[0.2em] mb-8">Calculate SIP</h3>
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <div className="flex justify-between"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Investment</label><span className="text-[10px] font-black text-brand-600">₹{sipData.amount.toLocaleString()}</span></div>
                        <input type="range" min="500" max="100000" step="500" value={sipData.amount} onChange={e => setSipData({...sipData, amount: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Returns (%)</label><span className="text-[10px] font-black text-brand-600">{sipData.returnRate}%</span></div>
                        <input type="range" min="1" max="30" step="1" value={sipData.returnRate} onChange={e => setSipData({...sipData, returnRate: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Period (Years)</label><span className="text-[10px] font-black text-brand-600">{sipData.years} Yrs</span></div>
                        <input type="range" min="1" max="40" step="1" value={sipData.years} onChange={e => setSipData({...sipData, years: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                     </div>
                     <button onClick={calculateSIP} className="w-full btn-brand py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em]">Calculate Returns</button>
                  </div>
               </div>
               {sipResult && (
                 <div className="lg:col-span-7 bg-slate-950 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 text-center">Estimated Wealth Growth</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
                       <div><p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Total Invested</p><p className="text-xl font-black text-white">₹{Math.round(sipResult.invested).toLocaleString()}</p></div>
                       <div><p className="text-[9px] font-bold text-emerald-400 uppercase mb-2">Profit Earned</p><p className="text-xl font-black text-emerald-500">₹{Math.round(sipResult.profit).toLocaleString()}</p></div>
                       <div className="p-6 bg-white/5 rounded-3xl border border-white/10"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Value</p><p className="text-3xl font-black text-white">₹{Math.round(sipResult.wealth).toLocaleString()}</p></div>
                    </div>
                 </div>
               )}
            </motion.div>
          )}

          {/* QUIZZES TAB (Preserved) */}
          {activeTab === 'quizzes' && (
            <motion.div key="quizzes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map(quiz => (
                  <div key={quiz._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                     <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-8"><Target className="w-8 h-8 text-brand-600" /></div>
                     <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-4">{quiz.title}</h4>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-10 line-clamp-2">{quiz.description}</p>
                     <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center"><Award className="w-4 h-4 mr-2" /> {quiz.points} PTS</span>
                        <button onClick={() => handleQuizSubmit(quiz._id, quiz.questions.map(() => 0))} className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Take Quiz</button>
                     </div>
                  </div>
               ))}
               {quizzes.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                     <BrainCircuit className="w-16 h-16 text-slate-300 dark:text-slate-800 mx-auto mb-6 opacity-20" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No quizzes available at the moment</p>
                  </div>
               )}
            </motion.div>
          )}

          {/* LEADERBOARD TAB (Preserved) */}
          {activeTab === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
               <h3 className="text-[12px] font-black dark:text-white uppercase tracking-[0.2em] mb-12 text-center">Master Traders</h3>
               <div className="space-y-4">
                  {leaderboard.map((u, i) => (
                     <div key={u._id} className={`flex items-center justify-between p-8 rounded-[2.5rem] border transition-all ${i === 0 ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <div className="flex items-center space-x-8">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${i === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>#{i + 1}</div>
                           <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none">{u.name}</h4>
                        </div>
                        <div className="text-right">
                           <span className="text-2xl font-black text-brand-600 leading-none">{u.points}</span>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">TOTAL PTS</p>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default TradingDashboard;
