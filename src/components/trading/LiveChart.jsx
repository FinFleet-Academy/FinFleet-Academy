import React, { useEffect, useRef, memo } from 'react';
import { createChart } from 'lightweight-charts';
import { useMarketData } from '../../hooks/useMarketData';

const LiveChart = memo(({ symbol = 'BTCUSDT', height = 400 }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const { lastCandle } = useMarketData(symbol);

  useEffect(() => {
    // 1. Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      height,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.05)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.05)' },
      },
      crosshair: {
        mode: 1, // Magnet mode
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.1)',
        timeVisible: true,
      },
    });

    // 2. Add Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // 3. Handle Resize
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  // 4. Update with Real-Time Data (Incremental)
  useEffect(() => {
    if (lastCandle && seriesRef.current) {
      requestAnimationFrame(() => {
        seriesRef.current.update(lastCandle);
      });
    }
  }, [lastCandle]);

  return (
    <div className="relative w-full">
      <div ref={chartContainerRef} className="w-full" />
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
