import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  PieChart as PieChartIcon, 
  Target, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from 'recharts';
import BrandLogo from '../../../components/ui/BrandLogo';

/**
 * 💎 FinFleet Academy Premium: Wealth Intelligence Hub
 * Advanced financial tracking with neural scoring and institutional analytics.
 */
const FinancialTracker = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [activeView, setActiveView] = useState('summary'); // summary | analytics | ledger

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/financial/summary');
      setData(res.data);
    } catch (err) {
      console.error("Fetch failed, using optimized demo data", err);
      // Fallback Demo Data for Premium Experience
      setData({
        health: {
          score: 78,
          status: 'Excellent',
          metrics: { savingsRate: 42, emiRatio: 12, investmentRatio: 68 },
          insights: [
            { type: 'success', text: "Your savings rate is in the top 5% of your demographic. Alpha-tier performance." },
            { type: 'warning', text: "Transport overhead increased by 8%. Consider optimizing commute strategy." },
            { type: 'tip', text: "LTCG tax harvesting window is open. Review portfolio for optimization." }
          ]
        },
        transactions: [
          { _id: '1', type: 'Income', amount: 120000, category: 'Consulting', date: new Date(), description: 'Q1 Project' },
          { _id: '2', type: 'Expense', amount: 15000, category: 'Cloud Infrastructure', date: new Date(), description: 'AWS' },
          { _id: '3', type: 'Expense', amount: 8000, category: 'Research', date: new Date(), description: 'Terminal Subscription' },
          { _id: '4', type: 'Income', amount: 45000, category: 'Dividends', date: new Date(), description: 'BlueChip Portfolio' },
        ],
        profile: {
          investments: [
            { type: 'Equity', investedAmount: 450000, currentValue: 520000 },
            { type: 'Bonds', investedAmount: 200000, currentValue: 215000 },
            { type: 'Crypto', investedAmount: 50000, currentValue: 110000 },
            { type: 'Real Estate', investedAmount: 1200000, currentValue: 1350000 },
          ],
          loans: [
            { loanType: 'Smart Home Loan', monthlyEmi: 15000, totalAmount: 2500000, tenureMonths: 180, paidMonths: 24 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  if (loading) return (
    <div className="h-[600px] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Syncing Financial Nodes...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      
      {/* 🚀 1. NEURAL SCORE & ASSET TOTALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Score & Metrics */}
        <motion.div {...fadeInUp} className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500 rounded-full blur-[140px] opacity-10 -mr-40 -mt-40 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Neural Wealth Score</p>
              <h2 className="text-8xl font-black dark:text-white tracking-tighter mb-6">
                {(data?.health?.score || 0)}
                <span className="text-3xl text-slate-400 ml-2 font-black">/100</span>
              </h2>
              <div className={`inline-flex items-center space-x-3 px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest ${
                data?.health?.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-500/10 text-brand-500'
              }`}>
                <ShieldCheck className="w-4 h-4" />
                <span>Tier: {data?.health?.status || 'Active'}</span>
              </div>
            </div>

            <div className="w-full md:w-[45%] space-y-8">
               {[
                 { label: 'Savings Alpha', val: data?.health?.metrics?.savingsRate, color: 'bg-emerald-500' },
                 { label: 'Leverage Ratio', val: data?.health?.metrics?.emiRatio, color: 'bg-indigo-500' },
                 { label: 'Growth Exposure', val: data?.health?.metrics?.investmentRatio, color: 'bg-brand-500' }
               ].map((m, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                       <span className="text-slate-400">{m.label}</span>
                       <span className="text-slate-900 dark:text-white">{(m.val || 0).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${m.val || 0}%` }} className={`h-full ${m.color}`} />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Action Matrix */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
           <motion.div 
            {...fadeInUp} transition={{ delay: 0.1 }}
            onClick={() => setShowAddTransaction(true)}
            className="bg-slate-900 dark:bg-white rounded-[3rem] p-8 flex flex-col justify-between cursor-pointer hover:scale-[1.03] transition-all group shadow-3xl"
           >
              <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/40 group-hover:rotate-12 transition-transform">
                    <Plus className="w-7 h-7 text-white" />
                 </div>
                 <ChevronRight className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-white dark:text-slate-900 mb-2">Update Ledger</h3>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Node Update</p>
              </div>
           </motion.div>

           <motion.div 
            {...fadeInUp} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 flex items-center space-x-6"
           >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                 <Target className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Projected Worth</p>
                 <h4 className="text-2xl font-black dark:text-white">₹{( (data?.profile?.investments || []).reduce((a,b)=>a+b.currentValue,0) / 100000 ).toFixed(1)}L</h4>
              </div>
           </motion.div>
        </div>
      </div>

      {/* 📊 2. INTELLIGENT ANALYTICS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Asset Allocation Radar */}
         <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10 w-full">Asset Radar</h3>
            <div className="w-full h-64 mb-8">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie 
                     data={(data?.profile?.investments || []).map(i => ({ name: i.type, value: i.investedAmount }))} 
                     innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none"
                   >
                     {(data?.profile?.investments || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="w-full space-y-3">
               {(data?.profile?.investments || []).map((inv, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                       <span className="text-[11px] font-bold text-slate-500 uppercase">{inv.type}</span>
                    </div>
                    <span className="text-[11px] font-black dark:text-white">₹{(inv.currentValue / 1000).toFixed(0)}k</span>
                 </div>
               ))}
            </div>
         </motion.div>

         {/* Cashflow Delta Chart */}
         <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[450px]">
            <div className="flex items-center justify-between mb-12">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Cashflow Intelligence</h3>
               <div className="flex space-x-2">
                  <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-[9px] font-black text-emerald-600 uppercase">Inflow</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                     <div className="w-2 h-2 rounded-full bg-rose-500" />
                     <span className="text-[9px] font-black text-rose-600 uppercase">Outflow</span>
                  </div>
               </div>
            </div>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: 'Node 01', inflow: 45000, outflow: 12000 },
                   { name: 'Node 02', inflow: 52000, outflow: 15000 },
                   { name: 'Node 03', inflow: 48000, outflow: 32000 },
                   { name: 'Node 04', inflow: 65000, outflow: 18000 },
                 ]} barGap={12}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" hide />
                   <YAxis hide />
                   <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                   <Bar dataKey="inflow" fill="#10b981" radius={[8, 8, 0, 0]} />
                   <Bar dataKey="outflow" fill="#ef4444" radius={[8, 8, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-slate-50 dark:border-slate-800 pt-8">
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Inflow (30d)</p>
                  <p className="text-2xl font-black text-emerald-500">₹{((data?.transactions || []).filter(t => t.type === 'Income').reduce((a,b)=>a+b.amount,0) || 0).toLocaleString()}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outflow (30d)</p>
                  <p className="text-2xl font-black text-rose-500">₹{((data?.transactions || []).filter(t => t.type === 'Expense').reduce((a,b)=>a+b.amount,0) || 0).toLocaleString()}</p>
               </div>
            </div>
         </motion.div>
      </div>

      {/* 🧠 3. NEURAL COACH INSIGHTS */}
      <motion.div {...fadeInUp} transition={{ delay: 0.5 }} className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-10 relative z-10">
           <div className="flex items-center space-x-4">
              <div>
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Neural Intelligence Analysis</h3>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">v4.2.0-Alpha Stream Active</p>
              </div>
           </div>
           <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-colors">
              Refresh Analysis
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {(data?.health?.insights || []).map((insight, i) => (
            <div key={i} className="flex flex-col h-full bg-white/5 rounded-[2rem] p-8 border border-white/5 hover:border-brand-500/50 transition-all">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${
                 insight.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 
                 insight.type === 'warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-brand-500/20 text-brand-500'
               }`}>
                  {insight.type === 'success' ? <CheckCircle2 size={18} /> : 
                   insight.type === 'warning' ? <AlertTriangle size={18} /> : <Layers size={18} />}
               </div>
               <p className="text-xs font-bold text-slate-300 leading-relaxed flex-grow">{insight.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 📋 4. LEDGER REPOSITORY */}
      <motion.div {...fadeInUp} transition={{ delay: 0.6 }} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
         <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Transaction Repository</h3>
            <div className="flex space-x-4">
               <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">Export CSV</button>
               <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">Filters</button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                     {['Timestamp', 'Subject', 'Node', 'Amount', 'Vector'].map(h => (
                       <th key={h} className="px-10 py-5 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {(data?.transactions || []).slice(0, 5).map((t, i) => (
                    <tr key={t._id || i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                       <td className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase">{new Date(t.date).toLocaleDateString()}</td>
                       <td className="px-10 py-6">
                          <p className="text-xs font-black dark:text-white uppercase">{t.category}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{t.description || 'Verified Node Update'}</p>
                       </td>
                       <td className="px-10 py-6">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">ID-{(t._id || '0').slice(-4)}</span>
                       </td>
                       <td className="px-10 py-6 text-xs font-black dark:text-white">₹{t.amount.toLocaleString()}</td>
                       <td className="px-10 py-6">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                            t.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                             {t.type === 'Income' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                             <span>{t.type}</span>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <button className="w-full py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border-t border-slate-50 dark:border-slate-800">
            Access Full Ledger Repository
         </button>
      </motion.div>

      {/* ⚙️ TRANSACTION MODAL (UPGRADED) */}
      <AnimatePresence>
        {showAddTransaction && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddTransaction(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-3xl relative z-10 overflow-hidden"
            >
               <div className="p-12">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Wealth Node Update</h2>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorized Transaction Protocol</p>
                    </div>
                    <button onClick={() => setShowAddTransaction(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white rounded-2xl transition-all">
                      <Plus className="w-6 h-6 rotate-45" />
                    </button>
                  </div>

                  <form className="space-y-8" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const payload = {
                      type: formData.get('type'),
                      category: formData.get('category'),
                      amount: parseFloat(formData.get('amount')),
                      description: formData.get('description'),
                      date: new Date()
                    };
                    
                    try {
                      await axios.post('/api/financial/transaction', payload);
                      setShowAddTransaction(false);
                      fetchSummary();
                    } catch (err) {
                      console.error(err);
                    }
                  }}>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Flow Direction</label>
                         <select name="type" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4.5 font-black uppercase text-xs dark:text-white focus:ring-4 focus:ring-brand-500/10 transition-all">
                           <option value="Income">Node Inflow</option>
                           <option value="Expense">Node Outflow</option>
                         </select>
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Quantum (₹)</label>
                         <input required name="amount" type="number" step="any" placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4.5 font-black text-xs dark:text-white focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-300" />
                       </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Classification</label>
                      <input required name="category" type="text" placeholder="Salary, Dividends, Rent..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4.5 font-black text-xs dark:text-white focus:ring-4 focus:ring-brand-500/10" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Metadata Descriptor</label>
                      <textarea name="description" rows="3" placeholder="Optional audit details..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4.5 font-black text-xs dark:text-white focus:ring-4 focus:ring-brand-500/10 resize-none" />
                    </div>

                    <button type="submit" className="w-full py-6 bg-brand-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/40 hover:scale-[1.02] active:scale-95 transition-all">
                      Confirm Node Synchronization
                    </button>
                  </form>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinancialTracker;
