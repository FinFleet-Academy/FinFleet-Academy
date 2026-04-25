import React, { useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';

/**
 * 💹 Zerodha-Grade Intraday Chart Engine
 * Powered by Lightweight Charts for ultra-high performance and professional aesthetics.
 */
const AdvancedChart = ({ 
  data = [], 
  symbol, 
  type = 'candlestick', // candlestick | line
  indicators = { ma: true, volume: true },
  fullView = false,
  timeframe = '1m'
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const maSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0b0f17' },
        textColor: '#94a3b8',
        fontSize: 11,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: '#1f2937', style: 1 },
        horzLines: { color: '#1f2937', style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { width: 1, color: '#475569', labelBackgroundColor: '#1e293b' },
        horzLine: { width: 1, color: '#475569', labelBackgroundColor: '#1e293b' },
      },
      rightPriceScale: {
        borderColor: '#1f2937',
        autoScale: true,
      },
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
        secondsVisible: timeframe === '1m',
      },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
    });

    chartRef.current = chart;

    // 2. Add Series based on type
    if (type === 'candlestick') {
      seriesRef.current = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });
    } else {
      seriesRef.current = chart.addLineSeries({
        color: '#6366f1',
        lineWidth: 2,
        crosshairMarkerVisible: true,
      });
    }

    // 3. Add Volume Histogram
    if (indicators.volume) {
      volumeSeriesRef.current = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: '', // overlay
      });
      volumeSeriesRef.current.priceScale().applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
    }

    // 4. Add Moving Average
    if (indicators.ma) {
      maSeriesRef.current = chart.addLineSeries({
        color: '#f59e0b',
        lineWidth: 1,
        lineStyle: 2,
        lastValueVisible: false,
        priceLineVisible: false,
      });
    }

    // Handle Resize
    const handleResize = () => {
      chart.applyOptions({ 
        width: chartContainerRef.current.clientWidth, 
        height: chartContainerRef.current.clientHeight 
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [type, indicators.volume, indicators.ma, timeframe]);

  // 5. Data Synchronization
  useEffect(() => {
    if (!seriesRef.current || data.length === 0) return;

    // Format data for Lightweight Charts
    const formattedData = data.map(d => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      value: d.close, // for line series
    }));

    seriesRef.current.setData(formattedData);

    // Update Volume
    if (volumeSeriesRef.current) {
      const volumeData = data.map(d => ({
        time: d.time,
        value: d.volume || (Math.random() * 1000 + 500),
        color: d.close >= d.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
      }));
      volumeSeriesRef.current.setData(volumeData);
    }

    // Update Moving Average (20-period simple)
    if (maSeriesRef.current && data.length > 20) {
      const maData = data.map((d, i) => {
        if (i < 20) return null;
        const slice = data.slice(i - 20, i);
        const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / 20;
        return { time: d.time, value: avg };
      }).filter(d => d !== null);
      maSeriesRef.current.setData(maData);
    }

  }, [data]);

  return (
    <div className={`w-full h-full relative ${fullView ? 'bg-[#0b0f17]' : ''}`}>
      <div ref={chartContainerRef} className="w-full h-full" />
      
      {/* HUD Overlays */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-lg pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">{symbol}</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase">{timeframe}</span>
      </div>

      {/* Legend / OHLC on hover can be added here using chart.subscribeCrosshairMove */}
    </div>
  );
};

export default AdvancedChart;
