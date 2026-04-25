import React, { useMemo, memo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useMarketData } from '../../hooks/useMarketData';

/**
 * 📊 Neural Live Feed (Non-TradingView)
 * High-performance real-time visualization powered by Recharts.
 */
const LiveChart = memo(({ symbol = 'BTCUSDT', height = 400 }) => {
  const { lastCandle, history = [] } = useMarketData(symbol);

  // Transform history for Recharts
  const chartData = useMemo(() => {
    return history.map(h => ({
      time: new Date(h.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: h.close
    }));
  }, [history]);

  return (
    <div className="relative w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="liveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#liveGradient)" 
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>

      {!lastCandle && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm rounded-3xl">
          <div className="flex flex-col items-center space-y-4">
             <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connecting to {symbol} Stream...</span>
          </div>
        </div>
      )}
    </div>
  );
});

LiveChart.displayName = 'LiveChart';

export default LiveChart;
