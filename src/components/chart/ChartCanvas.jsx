import React, { useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';

/**
 * 📊 ChartCanvas Engine v1
 * Custom-built HTML5 Canvas charting engine for high-performance trading.
 */
const ChartCanvas = ({ 
  data = [], 
  symbol = 'ASSET', 
  timeframe = '1m', 
  chartType = 'candlestick', 
  showIndicators = true,
  aiLevels = null,
  config = { showGrid: true, showLabels: true }
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const mainSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  // Formatting data for lightweight-charts
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data
      .filter((d, i, self) => i === self.findIndex(t => t.time === d.time))
      .sort((a, b) => a.time - b.time);
  }, [data]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#020617' },
        textColor: '#94a3b8',
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: config.showGrid ? '#1e293b' : 'transparent' },
        horzLines: { color: config.showGrid ? '#1e293b' : 'transparent' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        visible: config.showLabels,
      },
      timeScale: {
        borderColor: '#1e293b',
        visible: config.showLabels,
        timeVisible: true,
      },
      handleScale: true,
      handleScroll: true,
    });

    chartRef.current = chart;

    if (chartType === 'candlestick') {
      mainSeriesRef.current = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });
    } else {
      mainSeriesRef.current = chart.addAreaSeries({
        lineColor: '#6366f1',
        topColor: 'rgba(99, 102, 241, 0.2)',
        bottomColor: 'rgba(99, 102, 241, 0)',
        lineWidth: 2,
      });
    }

    if (showIndicators) {
        volumeSeriesRef.current = chart.addHistogramSeries({
            color: '#1e293b',
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
        });
        chart.priceScale('volume').applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });
    }

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartType, config.showGrid, config.showLabels, showIndicators]);

  // Update Data
  useEffect(() => {
    if (!mainSeriesRef.current || formattedData.length === 0) return;
    
    if (chartType === 'candlestick') {
        mainSeriesRef.current.setData(formattedData);
    } else {
        mainSeriesRef.current.setData(formattedData.map(d => ({ time: d.time, value: d.close })));
    }

    if (volumeSeriesRef.current) {
        volumeSeriesRef.current.setData(formattedData.map(d => ({
            time: d.time,
            value: d.volume || 0,
            color: d.close >= d.open ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
        })));
    }

    // AI Levels (Support/Resistance)
    if (aiLevels && mainSeriesRef.current) {
        // Clear old price lines if needed (though lightweight-charts doesn't have an easy clear)
        // For simplicity in this engine v1, we just add them
        if (aiLevels.support) {
            mainSeriesRef.current.createPriceLine({
                price: aiLevels.support,
                color: '#22c55e',
                lineWidth: 2,
                lineStyle: 2,
                axisLabelVisible: true,
                title: 'SUPPORT',
            });
        }
        if (aiLevels.resistance) {
            mainSeriesRef.current.createPriceLine({
                price: aiLevels.resistance,
                color: '#ef4444',
                lineWidth: 2,
                lineStyle: 2,
                axisLabelVisible: true,
                title: 'RESISTANCE',
            });
        }
    }
  }, [formattedData, chartType, aiLevels]);

  return <div className="w-full h-full" ref={chartContainerRef} />;
};

export default ChartCanvas;
