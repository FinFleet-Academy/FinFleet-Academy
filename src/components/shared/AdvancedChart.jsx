import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { Maximize2, Activity, TrendingUp } from 'lucide-react';

/**
 * 💹 PRO-TRADING ENGINE v4
 * Professional Intraday Terminal using Lightweight Charts.
 */
const AdvancedChart = ({ 
  initialData = [], 
  symbol = 'RELIANCE',
  height = '100%' 
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const maSeriesRef = useRef(null);
  
  const [chartType, setChartType] = useState('candlestick');
  const [timeframe, setTimeframe] = useState('1m');
  const [data, setData] = useState(initialData);

  // 1. Data Formatting Engine
  const formattedData = useMemo(() => {
    if (data.length === 0) {
      // Generate realistic simulation if no data provided
      const now = Math.floor(Date.now() / 1000);
      return Array.from({ length: 100 }).map((_, i) => {
        const time = now - (100 - i) * 60;
        const open = 11000 + Math.random() * 200;
        return {
          time,
          open,
          high: open + Math.random() * 50,
          low: open - Math.random() * 50,
          close: open + (Math.random() - 0.5) * 40,
          volume: Math.random() * 1000 + 500
        };
      });
    }
    return data.map(d => ({
      time: typeof d.time === 'string' ? Math.floor(new Date(d.time).getTime() / 1000) : d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      value: d.close, // for line series
    })).sort((a, b) => a.time - b.time);
  }, [data]);

  // 2. Core Chart Lifecycle
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0b0f17' },
        textColor: '#94a3b8',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { width: 1, color: '#475569', labelBackgroundColor: '#1e293b' },
        horzLine: { width: 1, color: '#475569', labelBackgroundColor: '#1e293b' },
      },
      rightPriceScale: { borderColor: '#1f2937' },
      timeScale: { borderColor: '#1f2937', timeVisible: true, secondsVisible: false },
      handleScale: { mouseWheel: true, pinch: true },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
    });

    chartRef.current = chart;

    // Series Initialization
    if (chartType === 'candlestick') {
      seriesRef.current = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });
    } else {
      seriesRef.current = chart.addLineSeries({
        color: '#22c55e',
        lineWidth: 2,
      });
    }

    // Volume Series
    volumeSeriesRef.current = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // overlay
    });
    volumeSeriesRef.current.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // 20-Period MA
    maSeriesRef.current = chart.addLineSeries({
      color: '#f59e0b',
      lineWidth: 1,
      lineStyle: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    // Set Data
    seriesRef.current.setData(formattedData);
    volumeSeriesRef.current.setData(formattedData.map(d => ({
      time: d.time,
      value: d.volume || 100,
      color: d.close >= d.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    })));

    // Calculate MA
    if (formattedData.length > 20) {
      const maData = formattedData.map((d, i) => {
        if (i < 20) return null;
        const avg = formattedData.slice(i - 20, i).reduce((a, b) => a + b.close, 0) / 20;
        return { time: d.time, value: avg };
      }).filter(Boolean);
      maSeriesRef.current.setData(maData);
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth, 
          height: chartContainerRef.current.clientHeight 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartType, formattedData]);

  // 3. Live Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!seriesRef.current || formattedData.length === 0) return;
      
      const lastBar = formattedData[formattedData.length - 1];
      const newPrice = lastBar.close + (Math.random() - 0.5) * 10;
      
      const updatedBar = {
        ...lastBar,
        close: newPrice,
        high: Math.max(lastBar.high, newPrice),
        low: Math.min(lastBar.low, newPrice),
      };

      seriesRef.current.update(updatedBar);
    }, 1000);

    return () => clearInterval(interval);
  }, [formattedData]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      chartContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f17] overflow-hidden">
      {/* 🛠️ CONTROLS */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f2937]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#1f2937] rounded-md p-0.5">
             <button 
              onClick={() => setChartType('candlestick')}
              className={`p-1.5 rounded transition-all ${chartType === 'candlestick' ? 'bg-[#22c55e] text-white' : 'text-slate-400 hover:text-white'}`}
             >
               <Activity size={14} />
             </button>
             <button 
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded transition-all ${chartType === 'line' ? 'bg-[#22c55e] text-white' : 'text-slate-400 hover:text-white'}`}
             >
               <TrendingUp size={14} />
             </button>
          </div>
          <div className="flex space-x-1">
            {['1m', '5m', '15m'].map(tf => (
              <button 
                key={tf} onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-[10px] font-bold rounded uppercase transition-all ${timeframe === tf ? 'text-white border border-[#22c55e]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <button onClick={toggleFullscreen} className="p-2 text-slate-400 hover:text-white transition-colors">
          <Maximize2 size={16} />
        </button>
      </div>

      {/* 📈 CHART AREA */}
      <div className="flex-grow relative overflow-hidden" ref={chartContainerRef} />
    </div>
  );
};

export default AdvancedChart;
