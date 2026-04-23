import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, BarChart2, DollarSign, Target, Award, BrainCircuit, 
  ArrowRight, ShieldCheck, Zap, PieChart, Activity, Crosshair, ArrowUpRight, ArrowDownRight,
  Calculator, ChevronRight, Lock
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Mock Stock Data for Simulation
const MOCK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 1.2 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.20, change: -0.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 145.80, change: 2.1 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.90, change: 0.8 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 185.30, change: -1.5 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 890.10, change: 3.4 },
];

const TradingDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio'); // portfolio, market, sip, quizzes, leaderboard
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tradeForm, setTradeForm] = useState({ symbol: 'AAPL', type: 'BUY', quantity: 1 });
  
  // Quiz State
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // SIP State
  const [sipData, setSipData] = useState({ amount: 5000, years: 10, returnRate: 12 });
  const [sipResult, setSipResult] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'portfolio' || activeTab === 'market') {
        const res = await axios.get('/api/trade/portfolio', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPortfolio(res.data.portfolio);
        setBalance(res.data.balance);
        setPoints(res.data.points);
      } else if (activeTab === 'quizzes') {
        const res = await axios.get('/api/quizzes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setQuizzes(res.data);
      } else if (activeTab === 'leaderboard') {
        const res = await axios.get('/api/quizzes/leaderboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLeaderboard(res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    try {
      const stock = MOCK_STOCKS.find(s => s.symbol === tradeForm.symbol);
      const res = await axios.post('/api/trade/execute', {
        symbol: tradeForm.symbol,
        type: tradeForm.type,
        quantity: tradeForm.quantity,
        price: stock.price
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(res.data.message);
      setBalance(res.data.balance);
      fetchData(); // Refresh portfolio
    } catch (error) {
      toast.error(error.response?.data?.message || 'Trade failed. Please try again.');
    }
  };

  const calculateSIP = () => {
    const P = sipData.amount;
    const n = sipData.years * 12;
    const r = (sipData.returnRate / 100) / 12;
    
    const M = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    
    setSipResult({ invested, wealth: M, profit: M - invested });
  };

  const handleQuizSubmit = async (quizId, answers) => {
    try {
      const res = await axios.post(`/api/quizzes/submit/${quizId}`, { answers }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Quiz Finished! Your score: ${res.data.score}/${res.data.total}`);
      if (res.data.passed) {
        setPoints(prev => prev + res.data.earnedPoints);
      }
    } catch (error) {
      toast.error('Could not submit quiz results.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-32 text-center bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen">
        <Lock className="w-16 h-16 text-brand-500 mx-auto mb-6" />
        <h2 className="text-3xl font-black dark:text-white mb-4 uppercase">Login Required</h2>
        <p className="text-slate-500 font-bold mb-8">Please login to access the trading simulator.</p>
        <button onClick={() => window.location.href='/login'} className="btn-brand py-4 px-10 text-[10px] uppercase tracking-widest">Log In</button>
      </div>
    );
  }

  const tabs = [
    { id: 'portfolio', name: 'My Portfolio', icon: PieChart },
    { id: 'market', name: 'Buy & Sell', icon: Activity },
    { id: 'sip', name: 'SIP Calculator', icon: Calculator },
    { id: 'quizzes', name: 'Skill Quizzes', icon: BrainCircuit },
    { id: 'leaderboard', name: 'Leaderboard', icon: Award }
  ];

  const portfolioValue = portfolio.reduce((acc, item) => {
    const stock = MOCK_STOCKS.find(s => s.symbol === item.symbol);
    return acc + (item.quantity * (stock?.price || 0));
  }, 0);

  const totalWealth = balance + portfolioValue;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] font-sans selection:bg-brand-500/20 pt-10 pb-20">
      
      {/* Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 mb-10">
         <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-3">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest text-center">
              This is a simulator for learning. No real money is involved.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter uppercase mb-2">Learn & <span className="text-brand-600">Trade.</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Real-world Stock Simulator</p>
           </div>
           <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <Award className="w-6 h-6 text-brand-600" />
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Learning Points</p>
                 <p className="text-xl font-black dark:text-white leading-none mt-1">{points}</p>
              </div>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto custom-scrollbar space-x-2 mb-12 bg-slate-100 dark:bg-slate-900/50 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-[1.5rem] whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-950 text-brand-600 shadow-xl' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          
          {/* PORTFOLIO TAB */}
          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Total Value Card */}
                  <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl border border-slate-800">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Total Balance</h3>
                     <div className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">₹{totalWealth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                     
                     <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Cash Balance</p>
                           <p className="text-2xl font-black text-white">₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Stock Value</p>
                           <p className="text-2xl font-black text-white">₹{portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                        </div>
                     </div>
                  </div>

                  {/* AI Assistant Mini */}
                  <div className="bg-brand-50 dark:bg-brand-900/10 rounded-[3rem] p-10 border border-brand-100 dark:border-brand-800/50">
                     <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20">
                        <BrainCircuit className="w-6 h-6 text-white" />
                     </div>
                     <h3 className="text-lg font-black dark:text-white uppercase tracking-tighter mb-4">Learning Insights</h3>
                     <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic mb-6">
                       "Tech stocks are volatile today. Consider diversifying your portfolio with index funds to reduce risk."
                     </p>
                     <button className="text-[9px] font-black text-brand-600 uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
                        Learn More <ArrowRight className="w-3.5 h-3.5 ml-2" />
                     </button>
                  </div>
               </div>

               {/* My Stocks Table */}
               <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-[12px] font-black dark:text-white uppercase tracking-[0.2em] mb-8">My Stocks</h3>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="border-b border-slate-100 dark:border-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              <th className="pb-4">Stock Name</th>
                              <th className="pb-4">Qty</th>
                              <th className="pb-4">Avg Price</th>
                              <th className="pb-4">LTP</th>
                              <th className="pb-4 text-right">P&L</th>
                           </tr>
                        </thead>
                        <tbody>
                           {portfolio.map((item) => {
                               const stock = MOCK_STOCKS.find(s => s.symbol === item.symbol);
                               const currentPrice = stock?.price || 0;
                               const invested = item.quantity * item.averagePrice;
                               const currentValue = item.quantity * currentPrice;
                               const pnl = currentValue - invested;
                               const pnlPercent = (pnl / invested) * 100;
                               const isPositive = pnl >= 0;

                               return (
                                 <tr key={item._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-6">
                                       <p className="text-sm font-black dark:text-white uppercase">{item.symbol}</p>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase">{stock?.name}</p>
                                    </td>
                                    <td className="py-6 font-bold dark:text-white">{item.quantity}</td>
                                    <td className="py-6 font-bold dark:text-white">₹{item.averagePrice.toFixed(2)}</td>
                                    <td className="py-6 font-bold dark:text-white">₹{currentPrice.toFixed(2)}</td>
                                    <td className="py-6 text-right">
                                       <p className={`text-sm font-black ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                          {isPositive ? '+' : ''}₹{pnl.toFixed(2)}
                                       </p>
                                       <p className={`text-[9px] font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                          {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
                                       </p>
                                    </td>
                                 </tr>
                               )
                           })}
                           {portfolio.length === 0 && (
                             <tr>
                               <td colSpan="5" className="py-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                                 You don't own any stocks yet. Go to Buy & Sell.
                               </td>
                             </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </motion.div>
          )}

          {/* MARKET TAB */}
          {activeTab === 'market' && (
            <motion.div key="market" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 space-y-10">
                  <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                     <h3 className="text-[12px] font-black dark:text-white uppercase tracking-[0.2em] mb-8">Stock Market</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MOCK_STOCKS.map(stock => (
                           <div key={stock.symbol} className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-brand-500/30 transition-all cursor-pointer" onClick={() => setTradeForm({...tradeForm, symbol: stock.symbol})}>
                              <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <h4 className="text-xl font-black dark:text-white leading-none">{stock.symbol}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stock.name}</p>
                                 </div>
                                 <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[9px] font-black uppercase ${stock.change >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {stock.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    <span>{Math.abs(stock.change)}%</span>
                                 </div>
                              </div>
                              <div className="text-2xl font-black dark:text-white">₹{stock.price.toFixed(2)}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4">
                  <div className="bg-slate-950 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl sticky top-32">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16" />
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Place Order</h3>
                     
                     <form onSubmit={handleTrade} className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stock Symbol</label>
                           <select value={tradeForm.symbol} onChange={e => setTradeForm({...tradeForm, symbol: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-500/20 appearance-none">
                              {MOCK_STOCKS.map(s => <option key={s.symbol} value={s.symbol} className="bg-slate-900 text-white">{s.symbol}</option>)}
                           </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <button type="button" onClick={() => setTradeForm({...tradeForm, type: 'BUY'})} className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${tradeForm.type === 'BUY' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>Buy</button>
                           <button type="button" onClick={() => setTradeForm({...tradeForm, type: 'SELL'})} className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${tradeForm.type === 'SELL' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>Sell</button>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                           <input type="number" min="1" value={tradeForm.quantity} onChange={e => setTradeForm({...tradeForm, quantity: parseInt(e.target.value) || 1})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-black text-white text-center outline-none focus:ring-4 focus:ring-brand-500/20" />
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Cash Required</span>
                           <span className="text-lg font-black text-white">₹{((MOCK_STOCKS.find(s => s.symbol === tradeForm.symbol)?.price || 0) * tradeForm.quantity).toLocaleString()}</span>
                        </div>

                        <button type="submit" className="w-full bg-white text-slate-950 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Confirm Order</button>
                     </form>
                  </div>
               </div>
            </motion.div>
          )}

          {/* SIP TAB */}
          {activeTab === 'sip' && (
            <motion.div key="sip" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-[12px] font-black dark:text-white uppercase tracking-[0.2em] mb-8">Calculate SIP</h3>
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Investment (₹)</label>
                           <span className="text-[10px] font-black text-brand-600">₹{sipData.amount.toLocaleString()}</span>
                        </div>
                        <input type="range" min="500" max="100000" step="500" value={sipData.amount} onChange={e => setSipData({...sipData, amount: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Returns (% p.a)</label>
                           <span className="text-[10px] font-black text-brand-600">{sipData.returnRate}%</span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value={sipData.returnRate} onChange={e => setSipData({...sipData, returnRate: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Period (Years)</label>
                           <span className="text-[10px] font-black text-brand-600">{sipData.years} Yrs</span>
                        </div>
                        <input type="range" min="1" max="40" step="1" value={sipData.years} onChange={e => setSipData({...sipData, years: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                     </div>
                     <button onClick={calculateSIP} className="w-full btn-brand py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em]">Calculate Returns</button>
                  </div>
               </div>
               
               {sipResult && (
                 <div className="lg:col-span-7 bg-slate-950 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Estimated Returns</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                       <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Invested</p>
                          <p className="text-xl font-black text-white">₹{Math.round(sipResult.invested).toLocaleString()}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Profit Earned</p>
                          <p className="text-xl font-black text-emerald-500">₹{Math.round(sipResult.profit).toLocaleString()}</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Value</p>
                          <p className="text-2xl font-black text-white">₹{Math.round(sipResult.wealth).toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[{year: 0, value: 0}, {year: sipData.years/2, value: sipResult.wealth/3}, {year: sipData.years, value: sipResult.wealth}]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="year" stroke="#475569" fontSize={10} tickFormatter={(val) => `${val}Y`} />
                          <YAxis stroke="#475569" fontSize={10} tickFormatter={(val) => `₹${val/1000}k`} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }} />
                          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
               )}
            </motion.div>
          )}

          {/* QUIZZES TAB */}
          {activeTab === 'quizzes' && (
            <motion.div key="quizzes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {quizzes.map(quiz => (
                     <div key={quiz._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-6">
                           <Target className="w-6 h-6 text-brand-600" />
                        </div>
                        <h4 className="text-xl font-black dark:text-white uppercase tracking-tight mb-2">{quiz.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 line-clamp-2">{quiz.description}</p>
                        <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                           <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center">
                              <Award className="w-4 h-4 mr-1.5" /> {quiz.points} PTS
                           </span>
                           <button onClick={() => {
                             // Mock auto-submit for simulation demo purposes
                             const answers = quiz.questions.map(() => 0); 
                             handleQuizSubmit(quiz._id, answers);
                           }} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                             Take Quiz
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
               <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
                  <h3 className="text-[12px] font-black dark:text-white uppercase tracking-[0.2em] mb-10 text-center">Top Students</h3>
                  <div className="space-y-4">
                     {leaderboard.map((u, i) => (
                        <div key={u._id} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${i === 0 ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50' : i === 1 ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}>
                           <div className="flex items-center space-x-6">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${i === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : i === 1 ? 'bg-slate-300 text-slate-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                 #{i + 1}
                              </div>
                              <div>
                                 <h4 className="text-lg font-black dark:text-white uppercase tracking-tight leading-none">{u.name}</h4>
                                 {i === 0 && <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-1">Top Rank</span>}
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="text-xl font-black text-brand-600 leading-none">{u.points}</span>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">PTS</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default TradingDashboard;
