import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

/**
 * 📊 FinFleet Pro: Advanced Intelligence Chart
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
  const chartContainerRef = useRef();
  const overlayRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Cleanup any existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // 2. Initialize Lightweight Chart
    const width = chartContainerRef.current.clientWidth || 600;
    const height = chartContainerRef.current.clientHeight || 400;

    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#020617' },
        textColor: '#94a3b8',
        fontSize: 10,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      rightPriceScale: { borderColor: '#1e293b' },
      timeScale: { borderColor: '#1e293b', timeVisible: true },
      crosshair: {
        mode: 0,
        vertLine: { color: '#6366f1', width: 1, style: 3 },
        horzLine: { color: '#6366f1', width: 1, style: 3 },
      },
    });

    // 3. Add Main Series (with safety check)
    if (chart && typeof chart.addCandlestickSeries === 'function') {
      seriesRef.current = type === 'candlestick' 
        ? chart.addCandlestickSeries({ upColor: '#10b981', downColor: '#ef4444', borderVisible: false })
        : chart.addAreaSeries({ lineColor: '#6366f1', topColor: 'rgba(99, 102, 241, 0.3)', bottomColor: 'rgba(99, 102, 241, 0.05)' });
      
      chartRef.current = chart;
    }

    const handleResize = () => {
      if (!chartContainerRef.current || !chartRef.current) return;
      const newWidth = chartContainerRef.current.clientWidth;
      const newHeight = chartContainerRef.current.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        chartRef.current.applyOptions({ width: newWidth, height: newHeight });
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [type]);

  // 3. Data Sync & Indicators
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);

      // Add EMA if enabled
      if (indicators.ema && chartRef.current) {
        if (!chartRef.current.emaSeries) {
          chartRef.current.emaSeries = chartRef.current.addLineSeries({
            color: '#f59e0b',
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
          });
        }
        
        // Simple EMA calculation
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
        chartRef.current.emaSeries.setData(emaData);
      } else if (chartRef.current?.emaSeries) {
        chartRef.current.removeSeries(chartRef.current.emaSeries);
        chartRef.current.emaSeries = null;
      }
    }
  }, [data, indicators]);

  // 4. Intelligence Overlay: Liquidity Zones & Predictive Heatmaps
  useEffect(() => {
    if (!overlayRef.current || !intelligence || !seriesRef.current) return;
    const ctx = overlayRef.current.getContext('2d');
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // 🎨 Render Liquidity Zones
    if (intelligence.liquidityZones) {
      intelligence.liquidityZones.forEach(zone => {
        if (!seriesRef.current.priceToCoordinate) return;
        const y = seriesRef.current.priceToCoordinate(zone.price);
        if (y === null) return;
        
        ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(zone.strength / 50000, 0.15)})`;
        ctx.fillRect(0, y - 10, dimensions.width, 20);
        
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      });
    }

    // 🔥 Render Probabilistic Future Heatmaps
    if (intelligence.probabilities) {
      intelligence.probabilities.forEach(prob => {
        if (!seriesRef.current.priceToCoordinate) return;
        const y = seriesRef.current.priceToCoordinate(prob.level);
        if (y === null) return;

        const gradient = ctx.createLinearGradient(dimensions.width - 200, y, dimensions.width, y);
        const color = prob.type.includes('UPPER') ? '16, 185, 129' : '239, 68, 68';
        gradient.addColorStop(0, `rgba(${color}, 0)`);
        gradient.addColorStop(1, `rgba(${color}, ${prob.prob * 0.2})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(dimensions.width - 200, y - 30, 200, 60);
      });
    }
  }, [intelligence, dimensions, data]);

  // 5. Update Markers
  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setMarkers(markers);
    }
  }, [markers]);

  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden">
      <div ref={chartContainerRef} className="w-full h-full" />
      <canvas 
        ref={overlayRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none z-10"
      />
    </div>
  );
};

export default AdvancedChart;
