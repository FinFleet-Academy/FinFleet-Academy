import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, DollarSign, ArrowUpRight, ArrowDownRight,
  Search, Filter, Download, ExternalLink, CheckCircle2,
  XCircle, Clock, TrendingUp, Wallet
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell
} from 'recharts';

const data = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 2000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
  { name: 'Jul', amount: 3490 },
];

const AdminPayments = ({ payments = [] }) => {
  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
             <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Revenue Hub.</h2>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-indigo-600" /> Track monetization & transaction health
             </p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-[1.25rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter">₹12,48,200</h4>
             </div>
             <button className="flex items-center space-x-3 px-8 py-6 bg-indigo-600 text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                <TrendingUp className="w-5 h-5" />
                <span>Financial Report</span>
             </button>
          </div>
       </div>

       {/* Metrics & Main Chart */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex justify-between items-start mb-10">
                <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Monthly Earnings</h3>
                <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Year 2026</div>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                        contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '16px' }}
                        labelStyle={{ display: 'none' }}
                      />
                      <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                         {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4F46E5' : '#E2E8F0'} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[80px] opacity-10 -mr-16 -mt-16" />
                <Wallet className="w-10 h-10 mb-6 opacity-50" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">Payout Wallet</p>
                <h4 className="text-4xl font-black uppercase tracking-tighter mb-8">₹4,20,500</h4>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">Withdraw Funds</button>
             </div>
             
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Payment Health</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Success Rate</span>
                      <span className="text-sm font-black text-emerald-500">98.2%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-emerald-500 rounded-full" />
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      Transactions are currently stable. No significant spikes in failure detected.
                   </p>
                </div>
             </div>
          </div>
       </div>

       {/* Transaction Logs */}
       <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
             <h3 className="text-base font-black dark:text-white uppercase tracking-tighter">Transaction Ledger</h3>
             <div className="flex items-center space-x-3">
                <button className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100 dark:border-slate-800"><Search className="w-4 h-4" /></button>
                <button className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100 dark:border-slate-800"><Download className="w-4 h-4" /></button>
             </div>
          </div>
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reference</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Date</th>
                </tr>
             </thead>
             <tbody>
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-none">
                     <td className="px-10 py-7">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                              <DollarSign className="w-4 h-4 text-indigo-600" />
                           </div>
                           <div>
                              <p className="text-sm font-black dark:text-white uppercase tracking-tighter">Student {i}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">INV-00{i}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-7">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Class Enrollment</span>
                     </td>
                     <td className="px-8 py-7">
                        <span className="text-sm font-black dark:text-white">₹499.00</span>
                     </td>
                     <td className="px-8 py-7">
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                           <CheckCircle2 className="w-3 h-3 mr-1.5" /> Success
                        </span>
                     </td>
                     <td className="px-10 py-7 text-right">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Apr 24, 2026</span>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default React.memo(AdminPayments);
