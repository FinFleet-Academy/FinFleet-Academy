import React from 'react';
import ReactApexChart from 'react-apexcharts';

const AdvancedChart = ({ 
  data, 
  symbol, 
  timeframe, 
  markers = [],
  type = 'candlestick',
  showIndicators = false
}) => {
  if (!data || data.length === 0) return null;

  // 1. Format Data based on Type
  const series = [];

  if (type === 'candlestick') {
    series.push({
      name: symbol,
      type: 'candlestick',
      data: data.map(item => ({
        x: new Date(item.time * 1000),
        y: [item.open, item.high, item.low, item.close]
      }))
    });
  } else {
    series.push({
      name: symbol,
      type: 'area',
      data: data.map(item => ({
        x: new Date(item.time * 1000),
        y: item.close
      }))
    });
  }

  // 2. Add EMA Indicator (Simple Calculation)
  if (showIndicators) {
    const emaData = data.map((item, index, arr) => {
      if (index < 9) return null;
      const period = 9;
      const k = 2 / (period + 1);
      let ema = arr[index].close;
      if (index > period) {
        // Simple approximation for demo
        ema = arr[index].close * k + arr[index - 1].close * (1 - k);
      }
      return { x: new Date(item.time * 1000), y: parseFloat(ema.toFixed(2)) };
    }).filter(d => d !== null);

    series.push({
      name: 'EMA 9',
      type: 'line',
      data: emaData
    });
  }

  const options = {
    chart: {
      type: type === 'candlestick' ? 'candlestick' : 'area',
      height: '100%',
      toolbar: { show: true, tools: { download: false, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true } },
      background: '#020617',
      animations: { enabled: false },
      fontFamily: 'Inter, sans-serif'
    },
    stroke: {
      width: type === 'candlestick' ? 1 : [3, 2],
      curve: 'smooth',
    },
    fill: {
      type: type === 'area' ? 'gradient' : 'solid',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
      axisBorder: { color: '#1e293b' },
      axisTicks: { color: '#1e293b' }
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: { style: { colors: '#94a3b8', fontSize: '10px' }, formatter: (val) => val.toFixed(2) },
      opposite: true
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.03)',
    },
    colors: type === 'candlestick' ? ['#10b981'] : ['#22c55e', '#6366f1'],
    plotOptions: {
      candlestick: {
        colors: {
          profitable: '#10b981',
          unprofitable: '#ef4444'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '10px' }
    },
    annotations: {
      points: markers.map(m => ({
        x: m.time * 1000,
        y: m.price,
        marker: { size: 6, fillColor: m.color, strokeColor: '#fff', radius: 2 },
        label: {
          borderColor: m.color,
          offsetY: m.position === 'aboveBar' ? -40 : 40,
          style: { color: '#fff', background: m.color, fontSize: '10px', fontWeight: '900' },
          text: m.text.split(' @')[0]
        }
      }))
    }
  };

  return (
    <div className="w-full h-full bg-[#020617]">
      <ReactApexChart options={options} series={series} type="candlestick" height="100%" />
    </div>
  );
};

export default AdvancedChart;
