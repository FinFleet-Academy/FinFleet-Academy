import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, ComposedChart, Bar, Cell 
} from 'recharts';

/**
 * 📊 Neural Intelligence Chart Core
 * High-performance chart engine powered by Recharts (Non-TradingView Implementation).
 * Optimized for predictive analytics and market trends.
 */
const AdvancedChart = ({ 
  data = [], 
  symbol, 
  intelligence = {},
  markers = [],
  indicators = {},
  type = 'area', // area, bar, candlestick (mocked via bar)
}) => {

  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      time: new Date(item.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawTime: item.time
    })).sort((a, b) => a.rawTime - b.rawTime);
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{d.time}</p>
           <div className="flex items-center space-x-3">
              <div className={`w-1 h-8 rounded-full ${d.close > d.open ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <div>
                 <p className="text-xl font-black text-white">₹{d.close.toLocaleString()}</p>
                 <p className="text-[9px] font-bold text-slate-400">O: {d.open} | H: {d.high} | L: {d.low}</p>
              </div>
           </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="close" radius={[4, 4, 0, 0]}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.close > entry.open ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#chartGradient)" 
              animationDuration={1500}
            />
            {indicators.ema && (
              <Area type="monotone" dataKey="close" stroke="#10b981" fill="none" strokeWidth={1} strokeDasharray="5 5" opacity={0.5} />
            )}
          </AreaChart>
        )}
      </ResponsiveContainer>

      {/* Neural Overlay (Visual Polish) */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
         <div className="flex items-center space-x-1.5 bg-slate-900/50 border border-white/5 px-3 py-1 rounded-full backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Neural Real-time</span>
         </div>
      </div>
    </div>
  );
};

export default AdvancedChart;
