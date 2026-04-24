import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Activity, Users, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumLiveChart = () => {
  const [currentPrice, setCurrentPrice] = useState(2542.45);
  const [change, setChange] = useState(2.4);
  const [series, setSeries] = useState([{
    name: 'NIFTY 50',
    data: []
  }]);

  useEffect(() => {
    // Generate initial data
    let data = [];
    let time = Date.now() - 100 * 2000;
    let price = 2500;
    for (let i = 0; i < 50; i++) {
      price = price + (Math.random() - 0.5) * 10;
      data.push([time, parseFloat(price.toFixed(2))]);
      time += 2000;
    }
    setSeries([{ name: 'NIFTY 50', data }]);

    const interval = setInterval(() => {
      setSeries(prev => {
        const last = prev[0].data[prev[0].data.length - 1];
        const newPrice = last[1] + (Math.random() - 0.5) * 5;
        const newTime = last[0] + 2000;
        const newData = [...prev[0].data, [newTime, parseFloat(newPrice.toFixed(2))]];
        
        if (newData.length > 60) newData.shift();
        
        setCurrentPrice(newPrice);
        setChange(((newPrice - 2500) / 2500 * 100).toFixed(2));
        
        return [{ ...prev[0], data: newData }];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } },
      sparkline: { enabled: false },
      background: 'transparent'
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3, colors: ['#22c55e'] },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
        colorStops: [
          { offset: 0, color: "#22c55e", opacity: 0.4 },
          { offset: 100, color: "#22c55e", opacity: 0 }
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
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM HH:mm:ss' },
      style: { fontSize: '10px', fontFamily: 'Inter' }
    },
    colors: ['#22c55e'],
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden bg-[#F9FAFB] dark:bg-[#080C10]">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500 rounded-full blur-[160px] opacity-[0.08] -mr-64 -mt-64" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
            <div className="inline-flex items-center space-x-3 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-brand-600 animate-pulse" />
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Next-Gen Trading Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">Learn. Trade. <br /><span className="text-gradient">Master the Markets.</span></h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">Experience the adrenaline of real-world markets without the risk. Practice with professional-grade tools and live-simulated charts.</p>
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link to="/signup" className="w-full sm:w-auto btn-brand py-5 px-12 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/30 group">Start Learning<ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" /></Link>
              <Link to="/trading" className="w-full sm:w-auto btn-secondary py-5 px-12 text-[11px] font-black uppercase tracking-[0.2em] dark:text-white border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center">Explore Simulator</Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative group">
            <div className="relative bg-white dark:bg-slate-900/50 backdrop-blur-3xl rounded-[3.5rem] p-4 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
               <div className="p-8 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center font-black text-white dark:text-slate-900">FF</div>
                     <div>
                        <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">NIFTY 50 Index</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Market Simulation</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-black dark:text-white tracking-tighter">₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                     <p className={`text-[10px] font-black uppercase tracking-widest ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}% Today</p>
                  </div>
               </div>
               <div className="w-full h-[350px] relative mt-4">
                  <ReactApexChart options={options} series={series} type="area" height={350} />
               </div>
               <div className="p-6 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center space-x-8">
                  <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Feed</span></div>
                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delayed by 0.5s</span>
               </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 to-indigo-500/20 rounded-[4rem] blur-2xl -z-10 group-hover:opacity-40 transition-opacity duration-700" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumLiveChart;
