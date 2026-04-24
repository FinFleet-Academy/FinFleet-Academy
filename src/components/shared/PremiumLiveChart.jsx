import React, { useEffect, useRef, useState } from 'react';
import * as LightweightCharts from 'lightweight-charts';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Activity, Users, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumLiveChart = () => {
  const chartContainerRef = useRef();
  const [currentPrice, setCurrentPrice] = useState(2542.45);
  const [change, setChange] = useState(2.4);

  useEffect(() => {
    console.log("🚀 Chart Engine Initializing... LW Version:", LightweightCharts.version);
    if (!chartContainerRef.current) return;

    let chart;
    let interval;
    let handleResize;

    const initChart = () => {
      if (!chartContainerRef.current) return;
      
      chart = LightweightCharts.createChart(chartContainerRef.current, {
        layout: {
          background: { type: 'Solid', color: 'transparent' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        width: chartContainerRef.current.clientWidth || 500,
        height: 350,
        timeScale: { visible: false },
        rightPriceScale: { visible: false },
        handleScroll: false,
        handleScale: false,
      });

      console.log("🚀 Chart created. Methods:", Object.keys(chart));

      // Resilient Series Creation
      let series;
      const seriesOptions = {
        lineColor: '#22c55e',
        topColor: 'rgba(34, 197, 94, 0.2)',
        bottomColor: 'rgba(34, 197, 94, 0)',
        lineWidth: 2,
        crosshairMarkerVisible: false,
      };

      try {
        if (typeof chart.addAreaSeries === 'function') {
          series = chart.addAreaSeries(seriesOptions);
        } else if (typeof chart.addSeries === 'function') {
          // Try 'Area' and 'area' strings as fallbacks
          try { series = chart.addSeries('Area', seriesOptions); } 
          catch (e) { series = chart.addSeries('area', seriesOptions); }
        }
      } catch (err) {
        console.error("❌ Series creation failed:", err);
      }

      if (!series) {
        console.error("❌ Critical: Could not create chart series.");
        return;
      }

      // Initial Data
      let data = [];
      let time = Math.floor(Date.now() / 1000) - 100;
      let price = 2500;
      for (let i = 0; i < 100; i++) {
        price = price + (Math.random() - 0.5) * 10;
        data.push({ time: time++, value: price });
      }
      series.setData(data);

      interval = setInterval(() => {
        const lastPrice = data[data.length - 1].value;
        const noise = (Math.random() - 0.5) * 5;
        const newPrice = lastPrice + noise;
        const newPoint = { time: time++, value: newPrice };
        
        data.push(newPoint);
        if (data.length > 150) data.shift();
        
        series.update(newPoint);
        setCurrentPrice(newPrice);
        setChange(((newPrice - 2500) / 2500 * 100).toFixed(2));
      }, 2000);

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
      if (interval) clearInterval(interval);
      if (chart) chart.remove();
    };
  }, []);

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden bg-[#F9FAFB] dark:bg-[#080C10]">
      {/* Abstract Background Blurs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500 rounded-full blur-[160px] opacity-[0.08] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[140px] opacity-[0.08] -ml-64 -mb-64" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center space-x-3 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-brand-600 animate-pulse" />
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Next-Gen Trading Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
              Learn. Trade. <br />
              <span className="text-gradient">Master the Markets.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
              Experience the adrenaline of real-world markets without the risk. Practice with professional-grade tools and live-simulated charts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link to="/signup" className="w-full sm:w-auto btn-brand py-5 px-12 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/30 group">
                Start Learning
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/trade" className="w-full sm:w-auto btn-secondary py-5 px-12 text-[11px] font-black uppercase tracking-[0.2em] dark:text-white border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                Explore Simulator
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-slate-100 dark:border-slate-900/50">
               {[
                 { icon: Users, label: '12K+ Learners', color: 'text-blue-500' },
                 { icon: Activity, label: 'Live Simulation', color: 'text-emerald-500' },
                 { icon: ShieldCheck, label: 'AI Insights', color: 'text-brand-600' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right Content - Animated Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, delay: 0.2 }}
            className="relative group"
          >
            {/* Glass Container */}
            <div className="relative bg-white dark:bg-slate-900/50 backdrop-blur-3xl rounded-[3.5rem] p-4 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
               
               {/* Chart Header */}
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
                     <p className={`text-[10px] font-black uppercase tracking-widest ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% Today
                     </p>
                  </div>
               </div>

               {/* Chart Body */}
               <div ref={chartContainerRef} className="w-full h-[350px] relative">
                  {/* Floating Micro Cards */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute top-10 left-10 z-20 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl"
                  >
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Bullish Momentum</span>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                    className="absolute bottom-10 right-10 z-20 bg-brand-500/10 border border-brand-500/20 backdrop-blur-md px-4 py-2 rounded-xl"
                  >
                     <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest">Volume High</span>
                  </motion.div>
               </div>
               
               {/* Chart Footer */}
               <div className="p-6 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center space-x-8">
                  <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Feed</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delayed by 0.5s</span>
               </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 to-indigo-500/20 rounded-[4rem] blur-2xl -z-10 group-hover:opacity-40 transition-opacity duration-700" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PremiumLiveChart;
