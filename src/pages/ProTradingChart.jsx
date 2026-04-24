import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, Search, Filter, Globe, Eye, 
  ArrowLeft, Maximize2, Settings, Download, Share2,
  ChevronDown, Layers, Crosshair, Zap, ShieldCheck,
  Plus, Minus, Clock, Briefcase, History, TrendingDown,
  Sparkles, Brain, HelpCircle, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdvancedChart from '../components/shared/AdvancedChart';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { analyzeMarket, getTradeFeedback, explainChart } from '../services/aiEngine';

const ProTradingChart = () => {
  // 1. STATE
  const [activeStock, setActiveStock] = useState({ symbol: 'RELIANCE', name: 'Reliance Industries', price: 2542.45 });
  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('candlestick'); // candlestick, area
  const [showIndicators, setShowIndicators] = useState(false);
  const [isStockSelectorOpen, setIsStockSelectorOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [watchlist, setWatchlist] = useState([
    { symbol: 'RELIANCE', currentPrice: 2542.45, changePercent: 2.4 },
    { symbol: 'TCS', currentPrice: 3412.10, changePercent: -1.2 },
    { symbol: 'INFY', currentPrice: 1567.80, changePercent: 0.8 },
    { symbol: 'AAPL', currentPrice: 189.45, changePercent: 1.5 },
    { symbol: 'TSLA', currentPrice: 172.60, changePercent: -3.2 },
  ]);

  // Fetch all stocks from API
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const { data } = await axios.get('/api/stocks');
        if (data && data.length > 0) {
          setWatchlist(data);
          // Set initial active stock to the first one if current not in list
          if (!data.find(s => s.symbol === activeStock.symbol)) {
            setActiveStock({ 
              symbol: data[0].symbol, 
              name: data[0].name, 
              price: data[0].currentPrice 
            });
          }
        }
      } catch (err) {
        console.error("Error fetching stocks:", err);
      }
    };
    fetchStocks();
  }, []);
  const [orders, setOrders] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    showGrid: true,
    showLabels: true,
    theme: 'dark',
    chartStyle: 'solid'
  });

  // 2. HANDLERS
  useEffect(() => {
    if (chartData.length > 20) {
      const analysis = analyzeMarket(chartData);
      setMarketAnalysis(analysis);
    }
  }, [chartData]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const updateConfig = (key, value) => {
    setChartConfig(prev => ({ ...prev, [key]: value }));
  };
  const generateInitialData = useCallback((basePrice, tf) => {
    let data = [];
    let bars = 200;
    let step = 3600; // 1H default
    
    if (tf === '1m') step = 60;
    if (tf === '5m') step = 300;
    if (tf === '15m') step = 900;
    if (tf === '1D') step = 86400;

    let time = Math.floor(Date.now() / 1000) - bars * step;
    let lastClose = basePrice;

    for (let i = 0; i < bars; i++) {
      const volatility = tf === '1D' ? 50 : 10;
      const open = lastClose;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);
      
      data.push({ time, open, high, low, close });
      time += step;
      lastClose = close;
    }
    return data;
  }, []);

  useEffect(() => {
    setChartData(generateInitialData(activeStock.price, timeframe));
    setMarkers([]); // Clear markers on stock change
  }, [activeStock.symbol, timeframe, generateInitialData]);

  // 3. SIMULATE LIVE UPDATES
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setChartData(prev => {
        if (prev.length === 0) return prev;
        const lastBar = { ...prev[prev.length - 1] };
        const change = (Math.random() - 0.5) * 5;
        lastBar.close += change;
        if (lastBar.close > lastBar.high) lastBar.high = lastBar.close;
        if (lastBar.close < lastBar.low) lastBar.low = lastBar.close;
        return [...prev.slice(0, -1), lastBar];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  // 4. TRADE ACTIONS
  const handleTrade = (type) => {
    const currentPrice = chartData[chartData.length - 1].close;
    const currentTime = chartData[chartData.length - 1].time;
    
    const newOrder = {
      id: Date.now(),
      symbol: activeStock.symbol,
      type,
      price: currentPrice,
      time: new Date().toLocaleTimeString(),
      status: 'EXECUTED'
    };

    const newMarker = {
      time: currentTime,
      price: currentPrice,
      position: type === 'BUY' ? 'belowBar' : 'aboveBar',
      color: type === 'BUY' ? '#10b981' : '#ef4444',
      text: type === 'BUY' ? 'BUY @ ' + Math.round(currentPrice) : 'SELL @ ' + Math.round(currentPrice),
    };

    setOrders([newOrder, ...orders]);
    setMarkers([...markers, newMarker]);
    
    // AI FEEDBACK
    const feedback = getTradeFeedback(type, marketAnalysis);
    toast(feedback, {
      icon: type === 'BUY' ? '🟢' : '🔴',
      style: { background: '#0F172A', color: '#fff', border: '1px solid #1E293B', fontSize: '12px', fontWeight: 'bold' }
    });
  };

  const selectStock = (stock) => {
    setActiveStock(stock);
    setIsStockSelectorOpen(false);
  };

  return (
    <div className="h-screen w-full bg-[#020617] text-slate-300 flex flex-col overflow-hidden font-sans">
      
      {/* 1. TOP CONTROL BAR */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-6">
          <Link to="/trading" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-800" />
          
          {/* Stock Selector */}
          <div className="relative">
            <div 
              onClick={() => setIsStockSelectorOpen(!isStockSelectorOpen)}
              className="flex items-center space-x-3 group cursor-pointer hover:bg-slate-800 p-2 rounded-xl transition-all"
            >
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center font-black text-white text-xs">FF</div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-white tracking-tighter uppercase">{activeStock.symbol}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">NSE India</p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isStockSelectorOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[290]" 
                    onClick={() => setIsStockSelectorOpen(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed top-16 left-[120px] w-80 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[300] overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Search 500+ stocks..." 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-1">
                        {watchlist.map(s => (
                          <div 
                            key={s.symbol}
                            onClick={() => selectStock({ symbol: s.symbol, name: s.symbol, price: s.currentPrice })}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${activeStock.symbol === s.symbol ? 'bg-brand-500/10 border border-brand-500/20' : 'hover:bg-white/5'}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">{s.symbol[0]}</div>
                              <div>
                                <p className="text-[11px] font-black text-white">{s.symbol}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">NSE India</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-black text-white">₹{s.currentPrice?.toLocaleString()}</p>
                              <p className={`text-[9px] font-bold ${s.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {s.changePercent >= 0 ? '+' : ''}{s.changePercent}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
            {['1m', '5m', '15m', '1H', '1D'].map(tf => (
              <button 
                key={tf} 
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${timeframe === tf ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
             <button 
                onClick={() => setChartType('candlestick')}
                className={`p-1.5 rounded-md transition-all ${chartType === 'candlestick' ? 'bg-slate-800 text-brand-500' : 'text-slate-500'}`}
             >
                <Activity className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded-md transition-all ${chartType === 'area' ? 'bg-slate-800 text-brand-500' : 'text-slate-500'}`}
             >
                <TrendingUp className="w-4 h-4" />
             </button>
          </div>

          <button 
            onClick={() => setShowIndicators(!showIndicators)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${showIndicators ? 'bg-brand-500/20 text-brand-500' : 'hover:bg-slate-800'}`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase">Indicators</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-2 mr-4 group"
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">
              {isLive ? 'Live Connection' : 'Paused'}
            </span>
          </button>
          
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 mr-4">
            <button onClick={() => handleTrade('BUY')} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-95">Buy</button>
            <button onClick={() => handleTrade('SELL')} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-red-500/20 ml-1 active:scale-95">Sell</button>
          </div>

          <button 
            onClick={() => setIsExplainOpen(true)}
            className="flex items-center space-x-2 px-4 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/30 rounded-lg transition-all group"
          >
            <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Explain Chart</span>
          </button>

          <div className="h-6 w-px bg-slate-800" />

          {/* Beginner Mode Toggle */}
          <div className="flex items-center space-x-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Sparkles className={`w-4 h-4 ${isBeginnerMode ? 'text-amber-400' : 'text-slate-600'}`} />
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Beginner Mode</span>
            <button 
              onClick={() => setIsBeginnerMode(!isBeginnerMode)}
              className={`w-8 h-4 rounded-full transition-colors relative ${isBeginnerMode ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isBeginnerMode ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-2 mr-4 group"
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">
              {isLive ? 'Live Connection' : 'Paused'}
            </span>
          </button>
          
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 mr-4">
            <button onClick={() => handleTrade('BUY')} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-95">Buy</button>
            <button onClick={() => handleTrade('SELL')} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-red-500/20 ml-1 active:scale-95">Sell</button>
          </div>

          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-lg transition-colors ${isSettingsOpen ? 'bg-brand-500 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
          >
            <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* 6. AI EXPLAIN MODAL */}
        <AnimatePresence>
          {isExplainOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500] flex items-center justify-center p-6"
              onClick={() => setIsExplainOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-[2.5rem] p-10 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-brand-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">AI Market Explanation</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analyzing {activeStock.symbol} chart patterns</p>
                  </div>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-8 mb-8">
                  <p className="text-slate-300 leading-relaxed italic text-lg">
                    "{explainChart(activeStock.symbol, marketAnalysis)}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Trend Strength</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-grow h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${marketAnalysis?.trendStrength * 10}%` }} />
                      </div>
                      <span className="text-lg font-black text-white">{marketAnalysis?.trendStrength}/10</span>
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Market Risk</p>
                    <p className={`text-lg font-black ${marketAnalysis?.riskLevel === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>{marketAnalysis?.riskLevel}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsExplainOpen(false)}
                  className="w-full py-4 bg-white text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Got it, thanks!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 7. AI INSIGHTS SIDEBAR (BEGINNER MODE) */}
        <AnimatePresence>
          {isBeginnerMode && marketAnalysis && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-6 top-20 w-72 bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 z-[40]"
            >
               <div className="flex items-center space-x-3 mb-6">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-widest">AI Market Insights</h3>
               </div>
               
               <div className="space-y-4">
                  {marketAnalysis.insights.map((insight, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors"
                    >
                       <div className="mt-1 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_#fbbf24]" />
                       <p className="text-[10px] font-bold text-slate-300 leading-normal">{insight}</p>
                    </motion.div>
                  ))}
               </div>

               <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Trend Strength</span>
                    <span className="text-[10px] font-black text-white">{marketAnalysis.trendStrength}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${marketAnalysis.trendStrength * 10}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-brand-500" 
                    />
                  </div>
               </div>

               <div className="mt-6 flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-3 h-3 text-amber-500" />
                    <span className="text-[8px] font-black text-amber-500 uppercase">Pattern Detected</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-amber-500" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-grow flex overflow-hidden">
        
        {/* 2. MAIN CHART AREA */}
        <div className="flex-grow relative flex flex-col">
          <div className="flex-grow relative bg-[#020617]">
             <AdvancedChart 
                symbol={activeStock.symbol} 
                data={chartData} 
                timeframe={timeframe} 
                markers={[
                  ...markers,
                  ...(isBeginnerMode && marketAnalysis ? [
                    { time: chartData[chartData.length - 10].time, price: marketAnalysis.resistance, position: 'aboveBar', color: '#6366f1', text: 'Resistance Level' },
                    { time: chartData[chartData.length - 10].time, price: marketAnalysis.support, position: 'belowBar', color: '#6366f1', text: 'Support Level' }
                  ] : [])
                ]}
                type={chartType}
                showIndicators={showIndicators}
                config={chartConfig}
             />

             {/* Disclaimer Overlay */}
             <div className="absolute bottom-6 left-6 z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Simulated Trading Environment • No Real Money Involved
                </p>
             </div>
          </div>

          {/* 3. BOTTOM PANEL (ORDERS) */}
          <div className="h-48 border-t border-slate-800 bg-slate-900/30 flex flex-col">
            <div className="flex items-center space-x-8 px-6 py-3 border-b border-slate-800/50">
               <button className="text-[10px] font-black uppercase text-brand-500 border-b-2 border-brand-500 pb-2 -mb-3.5">Active Orders</button>
               <button className="text-[10px] font-black uppercase text-slate-500 hover:text-slate-300">Positions</button>
               <button className="text-[10px] font-black uppercase text-slate-500 hover:text-slate-300">Trade History</button>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/30">
                        <th className="px-6 py-3">Time</th>
                        <th className="px-6 py-3">Symbol</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {orders.map(order => (
                       <tr key={order.id} className="border-b border-slate-800/20 text-[10px] font-bold hover:bg-white/5 transition-colors">
                          <td className="px-6 py-3 text-slate-400">{order.time}</td>
                          <td className="px-6 py-3 text-white">{order.symbol}</td>
                          <td className="px-6 py-3">
                             <span className={`px-2 py-1 rounded-md ${order.type === 'BUY' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                {order.type}
                             </span>
                          </td>
                          <td className="px-6 py-3 text-white">₹{order.price.toFixed(2)}</td>
                          <td className="px-6 py-3">
                             <span className="flex items-center space-x-1.5 text-emerald-400">
                                <ShieldCheck className="w-3 h-3" />
                                <span>{order.status}</span>
                             </span>
                          </td>
                       </tr>
                     ))}
                     {orders.length === 0 && (
                       <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-600 italic">No active orders in this session.</td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        {/* 4. RIGHT PANEL (WATCHLIST) */}
        <div className="w-72 border-l border-slate-800 bg-slate-900/50 flex flex-col">
           <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest">Watchlist</h3>
              <Plus className="w-4 h-4 cursor-pointer hover:text-white" />
           </div>
           <div className="flex-grow overflow-y-auto custom-scrollbar">
              {watchlist.map(item => (
                <div 
                  key={item.symbol} 
                  onClick={() => selectStock({ symbol: item.symbol, name: item.symbol, price: item.currentPrice })}
                  className={`p-4 border-b border-slate-800/30 cursor-pointer hover:bg-white/5 transition-all group ${activeStock.symbol === item.symbol ? 'bg-brand-500/5 border-l-2 border-l-brand-500' : ''}`}
                >
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-white group-hover:text-brand-400 transition-colors">{item.symbol}</span>
                      <span className="text-xs font-black text-white">₹{item.currentPrice?.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">NSE</span>
                      <span className={`text-[10px] font-bold ${item.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                         {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
                      </span>
                   </div>
                </div>
              ))}
           </div>
           <div className="p-4 bg-slate-950 border-t border-slate-800">
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Sentiment</p>
                 <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-black text-white">68% Bullish</span>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* 5. SETTINGS MODAL - FIXED OVERLAY */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-20 right-6 w-80 bg-slate-900/98 backdrop-blur-3xl border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[200] p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Chart Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">✕</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400">Show Grid Lines</span>
                <button 
                  onClick={() => updateConfig('showGrid', !chartConfig.showGrid)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${chartConfig.showGrid ? 'bg-brand-500' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${chartConfig.showGrid ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400">Show Price Labels</span>
                <button 
                  onClick={() => updateConfig('showLabels', !chartConfig.showLabels)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${chartConfig.showLabels ? 'bg-brand-500' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${chartConfig.showLabels ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-4">Chart Style</p>
                 <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => updateConfig('chartStyle', 'solid')}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${chartConfig.chartStyle === 'solid' ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      Solid
                    </button>
                    <button 
                      onClick={() => updateConfig('chartStyle', 'gradient')}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${chartConfig.chartStyle === 'gradient' ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      Gradient
                    </button>
                 </div>
              </div>

              <button 
                onClick={() => { setMarkers([]); toast.success('Chart markers cleared'); }}
                className="w-full py-3 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase text-slate-500 hover:text-white hover:border-slate-600 transition-all"
              >
                 Reset All Markers
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProTradingChart;
