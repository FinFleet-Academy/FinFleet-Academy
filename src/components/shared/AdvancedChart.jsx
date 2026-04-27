import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';

/**
 * 💹 PRO-TRADING ENGINE v5 — AI Signal Integration
 * Lightweight Charts with crosshair, AI markers, smooth zoom/pan.
 */
const AdvancedChart = React.memo(({ 
  data = [],
  symbol = 'RELIANCE',
  indicators = { ma: true, volume: true, ema: false, rsi: false },
  type = 'candlestick',
  fullView = false,
  timeframe = '1m',
  aiSignals = [], // [{ time, type: 'BUY'|'SELL', confidence, reason }]
  onCrosshairMove, // optional callback
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const maSeriesRef = useRef(null);
  const emaSeriesRef = useRef(null);
  const markerTimeoutRef = useRef(null);

  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hoveredSignal, setHoveredSignal] = useState(null);

  // Deduplicate + sort data
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) {
      const now = Math.floor(Date.now() / 1000);
      let price = 2500;
      return Array.from({ length: 120 }).map((_, i) => {
        const time = now - (120 - i) * 60;
        const change = (Math.random() - 0.48) * 12;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 8;
        const low  = Math.min(open, close) - Math.random() * 8;
        price = close;
        return { time, open, high, low, close, volume: Math.random() * 8000 + 2000 };
      });
    }
    const seen = new Set();
    return data
      .filter(d => { if (seen.has(d.time)) return false; seen.add(d.time); return true; })
      .sort((a, b) => a.time - b.time);
  }, [data]);

  // Build AI markers
  const chartMarkers = useMemo(() => {
    if (!aiSignals || aiSignals.length === 0) return [];
    return aiSignals.map(sig => ({
      time: sig.time,
      position: sig.type === 'BUY' ? 'belowBar' : 'aboveBar',
      color: sig.type === 'BUY' ? '#22c55e' : '#ef4444',
      shape: sig.type === 'BUY' ? 'arrowUp' : 'arrowDown',
      text: `${sig.type} ${sig.confidence ? `${sig.confidence}%` : ''}`,
      size: 2,
    }));
  }, [aiSignals]);

  // Chart initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#020617' },
        textColor: '#64748b',
        fontSize: 11,
        fontFamily: "'Inter', system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)', style: 1 },
        horzLines: { color: 'rgba(255,255,255,0.04)', style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: 'rgba(99,102,241,0.5)',
          style: 1,
          labelBackgroundColor: '#1e293b',
        },
        horzLine: {
          width: 1,
          color: 'rgba(99,102,241,0.5)',
          style: 1,
          labelBackgroundColor: '#1e293b',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.05)',
        textColor: '#64748b',
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.05)',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true },
    });

    chartRef.current = chart;

    // Main series
    if (type === 'candlestick') {
      candleSeriesRef.current = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
        borderVisible: true,
      });
    } else {
      candleSeriesRef.current = chart.addAreaSeries({
        lineColor: '#6366f1',
        topColor: 'rgba(99,102,241,0.25)',
        bottomColor: 'rgba(99,102,241,0.01)',
        lineWidth: 2,
        crosshairMarkerRadius: 6,
        crosshairMarkerBorderColor: '#6366f1',
        crosshairMarkerBackgroundColor: '#0f172a',
      });
    }

    // Volume
    if (indicators.volume !== false) {
      volumeSeriesRef.current = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: 'vol',
      });
      volumeSeriesRef.current.priceScale().applyOptions({
        scaleMargins: { top: 0.82, bottom: 0 },
      });
    }

    // 20-MA
    if (indicators.ma !== false) {
      maSeriesRef.current = chart.addLineSeries({
        color: '#f59e0b',
        lineWidth: 1,
        lineStyle: 2,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });
    }

    // EMA
    if (indicators.ema) {
      emaSeriesRef.current = chart.addLineSeries({
        color: '#a78bfa',
        lineWidth: 1,
        lineStyle: 0,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });
    }

    // Crosshair listener
    chart.subscribeCrosshairMove(param => {
      if (!param.time || !param.point) {
        setHoveredCandle(null);
        return;
      }
      const candle = param.seriesData.get(candleSeriesRef.current);
      if (candle) {
        setHoveredCandle(candle);
        setTooltipPos({ x: param.point.x, y: param.point.y });
        onCrosshairMove?.(candle, param.point);
      }
    });

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    });
    ro.observe(chartContainerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      maSeriesRef.current = null;
      emaSeriesRef.current = null;
    };
  }, [type, indicators.ma, indicators.ema, indicators.volume]);

  // Data updates (don't recreate chart)
  useEffect(() => {
    if (!candleSeriesRef.current || formattedData.length === 0) return;

    const lineData = formattedData.map(d => ({ time: d.time, value: d.close }));
    if (type === 'candlestick') {
      candleSeriesRef.current.setData(formattedData);
    } else {
      candleSeriesRef.current.setData(lineData);
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(formattedData.map(d => ({
        time: d.time,
        value: d.volume || 100,
        color: d.close >= d.open ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
      })));
    }

    if (maSeriesRef.current && formattedData.length > 20) {
      const maData = formattedData.map((d, i) => {
        if (i < 20) return null;
        const avg = formattedData.slice(i - 20, i).reduce((s, x) => s + x.close, 0) / 20;
        return { time: d.time, value: avg };
      }).filter(Boolean);
      maSeriesRef.current.setData(maData);
    }

    if (emaSeriesRef.current && formattedData.length > 12) {
      const k = 2 / 13;
      let ema = formattedData[0].close;
      const emaData = formattedData.map(d => {
        ema = d.close * k + ema * (1 - k);
        return { time: d.time, value: ema };
      });
      emaSeriesRef.current.setData(emaData);
    }

    chartRef.current?.timeScale().fitContent();
  }, [formattedData, type]);

  // AI signal markers
  useEffect(() => {
    if (!candleSeriesRef.current) return;
    candleSeriesRef.current.setMarkers(chartMarkers);
  }, [chartMarkers]);

  // Live price simulation (for when no real WS data)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!candleSeriesRef.current || formattedData.length === 0) return;
      const last = formattedData[formattedData.length - 1];
      const newClose = last.close + (Math.random() - 0.49) * 4;
      const updated = {
        ...last,
        close: newClose,
        high: Math.max(last.high, newClose),
        low: Math.min(last.low, newClose),
      };
      if (type === 'candlestick') {
        candleSeriesRef.current.update(updated);
      } else {
        candleSeriesRef.current.update({ time: last.time, value: newClose });
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [formattedData, type]);

  const fmt = v => v != null ? v.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '--';
  const isUp = hoveredCandle && hoveredCandle.close >= hoveredCandle.open;

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] relative overflow-hidden">
      {/* CHART AREA */}
      <div className="flex-grow relative overflow-hidden" ref={chartContainerRef} />

      {/* CROSSHAIR OHLC TOOLTIP */}
      {hoveredCandle && tooltipPos.x > 0 && (
        <div
          className="absolute pointer-events-none z-30 px-3 py-2 rounded-xl bg-slate-900/95 border border-slate-700/60 backdrop-blur-sm shadow-2xl"
          style={{
            left: Math.min(tooltipPos.x + 16, (chartContainerRef.current?.clientWidth || 600) - 200),
            top: Math.max(tooltipPos.y - 80, 8),
          }}
        >
          <div className="flex items-center space-x-2 mb-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{symbol}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {[
              ['O', hoveredCandle.open],
              ['H', hoveredCandle.high],
              ['L', hoveredCandle.low],
              ['C', hoveredCandle.close],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center space-x-1.5">
                <span className="text-[8px] font-black text-slate-500 uppercase">{label}</span>
                <span className={`text-[10px] font-black ${label === 'C' ? (isUp ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
                  {fmt(val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

AdvancedChart.displayName = 'AdvancedChart';
export default AdvancedChart;
