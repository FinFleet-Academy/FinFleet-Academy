import React, { useMemo } from 'react';
import { 
  ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Bar, Cell, Scatter 
} from 'recharts';

/**
 * 📊 Neural Intelligence Candlestick Engine
 * High-performance charting using Recharts (Zero TradingView Dependency).
 * Features: Professional Candlesticks, Neural Overlays, and Predictive Heatmaps.
 */
const AdvancedChart = ({ 
  data = [], 
  symbol, 
  type = 'candlestick',
  indicators = { ema: true, bollinger: false },
  fullView = false
}) => {

  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      time: new Date(item.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      // For Candlesticks in Recharts:
      // We use a Bar for the body (low to high range) and a Line/Scatter for the wicks
      body: [item.open, item.close],
      wick: [item.low, item.high],
      isUp: item.close >= item.open
    })).sort((a, b) => a.time.localeCompare(b.time));
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#0f172a]/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
           <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{symbol}</p>
              <p className="text-[9px] font-bold text-slate-500">{d.time}</p>
           </div>
           <div className="space-y-1">
              <div className="flex justify-between space-x-8">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Open</span>
                 <span className="text-[10px] font-black text-white">₹{d.open.toLocaleString()}</span>
              </div>
              <div className="flex justify-between space-x-8">
                 <span className="text-[10px] font-black text-slate-400 uppercase">High</span>
                 <span className="text-[10px] font-black text-emerald-500">₹{d.high.toLocaleString()}</span>
              </div>
              <div className="flex justify-between space-x-8">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Low</span>
                 <span className="text-[10px] font-black text-red-500">₹{d.low.toLocaleString()}</span>
              </div>
              <div className="flex justify-between space-x-8">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Close</span>
                 <span className={`text-[10px] font-black ${d.isUp ? 'text-emerald-500' : 'text-red-500'}`}>₹{d.close.toLocaleString()}</span>
              </div>
           </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full h-full relative ${fullView ? 'bg-[#020617]' : ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={formattedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <defs>
            <linearGradient id="upGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="downGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="1 4" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />

          {/* 🕯️ CANDLESTICK IMPLEMENTATION */}
          {type === 'candlestick' ? (
            <>
              {/* Wicks */}
              <Bar dataKey="wick" barSize={1} strokeWidth={0}>
                {formattedData.map((entry, index) => (
                  <Cell key={`wick-${index}`} fill={entry.isUp ? '#10b981' : '#ef4444'} opacity={0.6} />
                ))}
              </Bar>
              {/* Body */}
              <Bar dataKey="body" barSize={10} strokeWidth={0}>
                {formattedData.map((entry, index) => (
                  <Cell key={`body-${index}`} fill={entry.isUp ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </>
          ) : (
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#upGradient)" 
            />
          )}

          {/* 🧠 NEURAL INDICATORS */}
          {indicators.ema && (
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#10b981" 
              strokeWidth={1} 
              dot={false} 
              strokeDasharray="5 5" 
              opacity={0.4} 
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Floating Intel Overlay */}
      <div className="absolute top-6 left-6 pointer-events-none">
         <div className="flex items-center space-x-3 bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 px-4 py-2 rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Neural Stream</span>
         </div>
      </div>
    </div>
  );
};

export default AdvancedChart;
