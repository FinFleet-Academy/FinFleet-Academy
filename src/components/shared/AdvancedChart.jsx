import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

/**
 * 📊 Advanced Trading Chart Core
 * High-performance chart engine with WebGL/Canvas overlays for predictive intelligence.
 */
const AdvancedChart = ({ 
  data = [], 
  symbol, 
  intelligence = {},
  markers = [],
  indicators = {},
  type = 'candlestick',
  config = { showGrid: true, showLabels: true },
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const emaSeriesRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. Initial Chart Creation
  useEffect(() => {
    if (!chartContainerRef.current) return;
    console.log(`[AdvancedChart] Initializing for ${symbol}...`);

    const width = chartContainerRef.current.clientWidth || 800;
    const height = chartContainerRef.current.clientHeight || 500;

    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#020617' },
        textColor: '#94a3b8',
        fontSize: 10,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: config.showGrid ? '#1e293b' : 'transparent' },
        horzLines: { color: config.showGrid ? '#1e293b' : 'transparent' },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        visible: config.showLabels,
      },
      timeScale: {
        borderColor: '#1e293b',
        visible: config.showLabels,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: { labelBackgroundColor: '#6366f1' },
        horzLine: { labelBackgroundColor: '#6366f1' },
      },
    });

    if (type === 'candlestick') {
      seriesRef.current = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
    } else {
      seriesRef.current = chart.addLineSeries({
        color: '#6366f1',
        lineWidth: 2,
      });
    }

    chartRef.current = chart;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const { clientWidth, clientHeight } = chartContainerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          chartRef.current.applyOptions({ width: clientWidth, height: clientHeight });
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
        emaSeriesRef.current = null;
      }
    };
  }, [type, symbol]); // Added symbol to ensure it recreates on stock change if needed

  // 2. Data Sync
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      console.log(`[AdvancedChart] Syncing ${data.length} data points for ${symbol}`);
      seriesRef.current.setData(data);
      
      // Update EMA
      if (indicators.ema && chartRef.current) {
        if (!emaSeriesRef.current) {
          emaSeriesRef.current = chartRef.current.addLineSeries({
            color: '#f59e0b',
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
          });
        }
        
        const emaData = [];
        const period = 20;
        let prevEma = data[0].close;
        const k = 2 / (period + 1);

        data.forEach((bar, i) => {
          if (i === 0) {
            emaData.push({ time: bar.time, value: bar.close });
          } else {
            const currentEma = bar.close * k + prevEma * (1 - k);
            emaData.push({ time: bar.time, value: currentEma });
            prevEma = currentEma;
          }
        });
        emaSeriesRef.current.setData(emaData);
      } else if (emaSeriesRef.current && chartRef.current) {
        chartRef.current.removeSeries(emaSeriesRef.current);
        emaSeriesRef.current = null;
      }
    }
  }, [data, indicators.ema, symbol]);

  // 3. Intelligence Markers
  useEffect(() => {
    if (seriesRef.current && intelligence) {
      const markersList = [];
      
      if (intelligence.whaleActivity === 'HIGH') {
        markersList.push({
          time: data[data.length - 1]?.time,
          position: 'aboveBar',
          color: '#f59e0b',
          shape: 'arrowDown',
          text: 'WHALE ACTIVITY',
        });
      }

      seriesRef.current.setMarkers(markersList);
    }
  }, [intelligence, data, symbol]);

  return (
    <div ref={chartContainerRef} className={`w-full h-full relative ${config.showGrid ? 'bg-slate-950/20' : ''}`}>
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-50">
          <div className="text-center space-y-4">
             <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Calibrating Engine...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedChart;
