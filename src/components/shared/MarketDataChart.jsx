import React, { useEffect, useRef } from 'react';
import * as LightweightCharts from 'lightweight-charts';

const MarketDataChart = ({ data, symbol, colors = {} }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    let chart;
    let handleResize;

    const initChart = () => {
      if (!chartContainerRef.current) return;

      chart = LightweightCharts.createChart(chartContainerRef.current, {
        layout: {
          background: { type: 'Solid', color: colors.backgroundColor || 'transparent' },
          textColor: colors.textColor || '#d1d5db',
        },
        grid: {
          vertLines: { color: colors.gridColor || 'rgba(255, 255, 255, 0.05)' },
          horzLines: { color: colors.gridColor || 'rgba(255, 255, 255, 0.05)' },
        },
        width: chartContainerRef.current.clientWidth || 500,
        height: 400,
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      });

      let series;
      if (typeof chart.addAreaSeries === 'function') {
        series = chart.addAreaSeries({
          lineColor: colors.lineColor || '#22c55e',
          topColor: colors.topColor || 'rgba(34, 197, 94, 0.2)',
          bottomColor: colors.bottomColor || 'rgba(34, 197, 94, 0)',
          lineWidth: 2,
        });
      } else if (typeof chart.addSeries === 'function') {
        series = chart.addSeries('Area', {
          lineColor: colors.lineColor || '#22c55e',
          topColor: colors.topColor || 'rgba(34, 197, 94, 0.2)',
          bottomColor: colors.bottomColor || 'rgba(34, 197, 94, 0)',
          lineWidth: 2,
        });
      }

      if (!series) return;

      // Format data for lightweight-charts (needs time as unix timestamp and value)
      const formattedData = data.map(item => ({
        time: Math.floor(new Date(item.timestamp).getTime() / 1000),
        value: item.price
      })).sort((a, b) => a.time - b.time);

      series.setData(formattedData);
      chart.timeScale().fitContent();

      handleResize = () => {
        if (chart && chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);
    };

    const timer = setTimeout(initChart, 100);

    return () => {
      clearTimeout(timer);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (chart) chart.remove();
    };
  }, [data, colors, symbol]);

  return (
    <div className="relative w-full">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-2xl font-black text-white flex items-center">
          {symbol} 
          <span className="ml-3 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
            NSE Live
          </span>
        </h3>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

export default MarketDataChart;
