import React, { useMemo, useRef } from 'react';
import { 
  ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Bar, Cell, ReferenceLine 
} from 'recharts';

/**
 * 📊 Neural Intelligence Candlestick Engine v2
 * High-performance, zero-shake charting for professional trading education.
 */
const AdvancedChart = ({ 
  data = [], 
  symbol, 
  type = 'candlestick',
  indicators = { ema: true, bollinger: false },
  fullView = false
}) => {

  const formattedData = useMemo(() => {
    // Limit to last 100 points for performance and stability
    const windowSize = fullView ? 150 : 80;
    return data.slice(-windowSize).map(item => ({
      ...item,
      timeLabel: new Date(item.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      body: [item.open, item.close],
      wick: [item.low, item.high],
      isUp: item.close >= item.open
    }));
  }, [data, fullView]);

  const lastPrice = useMemo(() => {
    if (formattedData.length === 0) return 0;
    return formattedData[formattedData.length - 1].close;
  }, [formattedData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#0f172a]/95 border border-white/10 rounded-2xl p-4 shadow-3xl backdrop-blur-2xl ring-1 ring-white/10">
           <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <div className="flex items-center space-x-2">
                 <div className={`w-2 h-2 rounded-full ${d.isUp ? 'bg-emerald-500' : 'bg-red-500'}`} />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">{symbol}</p>
              </div>
              <p className="text-[9px] font-bold text-slate-500">{d.timeLabel}</p>
           </div>
           <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex justify-between">
                 <span className="text-[9px] font-black text-slate-500 uppercase">O</span>
                 <span className="text-[10px] font-black text-white">₹{d.open.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-[9px] font-black text-slate-500 uppercase">H</span>
                 <span className="text-[10px] font-black text-emerald-500">₹{d.high.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-[9px] font-black text-slate-500 uppercase">L</span>
                 <span className="text-[10px] font-black text-red-500">₹{d.low.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-[9px] font-black text-slate-500 uppercase">C</span>
                 <span className={`text-[10px] font-black ${d.isUp ? 'text-emerald-500' : 'text-red-500'}`}>₹{d.close.toLocaleString()}</span>
              </div>
           </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full h-full relative transition-all duration-500 ${fullView ? 'p-0 bg-[#020617]' : 'p-4'}`}>
      
      {/* 1. CHART CONTAINER */}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={formattedData} 
          margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="1 10" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} isAnimationActive={false} />

          {/* Current Price Line */}
          <ReferenceLine y={lastPrice} stroke="#334155" strokeDasharray="3 3" />

          {type === 'candlestick' ? (
            <>
              {/* Wicks: Vertical Lines */}
              <Bar dataKey="wick" barSize={1} isAnimationActive={false}>
                {formattedData.map((entry, index) => (
                  <Cell key={`wick-${index}`} fill={entry.isUp ? '#10b981' : '#ef4444'} opacity={0.4} />
                ))}
              </Bar>
              {/* Body: Thicker Rectangles */}
              <Bar dataKey="body" barSize={fullView ? 14 : 8} isAnimationActive={false}>
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
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#areaGradient)" 
              isAnimationActive={false}
            />
          )}

          {/* Indicators */}
          {indicators.ema && (
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#10b981" 
              strokeWidth={1} 
              dot={false} 
              strokeDasharray="5 5" 
              opacity={0.3} 
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* 2. OVERLAYS */}
      {/* Price HUD */}
      <div className="absolute top-8 right-8 flex items-center space-x-4 pointer-events-none">
         <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Valuation</span>
            <div className="flex items-center space-x-3">
               <div className={`w-2 h-2 rounded-full animate-pulse ${formattedData[formattedData.length-1]?.isUp ? 'bg-emerald-500' : 'bg-red-500'}`} />
               <span className="text-3xl font-black text-white tracking-tighter">
                  ₹{(lastPrice || 0).toLocaleString()}
               </span>
            </div>
         </div>
      </div>

      {/* Neural Node Status */}
      <div className="absolute top-8 left-8 flex items-center space-x-3 bg-slate-900/50 border border-white/5 px-4 py-2 rounded-2xl backdrop-blur-xl pointer-events-none">
         <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
         <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Engine Active</span>
      </div>

      {/* Bottom Labels */}
      <div className="absolute bottom-4 left-8 right-8 flex justify-between items-center pointer-events-none opacity-40">
         <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">FinFleet Analytics Node</span>
         <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Time Resolution: 1s</span>
      </div>
    </div>
  );
};

export default AdvancedChart;
