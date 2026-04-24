import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, DollarSign, Target, Award, BrainCircuit, 
  ArrowUpRight, ArrowDownRight, Calculator, PieChart, Globe, Eye, Info, Maximize2, Zap, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../components/feedback/Toast';
import { uiContent } from '../config/ui-content';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table, { TableRow, TableCell } from '../components/ui/Table';
import Skeleton, { TableSkeleton } from '../components/ui/Skeleton';
import MarketDataChart from '../components/shared/MarketDataChart';

const TradingDashboard = () => {
  const { user } = useAppStore();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [marketType, setMarketType] = useState('INDIA');
  
  const [stocks, setStocks] = useState([]);
  const [sectors, setSectors] = useState(['All']);
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeForm, setTradeForm] = useState({ type: 'BUY', quantity: 1 });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [sectorsRes, portfolioRes] = await Promise.all([
        axios.get('/api/stocks/sectors'),
        axios.get('/api/trade/portfolio')
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

  const fetchMarketData = useCallback(async () => {
    try {
      const res = await axios.get('/api/stocks', {
        params: { search: searchTerm, sector: selectedSector, market: marketType, limit: 20 }
      });
      setStocks(res.data.stocks);
    } catch (err) {
      console.error("Market fetch error", err);
    }
  }, [searchTerm, selectedSector, marketType]);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!selectedStock) return addToast("Select a stock first", 'error');
    
    try {
      const res = await axios.post('/api/trade/execute', {
        symbol: selectedStock.symbol,
        type: tradeForm.type,
        quantity: tradeForm.quantity,
        price: selectedStock.currentPrice,
        market: marketType
      });
      addToast(res.data.message, 'success');
      setBalance(res.data.balance);
      fetchInitialData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Trade failed', 'error');
    }
  };

  const portfolioValue = useMemo(() => {
    return portfolio.reduce((acc, item) => {
      const stock = stocks.find(s => s.symbol === item.symbol);
      return acc + (item.quantity * (stock?.currentPrice || item.averagePrice));
    }, 0);
  }, [portfolio, stocks]);

  if (loading) return <div className="p-10"><TableSkeleton /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-12">
      {/* 1. Market Status Bar */}
      <div className="bg-amber-500/10 border border-amber-500/20 py-4 px-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Simulated Environment Active</p>
        </div>
        <Badge variant="emerald">Market Open</Badge>
      </div>

      {/* 2. Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-5 h-5 text-brand-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Terminal</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
            Tactical <span className="text-brand-600">Trading.</span>
          </h1>
        </div>
        <div className="flex space-x-4">
          <Card padding="px-8 py-4" className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skill Points</p>
              <p className="text-2xl font-black dark:text-white leading-none">{points}</p>
            </div>
          </Card>
          <Button variant="indigo" size="lg" className="rounded-[2rem] px-10 shadow-xl shadow-indigo-500/20" onClick={() => navigate('/pro-chart')}>
            <Maximize2 className="w-4 h-4 mr-2" />
            Pro Terminal
          </Button>
        </div>
      </div>

      {/* 3. Navigation */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow flex overflow-x-auto no-scrollbar space-x-2 bg-slate-100 dark:bg-slate-900/50 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800">
          {[
            { id: 'portfolio', name: 'Portfolio', icon: PieChart },
            { id: 'market', name: 'Live Market', icon: Activity },
            { id: 'sip', name: 'SIP Hub', icon: Calculator },
          ].map(tab => (
            <button
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-950 text-brand-600 shadow-xl' : 'text-slate-500 hover:text-brand-600'}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'portfolio' && (
          <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-[#0A0F14] border-slate-800 p-12 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500 rounded-full blur-[120px] opacity-20 -mr-40 -mt-40" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Aggregate Net Worth</p>
                <h2 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-12">
                  ₹{(balance + portfolioValue).toLocaleString()}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-10 border-t border-slate-800">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Available Cash</p>
                    <p className="text-2xl font-black text-white">₹{balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Invested Assets</p>
                    <p className="text-2xl font-black text-white">₹{portfolioValue.toLocaleString()}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Day Change</p>
                    <p className="text-2xl font-black text-emerald-500">+8.4%</p>
                  </div>
                </div>
              </Card>
              <Card title="Market Heatmap" className="flex flex-col justify-center items-center text-center p-10">
                <PieChart className="w-16 h-16 text-brand-600 mb-6 opacity-20" />
                <p className="text-xs font-black uppercase text-slate-400">Asset Allocation Insights Coming Soon</p>
              </Card>
            </div>

            <Card title="Active Holdings" padding="p-0 overflow-hidden">
              <Table headers={['Stock', 'Qty', 'Avg Cost', 'Current Price', 'Profit/Loss']}>
                {portfolio.map((item, i) => {
                  const stock = stocks.find(s => s.symbol === item.symbol);
                  const currentPrice = stock?.currentPrice || item.averagePrice;
                  const pnl = (currentPrice - item.averagePrice) * item.quantity;
                  const pnlPercent = ((currentPrice - item.averagePrice) / item.averagePrice) * 100;
                  return (
                    <TableRow key={i}>
                      <TableCell className="font-black dark:text-white uppercase">{item.symbol}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.averagePrice.toLocaleString()}</TableCell>
                      <TableCell>₹{currentPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`font-black ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString()} ({pnlPercent.toFixed(2)}%)
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </Card>
          </motion.div>
        )}

        {activeTab === 'market' && (
          <motion.div key="market" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-6">
              <Card padding="p-6">
                <div className="relative mb-6">
                  <input 
                    type="text" placeholder="Filter Symbols..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar">
                  {stocks.map(stock => (
                    <button 
                      key={stock.symbol} onClick={() => setSelectedStock(stock)}
                      className={`w-full p-5 rounded-2xl border transition-all flex justify-between items-center group ${selectedStock?.symbol === stock.symbol ? 'bg-brand-600 border-brand-600 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-brand-500/20'}`}
                    >
                      <div className="text-left">
                        <h4 className={`text-sm font-black uppercase ${selectedStock?.symbol === stock.symbol ? 'text-white' : 'dark:text-white group-hover:text-brand-600'}`}>{stock.symbol}</h4>
                        <p className={`text-[8px] font-bold uppercase mt-1 ${selectedStock?.symbol === stock.symbol ? 'text-white/60' : 'text-slate-400'}`}>{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black">₹{stock.currentPrice.toLocaleString()}</p>
                        <p className={`text-[9px] font-bold ${stock.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'} ${selectedStock?.symbol === stock.symbol ? 'text-white' : ''}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-10">
              {selectedStock ? (
                <>
                  <Card padding="p-2" className="bg-[#020617] border-slate-800 min-h-[450px]">
                    <MarketDataChart symbol={selectedStock.symbol} data={selectedStock.history || []} colors={{ backgroundColor: '#020617', lineColor: '#22c55e' }} />
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card title="Stock Profile" padding="p-8">
                      <div className="space-y-4">
                        <div className="flex justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</span>
                          <span className="text-xs font-black uppercase">{selectedStock.sector}</span>
                        </div>
                        <div className="flex justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volatilty</span>
                          <span className="text-xs font-black text-amber-500 uppercase">High Performance</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="bg-slate-900 border-transparent shadow-2xl p-10">
                      <form onSubmit={handleTrade} className="space-y-8">
                        <div className="flex bg-white/5 p-1.5 rounded-2xl">
                          <button type="button" onClick={() => setTradeForm({...tradeForm, type: 'BUY'})} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tradeForm.type === 'BUY' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}>Buy</button>
                          <button type="button" onClick={() => setTradeForm({...tradeForm, type: 'SELL'})} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tradeForm.type === 'SELL' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400'}`}>Sell</button>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-500 uppercase text-center">Unit Quantity</p>
                          <input type="number" min="1" value={tradeForm.quantity} onChange={e => setTradeForm({...tradeForm, quantity: parseInt(e.target.value) || 1})} className="w-full bg-transparent text-center text-4xl font-black text-white outline-none" />
                        </div>
                        <Button variant="brand" fullWidth size="lg" className="py-6 rounded-2xl shadow-xl shadow-brand-600/20">Execute Order</Button>
                      </form>
                    </Card>
                  </div>
                </>
              ) : (
                <Card className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12">
                  <Activity className="w-12 h-12 text-brand-600 mb-6 animate-pulse" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Terminal Awaiting Input</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-4">Select an asset to initialize neural market tracking.</p>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradingDashboard;
tePresence>
      </div>
    </div>
  );
};

export default TradingDashboard;
