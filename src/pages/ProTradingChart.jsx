import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, Search, Filter, Globe, Eye, 
  ArrowLeft, Maximize2, Settings, Download, Share2,
  ChevronDown, Layers, Crosshair, Zap, ShieldCheck,
  Plus, Minus, Clock, Briefcase, History, TrendingDown,
  Sparkles, Brain, HelpCircle, ChevronRight, AlertTriangle,
  Waves, Target, Gauge
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdvancedChart from '../components/shared/AdvancedChart';
import Badge from '../components/ui/Badge';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import msgpack from 'msgpack-lite';

const ProTradingChart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // 1. INTELLIGENT STATE
  const [activeStock, setActiveStock] = useState({ symbol: 'RELIANCE', name: 'Reliance Industries', price: 2542.45 });
  const [stocks, setStocks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [activeLayers, setActiveLayers] = useState({ liquidity: true, predictive: true, psychology: true });
  const [indicators, setIndicators] = useState({ ema: true, rsi: false, bollinger: false });
  const [showSettings, setShowSettings] = useState(false);
  const [uiMode, setUiMode] = useState('BALANCED'); // BALANCED, CRITICAL, SIMPLIFIED
  const [isLive, setIsLive] = useState(true);
  const [fullView, setFullView] = useState(false);
  const [teachingMode, setTeachingMode] = useState(true);
  const [aiInsights, setAiInsights] = useState([
    "Accumulation phase detected near support. High probability of breakout.",
    "RSI Divergence forming on 5m timeframe. Watch for reversal nodes.",
    "Institutional order flow shifting to buy-side. Liquidity depth expanding."
  ]);
  
  const wsRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!user && !localStorage.getItem('token')) {
      navigate('/login');
    }
    fetchStocks();
  }, [user]);

  const fetchStocks = async () => {
    try {
      const res = await axios.get('/api/stocks', { params: { limit: 50 } });
      setStocks(res.data.stocks);
    } catch (err) {
      console.error("Watchlist sync failed", err);
    }
  };

  // Fetch initial history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/stocks/${activeStock.symbol}`);
        if (res.data && res.data.history) {
          const formatted = res.data.history
            .filter(h => h.timestamp && !isNaN(new Date(h.timestamp).getTime()))
            .map(h => ({
              time: Math.floor(new Date(h.timestamp).getTime() / 1000),
              open: h.price,
              high: h.price,
              low: h.price,
              close: h.price
            }))
            .sort((a, b) => a.time - b.time);
          
          // Filter duplicates for chart performance
          const uniqueData = [];
          const seenTimes = new Set();
          formatted.forEach(p => {
            if (!seenTimes.has(p.time)) {
              uniqueData.push(p);
              seenTimes.add(p.time);
            }
          });
          
          setChartData(uniqueData);
        }
      } catch (err) {
        console.error("History fetch failed", err);
      }
    };
    fetchHistory();
  }, [activeStock.symbol]);

  // 2. BINARY STREAM CONNECTOR (The Engine Backbone)
  useEffect(() => {
    if (!isLive || !user) return;

    const connectStream = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace(/^https?:\/\//, '') 
        : 'localhost:5005';
      
      const ws = new WebSocket(`${protocol}//${host}/ws/intelligence`);
      ws.binaryType = 'arraybuffer';
      
      ws.onopen = () => {
        console.log('[IntelStream] Connected. Requesting Binary Feed...');
        ws.send(msgpack.encode({ type: 'SUBSCRIBE', symbol: activeStock.symbol }));
      };

      ws.onmessage = (event) => {
        const payload = msgpack.decode(new Uint8Array(event.data));
        
        // ⚡ Update Intelligence Layer
        setIntelligence(payload.intelligence);
        
        // 📊 Adaptive UI Logic: Shift UI mode based on volatility/exhaustion
        if (payload.intelligence.exhaustion > 0.8) setUiMode('CRITICAL');
        else if (payload.intelligence.psychology.includes('PANIC')) setUiMode('CRITICAL');
        else setUiMode('BALANCED');

        // 📈 Update Price Data
        setChartData(prev => {
          const lastBar = prev[prev.length - 1];
          let tickTime = Math.floor(payload.ts / 1000);
          
          // Safety: charting requires strictly ascending or equal time
          if (lastBar && tickTime < lastBar.time) {
            tickTime = lastBar.time;
          }
          
          if (lastBar && lastBar.time === tickTime) {
            // Update current bar
            const updated = { ...lastBar };
            updated.close = payload.price;
            if (payload.price > updated.high) updated.high = payload.price;
            if (payload.price < updated.low) updated.low = payload.price;
            return [...prev.slice(0, -1), updated];
          } else {
            // Create new bar
            const newBar = {
              time: tickTime,
              open: payload.price,
              high: payload.price,
              low: payload.price,
              close: payload.price
            };
            const next = [...prev, newBar];
            return next.slice(-500); // 500 candle memory window
          }
        });
      };

      ws.onclose = () => {
        console.log('[IntelStream] Disconnected. Reconnecting...');
        setTimeout(connectStream, 2000);
      };

      wsRef.current = ws;
    };

    connectStream();
    return () => wsRef.current?.close();
  }, [activeStock.symbol, isLive]);

  // 3. HANDLERS
  const [showExecution, setShowExecution] = useState(false);
  const [strategyConfig, setStrategyConfig] = useState({ stopLoss: 2, takeProfit: 5, lotSize: 1 });

  const executeStrategy = async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Deploying Smart Contract & Executing...',
        success: 'Strategy Deployed. SL/TP Nodes Active.',
        error: 'Execution Failed.',
      }
    );
    setShowExecution(false);
  };

  const toggleLayer = (layer) => setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));

  return (
    <div className={`h-screen w-full bg-[#020617] text-slate-300 flex flex-col font-sans transition-all duration-700 ${uiMode === 'CRITICAL' ? 'ring-inset ring-2 ring-red-500/20' : ''}`}>
      
      {/* Execution Overlay */}
      <AnimatePresence>
        {showExecution && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-[450px] bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-3xl"
            >
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Pro Execution Hub</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategy: Neural Scalp v4</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stop Loss (%)</label>
                    <input 
                      type="number" value={strategyConfig.stopLoss} 
                      onChange={(e) => setStrategyConfig({...strategyConfig, stopLoss: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-black focus:outline-none focus:border-brand-500 transition-colors" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Take Profit (%)</label>
                    <input 
                      type="number" value={strategyConfig.takeProfit} 
                      onChange={(e) => setStrategyConfig({...strategyConfig, takeProfit: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-black focus:outline-none focus:border-brand-500 transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Allocation (Lots)</label>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => setStrategyConfig({...strategyConfig, lotSize: Math.max(1, strategyConfig.lotSize-1)})} className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700">-</button>
                    <div className="flex-grow text-center text-2xl font-black text-white">{strategyConfig.lotSize}</div>
                    <button onClick={() => setStrategyConfig({...strategyConfig, lotSize: strategyConfig.lotSize+1})} className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700">+</button>
                  </div>
                </div>

                <div className="pt-6 flex space-x-4">
                  <button onClick={() => setShowExecution(false)} className="flex-grow py-4 bg-slate-800 text-slate-400 text-xs font-black uppercase rounded-2xl">Cancel</button>
                  <button onClick={executeStrategy} className="flex-grow py-4 bg-brand-600 text-white text-xs font-black uppercase rounded-2xl shadow-xl shadow-brand-500/20">Confirm Order</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. ADAPTIVE CONTROL BAR */}
      <div className={`h-16 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-md relative z-[100] transition-colors duration-500 ${uiMode === 'CRITICAL' ? 'bg-red-950/20' : 'bg-slate-900/50'}`}>
        <div className="flex items-center space-x-6">
          <Link to="/trading" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs ${uiMode === 'CRITICAL' ? 'bg-red-600 animate-pulse' : 'bg-brand-600'}`}>FF</div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-white uppercase">{activeStock.symbol}</span>
                <Badge variant={uiMode === 'CRITICAL' ? 'red' : 'indigo'} size="sm">INTEL ACTIVE</Badge>
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Intelligence Node 04</p>
            </div>
          </div>

          {/* Layer Toggles */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
             {[
               { id: 'liquidity', icon: Waves, label: 'Liquidity' },
               { id: 'predictive', icon: Target, label: 'Predictive' },
               { id: 'psychology', icon: Gauge, label: 'Psychology' }
             ].map(layer => (
               <button 
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${activeLayers[layer.id] ? 'bg-slate-800 text-brand-500' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 <layer.icon className="w-3.5 h-3.5" />
                 <span className="text-[9px] font-black uppercase tracking-widest">{layer.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* Real-time Intel Banner */}
        <AnimatePresence>
          {uiMode === 'CRITICAL' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-red-600 px-6 py-1.5 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
              <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Market Volatility High - Reversal Likely</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setFullView(!fullView)}
            className={`p-2 rounded-lg transition-colors ${fullView ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-brand-500 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
             <span className="text-[9px] font-black uppercase text-emerald-500">Binary Feed: 12ms</span>
          </div>
          <button 
            onClick={() => setShowExecution(true)}
            className="px-6 py-2 bg-brand-500 text-white text-[10px] font-black uppercase rounded-lg shadow-xl shadow-brand-500/20 active:scale-95 transition-transform"
          >
            Execute Strategy
          </button>
        </div>
      </div>

        {/* Settings Overlay */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="absolute top-20 right-6 w-80 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-8 z-[1000] shadow-3xl"
            >
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Terminal Config</h3>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Technical Indicators</p>
                  {Object.keys(indicators).map(key => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-300">{key}</span>
                      <button 
                        onClick={() => setIndicators(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`w-8 h-4 rounded-full relative transition-colors ${indicators[key] ? 'bg-brand-500' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${indicators[key] ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">UI Mode</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['BALANCED', 'CRITICAL', 'ZEN'].map(mode => (
                      <button 
                        key={mode} onClick={() => setUiMode(mode)}
                        className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${uiMode === mode ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Teaching Features</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-300">Candle Patterns</span>
                    <button 
                      onClick={() => setTeachingMode(!teachingMode)}
                      className={`w-8 h-4 rounded-full relative transition-colors ${teachingMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${teachingMode ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      <div className="flex-grow flex overflow-hidden">
        
        {/* 2. INTELLIGENCE HUD */}
        {!fullView && (
          <div className="w-80 border-r border-slate-800 bg-slate-900/30 p-6 flex flex-col space-y-8 overflow-y-auto custom-scrollbar">
           
           {/* Psychology Meter */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Psychology</h3>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${intelligence?.psychology.includes('FOMO') ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                  {intelligence?.psychology.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                 <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: '30%' }} />
                 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '70%' }} />
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                Institutional accumulation detected. Retail sentiment is currently lagging behind price action.
              </p>
           </div>

           {/* AI Signals */}
           <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pro Intelligence</h3>
              <div className="space-y-3">
                  {aiInsights.map((insight, i) => (
                    <motion.div 
                      key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-brand-500/50 transition-all cursor-help"
                    >
                       <div className="flex items-center space-x-3 mb-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Node {i+1}</span>
                       </div>
                       <p className="text-[10px] font-bold text-white leading-relaxed">{insight}</p>
                    </motion.div>
                  ))}
               </div>
           </div>

           {/* Watchlist Mini */}
           <div className="flex-grow space-y-4 pt-4 border-t border-slate-800 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Watchlist</h3>
                <Search className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-brand-500 transition-colors" />
              </div>
              
              <div className="flex-grow space-y-1 overflow-y-auto custom-scrollbar pr-2">
                 {stocks.length > 0 ? stocks.map(stock => (
                   <button 
                    key={stock.symbol} 
                    onClick={() => {
                      setActiveStock(stock);
                      setChartData([]); // Reset for new symbol
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${activeStock.symbol === stock.symbol ? 'bg-brand-600/10 border border-brand-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                   >
                      <div className="text-left">
                        <span className={`text-[11px] font-black uppercase transition-colors ${activeStock.symbol === stock.symbol ? 'text-brand-500' : 'text-white group-hover:text-brand-500'}`}>{stock.symbol}</span>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{stock.sector}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-white">₹{stock.currentPrice?.toLocaleString()}</p>
                        <p className={`text-[9px] font-bold ${stock.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                        </p>
                      </div>
                   </button>
                 )) : (
                   <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                      <Activity className="w-8 h-8 text-slate-700 animate-pulse" />
                      <p className="text-[9px] font-black text-slate-600 uppercase">Synchronizing Nodes...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* 3. MAIN CHART CORE */}
        <div className="flex-grow relative bg-[#020617]">
          <AdvancedChart 
            symbol={activeStock.symbol} 
            data={chartData} 
            intelligence={activeLayers.predictive ? intelligence : null}
            indicators={indicators}
            type="candlestick"
            fullView={fullView}
          />
          
          {/* Predictive Warning Overlays */}
          <AnimatePresence>
            {uiMode === 'CRITICAL' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-red-500/5 to-transparent border-t-2 border-red-500/20"
              />
            )}
          </AnimatePresence>

          {/* Quick HUD Overlay */}
          <div className="absolute bottom-10 right-10 flex flex-col space-y-4 z-20">
             <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-6 rounded-[2rem] shadow-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Signal</p>
                    <h4 className="text-xl font-black text-white uppercase">Strong Buy</h4>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                   <div className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-400">CONFIDENCE: 92%</div>
                   <div className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-400">RISK: LOW</div>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* 4. PERFORMANCE STATUS BAR */}
      <div className="h-10 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-6">
         <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
               <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
               <span className="text-[9px] font-black uppercase text-slate-500">Institutional Encryption Active</span>
            </div>
            <div className="flex items-center space-x-2">
               <Zap className="w-3.5 h-3.5 text-amber-500" />
               <span className="text-[9px] font-black uppercase text-slate-500">Tick Fusion: 0.1ms</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-[9px] font-black uppercase text-slate-500">Engine: WebGL GPU Accelerated</span>
            <div className="h-3 w-px bg-slate-800" />
            <span className="text-[9px] font-black uppercase text-slate-500">v2.4.0-pro-intel</span>
         </div>
      </div>

    </div>
  );
};

export default ProTradingChart;
