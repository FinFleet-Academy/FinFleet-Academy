import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import axios from 'axios';

const FinancialTracker = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/financial/summary');
      setData(res.data);
    } catch (err) {
      console.error(err);
      // Fallback Demo Data
      setData({
        health: {
          score: 72,
          status: 'Good',
          metrics: { savingsRate: 35, emiRatio: 18, investmentRatio: 65 },
          insights: [
            { type: 'tip', text: "Your savings rate is healthy. Consider increasing your equity exposure." },
            { type: 'warning', text: "Your transport expenses spiked by 12% this month." }
          ]
        },
        transactions: [
          { type: 'Income', amount: 80000, category: 'Salary', date: new Date() },
          { type: 'Expense', amount: 12000, category: 'Rent', date: new Date() },
          { type: 'Expense', amount: 5000, category: 'Food', date: new Date() },
          { type: 'Expense', amount: 3000, category: 'Transport', date: new Date() },
        ],
        profile: {
          investments: [
            { type: 'SIP', investedAmount: 200000, currentValue: 245000 },
            { type: 'FD', investedAmount: 100000, currentValue: 105000 },
          ],
          loans: [
            { loanType: 'Personal Loan', monthlyEmi: 8000, totalAmount: 500000, tenureMonths: 36, paidMonths: 12 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Gathering Data...</div>;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-10">
      {/* Top Row: Health Score & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Health Score Card */}
        <motion.div {...fadeInUp} className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />
          
          <div className="text-center md:text-left z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Financial Health Score</p>
            <h2 className="text-6xl font-black dark:text-white tracking-tighter mb-4">{data?.health?.score || 0}<span className="text-2xl text-slate-300">/100</span></h2>
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${
              data?.health?.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : 
              data?.health?.status === 'Good' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <Activity className="w-3 h-3" />
              <span>Status: {data?.health?.status || 'Calculating...'}</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4 z-10">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                <span>Savings Rate</span>
                <span>{(data?.health?.metrics?.savingsRate || 0).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${data?.health?.metrics?.savingsRate || 0}%` }} className="h-full bg-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                <span>EMI Ratio</span>
                <span>{(data?.health?.metrics?.emiRatio || 0).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${data?.health?.metrics?.emiRatio || 0}%` }} className="h-full bg-indigo-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add Transaction Button */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="bg-slate-900 dark:bg-white rounded-[3rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.02] transition-transform group shadow-2xl">
           <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center mb-6 shadow-xl shadow-brand-500/40">
             <Plus className="w-8 h-8 text-white" />
           </div>
           <h3 className="text-xl font-black text-white dark:text-slate-900 mb-2">Track Activity</h3>
           <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Update Cashflow & Assets</p>
        </motion.div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Income vs Expense Chart */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px]">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Monthly Cashflow Profile</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <BarChart data={[
                { name: 'Income', amount: (data?.transactions || []).filter(t => t.type === 'Income').reduce((a,b)=>a+b.amount,0) },
                { name: 'Expense', amount: (data?.transactions || []).filter(t => t.type === 'Expense').reduce((a,b)=>a+b.amount,0) }
              ]}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Investment Distribution */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-[300px]">
               <ResponsiveContainer width="100%" height="100%" debounce={100}>
                 <PieChart>
                   <Pie 
                     data={(data?.profile?.investments || []).map(i => ({ name: i.type, value: i.investedAmount }))} 
                     innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value"
                   >
                     {(data?.profile?.investments || []).map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
            </div>
           <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Portfolio Allocation</h3>
              {(data?.profile?.investments || []).map((inv, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold dark:text-slate-300">{inv.type}</span>
                  </div>
                  <span className="text-xs font-black dark:text-white">₹{inv?.investedAmount?.toLocaleString('en-IN') || 0}</span>
                </div>
              ))}
           </div>
        </motion.div>
      </div>

      {/* AI Insights Panel */}
      <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32 pointer-events-none" />
        
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-brand-500" />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Wealth Coach</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data?.health?.insights || []).map((insight, i) => (
            <div key={i} className="flex items-start space-x-4 bg-white/5 rounded-2xl p-6 border border-white/10">
              {insight.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" /> : 
               insight.type === 'danger' ? <TrendingDown className="w-5 h-5 text-rose-500 shrink-0" /> :
               <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              <p className="text-xs font-bold text-slate-300 leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
};

export default FinancialTracker;
