import React from 'react';
import ReactApexChart from 'react-apexcharts';

const MarketDataChart = ({ data, symbol, colors = {} }) => {
  if (!data || data.length === 0) return null;

  const formattedData = data.map(item => [
    new Date(item.timestamp).getTime(),
    parseFloat(item.price.toFixed(2))
  ]).sort((a, b) => a[0] - b[0]);

  const series = [{
    name: symbol,
    data: formattedData
  }];

  const options = {
    chart: {
      type: 'area',
      height: 400,
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: 'transparent',
      animations: { enabled: true }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2, colors: [colors.lineColor || '#22c55e'] },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0,
        colorStops: [
          { offset: 0, color: colors.lineColor || "#22c55e", opacity: 0.3 },
          { offset: 100, color: colors.lineColor || "#22c55e", opacity: 0 }
        ]
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
      opposite: true
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM HH:mm' },
      style: { fontSize: '10px', fontFamily: 'Inter' }
    },
    colors: [colors.lineColor || '#22c55e'],
  };

  return (
    <div className="relative w-full p-4 pt-16">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-2xl font-black text-white flex items-center">
          {symbol} 
          <span className="ml-3 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
            NSE Live
          </span>
        </h3>
      </div>
      <ReactApexChart options={options} series={series} type="area" height={400} />
    </div>
  );
};

export default MarketDataChart;
