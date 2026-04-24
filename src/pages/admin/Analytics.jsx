import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, PieChart as PieChartIcon, TrendingUp, Users, 
  Target, Zap, Globe, ArrowUpRight, Filter, Download,
  Calendar, Layers, Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, Line
} from 'recharts';

const userRetentionData = [
  { name: 'Week 1', active: 4000, new: 2400 },
  { name: 'Week 2', active: 3000, new: 1398 },
  { name: 'Week 3', active: 2000, new: 9800 },
  { name: 'Week 4', active: 2780, new: 3908 },
  { name: 'Week 5', active: 1890, new: 4800 },
  { name: 'Week 6', active: 2390, new: 3800 },
  { name: 'Week 7', active: 3490, new: 4300 },
];

const classPerformance = [
  { name: 'Trading 101', students: 450, revenue: 12000 },
  { name: 'Pro Scalping', students: 380, revenue: 24000 },
  { name: 'Crypto Basics', students: 520, revenue: 8000 },
  { name: 'Risk Mgmt', students: 290, revenue: 15000 },
  { name: 'Options Adv', students: 180, revenue: 32000 },
];

const conversionData = [
  { name: 'Free Users', value: 80, fill: '#6366f1' },
  { name: 'Trial', value: 45, fill: '#a855f7' },
  { name: 'Premium', value: 25, fill: '#ec4899' },
  { name: 'Elite', value: 12, fill: '#f43f5e' },
];

const AdminAnalytics = () => {
  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
             <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Deep Analytics.</h2>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-indigo-600" /> Behavioral insights & conversion funnels
             </p>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20">
                <Calendar className="w-4 h-4" />
                <span>Last 30 Days</span>
             </button>
             <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Filter className="w-5 h-5" /></button>
             <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Download className="w-5 h-5" /></button>
          </div>
       </div>

       {/* Top Funnel Row */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex justify-between items-start mb-10">
                <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">User Retention Engine</h3>
                <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /><span className="text-[9px] font-black uppercase text-slate-400">Active</span></div>
                   <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-slate-200" /><span className="text-[9px] font-black uppercase text-slate-400">New</span></div>
                </div>
             </div>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={userRetentionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '16px' }} />
                      <Area type="monotone" dataKey="active" stroke="#6366f1" fillOpacity={0.1} fill="#6366f1" strokeWidth={3} />
                      <Area type="monotone" dataKey="new" stroke="#E2E8F0" fillOpacity={0.05} fill="#E2E8F0" strokeWidth={2} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
             <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10">Conversion Funnel</h3>
                <div className="space-y-8">
                   {conversionData.map((c, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-400">{c.name}</span>
                           <span>{c.value}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${c.value}%` }}
                             transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                             className="h-full"
                             style={{ backgroundColor: c.fill }}
                           />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="mt-12 p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                   Free-to-Premium conversion has increased by <span className="text-emerald-500">4.2%</span> this month.
                </p>
             </div>
          </div>
       </div>

       {/* Second Row: Performance Metrics */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10">System Engagement</h3>
             <div className="space-y-10">
                {[
                  { label: 'Avg Session Duration', value: '42m', change: '+12%', icon: Activity },
                  { label: 'Quiz Completion Rate', value: '68%', change: '+5%', icon: Target },
                  { label: 'Live Class Attendance', value: '82%', change: '-2%', icon: Users },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"><stat.icon className="w-5 h-5 text-indigo-600" /></div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white leading-none">{stat.label}</p>
                           <p className={`text-[8px] font-bold uppercase mt-1 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change} this week</p>
                        </div>
                     </div>
                     <span className="text-xl font-black dark:text-white uppercase tracking-tighter">{stat.value}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex justify-between items-start mb-10">
                <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Content Efficiency</h3>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-xl">Revenue vs Students</div>
             </div>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={classPerformance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6366f1', fontSize: 10, fontWeight: 900 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '16px' }} />
                      <Bar yAxisId="left" dataKey="students" fill="#E2E8F0" radius={[10, 10, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} />
                   </ComposedChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
};

export default React.memo(AdminAnalytics);
