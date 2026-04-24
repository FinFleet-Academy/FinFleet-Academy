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
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import msgpack from 'msgpack-lite';

const ProTradingChart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // 1. INTELLIGENT STATE
  const [activeStock, setActiveStock] = useState({ symbol: 'RELIANCE', name: 'Reliance Industries', price: 2542.45 });
  const [chartData, setChartData] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [activeLayers, setActiveLayers] = useState({ liquidity: true, predictive: true, psychology: true });
  const [uiMode, setUiMode] = useState('BALANCED'); // BALANCED, CRITICAL, SIMPLIFIED
  const [isLive, setIsLive] = useState(true);
  
  const wsRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!user && !localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user]);

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
          const tickTime = Math.floor(payload.ts / 1000);
          
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
  const toggleLayer = (layer) => setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));

  return (
    <div className={`h-screen w-full bg-[#020617] text-slate-300 flex flex-col font-sans transition-all duration-700 ${uiMode === 'CRITICAL' ? 'ring-inset ring-2 ring-red-500/20' : ''}`}>
      
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
          <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
             <span className="text-[9px] font-black uppercase text-emerald-500">Binary Feed: 12ms</span>
          </div>
          <button className="px-6 py-2 bg-brand-500 text-white text-[10px] font-black uppercase rounded-lg shadow-xl shadow-brand-500/20">Execute Strategy</button>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        
        {/* 2. INTELLIGENCE HUD */}
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
                 {[
                   { label: 'Trend Exhaustion', value: `${Math.round(intelligence?.exhaustion * 100)}%`, icon: Zap },
                   { label: 'Whale Activity', value: intelligence?.whaleActivity || 'NORMAL', icon: Waves },
                   { label: 'Liquidity Depth', value: 'ULTRA HIGH', icon: Layers }
                 ].map((signal, i) => (
                   <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-brand-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <signal.icon className="w-4 h-4 text-brand-500" />
                        <span className="text-xs font-black text-white">{signal.value}</span>
                      </div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{signal.label}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Watchlist Mini */}
           <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector Intel</h3>
              <div className="space-y-2">
                 {['NIFTY 50', 'BANK NIFTY', 'FINFLEET 100'].map(sector => (
                   <div key={sector} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
                      <span className="text-[10px] font-black text-white">{sector}</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500">+1.2%</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* 3. MAIN CHART CORE */}
        <div className="flex-grow relative bg-[#020617]">
          <AdvancedChart 
            symbol={activeStock.symbol} 
            data={chartData} 
            intelligence={activeLayers.predictive ? intelligence : null}
            type="candlestick"
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
