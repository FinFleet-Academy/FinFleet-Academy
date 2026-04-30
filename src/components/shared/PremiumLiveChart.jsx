import React, { useState, useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Activity, Zap, Maximize2, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BrandLogo from '../ui/BrandLogo';

const PremiumLiveChart = ({ symbol = 'AAPL' }) => {
  const chartContainerRef = useRef(null);
  
  // Data States
  const [currentPrice, setCurrentPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [chartData, setChartData] = useState([]);
  
  // UI States
  const [timeframe, setTimeframe] = useState('5m');
  const [chartType, setChartType] = useState('candles');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Network States
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [status, setStatus] = useState('FETCHING'); // FETCHING, LIVE, DELAYED
  const [retryCount, setRetryCount] = useState(0);

  // Refs for chart instances
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const lineSeriesRef = useRef(null);
  const lastFetchTimeRef = useRef(0);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#0b0f17' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#1f2937',
      },
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
        secondsVisible: false,
      },
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    candleSeriesRef.current = candlestickSeries;

    const lineSeries = chart.addLineSeries({
      color: '#22c55e',
      lineWidth: 2,
    });
    lineSeriesRef.current = lineSeries;

    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '', 
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    // Apply visibility based on initial state
    if (chartType === 'candles') {
      lineSeries.applyOptions({ visible: false });
    } else {
      candlestickSeries.applyOptions({ visible: false });
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []); // Run once on mount

  // Fetch Data Function
  const fetchMarketData = async () => {
    try {
      if (chartData.length === 0) setIsLoading(true);
      
      const response = await axios.get(`/api/market-data?symbol=${symbol}`);
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        if (data && data.length > 0) {
          setChartData(data);
          
          // Generate volume data mapped to the main data
          const volumeData = data.map(d => {
            const isUp = d.close >= d.open;
            return {
              time: d.time,
              value: d.volume,
              color: isUp ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'
            };
          });

          // Update chart series
          if (candleSeriesRef.current) candleSeriesRef.current.setData(data);
          if (lineSeriesRef.current) {
            const lineData = data.map(d => ({ time: d.time, value: d.close }));
            lineSeriesRef.current.setData(lineData);
          }
          if (volumeSeriesRef.current) volumeSeriesRef.current.setData(volumeData);

          // Update UI info
          const latest = data[data.length - 1];
          const previous = data.length > 1 ? data[data.length - 2] : latest;
          
          setCurrentPrice(latest.close);
          
          // Calculate simple % change from previous close (or could use day open if available)
          const pctChange = ((latest.close - previous.close) / previous.close) * 100;
          setChange(pctChange);

          setIsError(false);
          setStatus('LIVE');
          setRetryCount(0);
          lastFetchTimeRef.current = Date.now();
        }
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      setIsError(true);
      setStatus('DELAYED');
      
      // Exponential backoff up to max 5 minutes (300000ms)
      setRetryCount(prev => Math.min(prev + 1, 10));
    } finally {
      setIsLoading(false);
    }
  };

  // Setup Polling
  useEffect(() => {
    // Initial fetch
    fetchMarketData();

    let timeoutId;
    
    const scheduleNextFetch = () => {
      // Calculate delay: 30s normally, or exponential backoff if error (30s * 2^retryCount)
      const baseDelay = 30000;
      const delay = isError ? Math.min(baseDelay * Math.pow(2, retryCount), 300000) : baseDelay;
      
      timeoutId = setTimeout(() => {
        if (document.visibilityState === 'visible') {
          fetchMarketData().then(scheduleNextFetch);
        } else {
          // If not visible, check again soon without fetching
          scheduleNextFetch();
        }
      }, delay);
    };

    scheduleNextFetch();

    // Re-fetch immediately when tab becomes visible if it's been more than 30s
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current;
        if (timeSinceLastFetch > 30000 && !isLoading) {
          clearTimeout(timeoutId);
          fetchMarketData().then(scheduleNextFetch);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [symbol, isError, retryCount]);

  // Update chart type visibility
  useEffect(() => {
    if (candleSeriesRef.current && lineSeriesRef.current) {
      if (chartType === 'candles') {
        candleSeriesRef.current.applyOptions({ visible: true });
        lineSeriesRef.current.applyOptions({ visible: false });
      } else {
        candleSeriesRef.current.applyOptions({ visible: false });
        lineSeriesRef.current.applyOptions({ visible: true });
      }
    }
  }, [chartType]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      chartContainerRef.current.parentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden bg-[#F9FAFB] dark:bg-[#080C10]">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500 rounded-full blur-[160px] opacity-[0.08] -mr-64 -mt-64 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
            <div className="inline-flex items-center space-x-3 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-brand-600 animate-pulse" />
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Next-Gen Trading Platform</span>
              <span className="h-4 w-px bg-brand-500/30" />
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">BETA</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">Learn. Trade. <br /><span className="text-gradient">Master the Markets.</span></h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">Experience the adrenaline of real-world markets without the risk. Practice with professional-grade tools and live-simulated charts.</p>
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link to="/signup" className="w-full sm:w-auto btn-brand py-5 px-12 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/30 group">Start Learning<ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" /></Link>
              <Link to="/trading" className="w-full sm:w-auto btn-secondary py-5 px-12 text-[11px] font-black uppercase tracking-[0.2em] dark:text-white border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center">Explore Simulator</Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative group w-full">
            <div className="relative bg-[#0b0f17] rounded-2xl border border-[#1f2937] shadow-2xl overflow-hidden w-full flex flex-col min-h-[500px]">
               
               {/* Top Info Bar */}
               <div className="p-6 flex items-center justify-between border-b border-[#1f2937]">
                  <div className="flex items-center space-x-4">
                     <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{symbol}</h3>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Market Data</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-black text-white tracking-tighter">
                       {currentPrice > 0 ? `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '---'}
                     </p>
                     {currentPrice > 0 && (
                       <p className={`text-[10px] font-black uppercase tracking-widest ${change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                         {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
                       </p>
                     )}
                  </div>
               </div>

               {/* Toolbar */}
               <div className="bg-[#0b0f17] border-b border-[#1f2937] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-[#111827] rounded-lg p-1 border border-[#1f2937]">
                      {['1m', '5m', '15m', '1H'].map(tf => (
                        <button 
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-3 py-1.5 rounded text-[10px] font-black uppercase transition-all ${timeframe === tf ? 'bg-[#374151] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                    <div className="h-4 w-px bg-[#1f2937] mx-1" />
                    <div className="flex items-center bg-[#111827] rounded-lg p-1 border border-[#1f2937]">
                      <button 
                        onClick={() => setChartType('candles')}
                        className={`p-1.5 rounded transition-all ${chartType === 'candles' ? 'bg-[#374151] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        title="Candles"
                      >
                        <Activity className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setChartType('line')}
                        className={`p-1.5 rounded transition-all ${chartType === 'line' ? 'bg-[#374151] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        title="Line"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors text-gray-400 hover:text-white border border-[#1f2937]"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
               </div>

               {/* Chart Container */}
               <div className="w-full flex-grow min-h-[350px] relative">
                  <div className="absolute inset-0 z-0" ref={chartContainerRef} />
                  
                  {/* Loading Overlay */}
                  {isLoading && chartData.length === 0 && (
                    <div className="absolute inset-0 z-10 bg-[#0b0f17]/80 backdrop-blur-sm flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fetching live market data...</p>
                    </div>
                  )}

                  {/* Error / Offline Overlay if no data available */}
                  {isError && chartData.length === 0 && !isLoading && (
                    <div className="absolute inset-0 z-10 bg-[#0b0f17]/90 flex flex-col items-center justify-center text-center p-6">
                      <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                      <p className="text-sm font-black text-white uppercase tracking-wider mb-2">Market Data Unavailable</p>
                      <p className="text-xs text-gray-500 font-medium">Live data unavailable, retrying in {Math.pow(2, retryCount - 1) * 30}s...</p>
                    </div>
                  )}
               </div>
               
               {/* Bottom Info Bar */}
               <div className="p-4 bg-[#0b0f17] border-t border-[#1f2937] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {status === 'LIVE' ? (
                      <>
                        <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest">LIVE</span>
                      </>
                    ) : status === 'DELAYED' ? (
                      <>
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">DELAYED</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">FETCHING</span>
                      </>
                    )}
                  </div>
                  
                  {chartData.length > 0 && (
                    <div className="flex items-center space-x-4">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">O: {chartData[chartData.length-1].open.toFixed(2)}</span>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">H: {chartData[chartData.length-1].high.toFixed(2)}</span>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">L: {chartData[chartData.length-1].low.toFixed(2)}</span>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">C: {chartData[chartData.length-1].close.toFixed(2)}</span>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumLiveChart;
