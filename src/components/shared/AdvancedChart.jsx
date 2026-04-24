import React from 'react';
import ReactApexChart from 'react-apexcharts';

const AdvancedChart = ({ 
  data, 
  symbol, 
  timeframe, 
  markers = [] 
}) => {
  if (!data || data.length === 0) return null;

  // Format OHLC data for ApexCharts
  const formattedData = data.map(item => ({
    x: new Date(item.time * 1000),
    y: [
      parseFloat(item.open.toFixed(2)), 
      parseFloat(item.high.toFixed(2)), 
      parseFloat(item.low.toFixed(2)), 
      parseFloat(item.close.toFixed(2))
    ]
  }));

  const series = [{
    name: symbol,
    data: formattedData
  }];

  const options = {
    chart: {
      type: 'candlestick',
      height: '100%',
      toolbar: { show: true, tools: { download: false, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true } },
      background: '#020617',
      animations: { enabled: false } // Disabled for performance on large datasets
    },
    title: { show: false },
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
    plotOptions: {
      candlestick: {
        colors: {
          profitable: '#10b981',
          unprofitable: '#ef4444'
        },
        wick: { useFillColor: true }
      }
    },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '10px' }
    },
    annotations: {
      points: markers.map(m => ({
        x: m.time * 1000,
        y: parseFloat(m.text.split('@ ')[1]), // Extract price from marker text
        marker: {
          size: 6,
          fillColor: m.color,
          strokeColor: '#fff',
          radius: 2,
        },
        label: {
          borderColor: m.color,
          offsetY: m.position === 'aboveBar' ? -40 : 40,
          style: { color: '#fff', background: m.color, fontSize: '10px', fontWeight: '900' },
          text: m.text.split(' @')[0] // Just 'BUY' or 'SELL'
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
