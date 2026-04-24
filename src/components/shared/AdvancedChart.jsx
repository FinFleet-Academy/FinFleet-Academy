import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as LightweightCharts from 'lightweight-charts';

const AdvancedChart = ({ 
  data, 
  symbol, 
  timeframe, 
  markers = [], 
  onPriceUpdate,
  isLive = true 
}) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    let handleResize;

    const initChart = () => {
      if (!chartContainerRef.current) return;

      // Create Chart
      const chart = LightweightCharts.createChart(chartContainerRef.current, {
        layout: {
          background: { type: 'Solid', color: '#020617' },
          textColor: '#94a3b8',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif',
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
        },
        crosshair: {
          mode: 0, // Normal
          vertLine: {
            width: 1,
            color: 'rgba(255, 255, 255, 0.2)',
            style: 3, // Dashed
          },
          horzLine: {
            width: 1,
            color: 'rgba(255, 255, 255, 0.2)',
            style: 3, // Dashed
          },
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          autoScale: true,
        },
        handleScroll: true,
        handleScale: true,
      });

      // Add Candlestick Series
      let series;
      const seriesOptions = {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      };

      try {
        if (typeof chart.addCandlestickSeries === 'function') {
          series = chart.addCandlestickSeries(seriesOptions);
        } else if (typeof chart.addSeries === 'function') {
          try { series = chart.addSeries('Candlestick', seriesOptions); }
          catch (e) { series = chart.addSeries('candlestick', seriesOptions); }
        }
      } catch (err) {
        console.error("❌ Candlestick series failed:", err);
      }

      if (!series) return;

      series.setData(data);
      
      // Add Markers (Trades)
      if (markers.length > 0) {
        series.setMarkers(markers);
      }

      chart.timeScale().fitContent();

      chartRef.current = chart;
      seriesRef.current = series;

      handleResize = () => {
        if (chart && chartContainerRef.current) {
          chart.applyOptions({ 
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight 
          });
        }
      };

      window.addEventListener('resize', handleResize);
    };

    const timer = setTimeout(initChart, 100);

    return () => {
      clearTimeout(timer);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol, timeframe]); // Re-init on stock/timeframe change

  // Update Data when prop changes (without full re-init)
  useEffect(() => {
    if (seriesRef.current && data && data.length > 0) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  // Update Markers
  useEffect(() => {
    if (seriesRef.current && markers) {
      seriesRef.current.setMarkers(markers);
    }
  }, [markers]);

  return (
    <div className="w-full h-full relative group">
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};

export default AdvancedChart;
