import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, CreditCard, Video, Activity, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Zap, Target, Globe
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const data = [
  { name: 'Mon', users: 400, revenue: 2400 },
  { name: 'Tue', users: 300, revenue: 1398 },
  { name: 'Wed', users: 900, revenue: 9800 },
  { name: 'Thu', users: 1480, revenue: 3908 },
  { name: 'Fri', users: 1890, revenue: 4800 },
  { name: 'Sat', users: 2390, revenue: 3800 },
  { name: 'Sun', users: 3490, revenue: 4300 },
];

const AdminOverview = ({ stats }) => {
  const StatCard = ({ label, value, change, isPositive, icon: Icon, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all"
    >
      <div className="flex justify-between items-start relative z-10">
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
           <h3 className="text-3xl font-black dark:text-white tracking-tighter leading-none">{value}</h3>
           <div className={`flex items-center space-x-1 mt-4 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-[10px] font-black">{change}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">vs last week</span>
           </div>
        </div>
        <div className={`p-4 rounded-2xl ${isPositive ? 'bg-indigo-500/10 text-indigo-600' : 'bg-red-500/10 text-red-500'} transition-transform group-hover:scale-110`}>
           <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
    </motion.div>
  );

  return (
    <div className="space-y-10">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
             <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Platform Pulse.</h2>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                <Activity className="w-4 h-4 mr-2 text-indigo-600" /> Real-time system performance & growth
             </p>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <button className="px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 transition-all">Today</button>
             <button className="px-5 py-2.5 text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-colors">7 Days</button>
             <button className="px-5 py-2.5 text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-colors">30 Days</button>
          </div>
       </div>

       {/* Metric Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard label="Total Revenue" value="₹1.2M" change="12.5" isPositive={true} icon={CreditCard} delay={0.1} />
          <StatCard label="Active Students" value="4,829" change="8.2" isPositive={true} icon={Users} delay={0.2} />
          <StatCard label="Live Classes" value="12" change="3.1" isPositive={false} icon={Video} delay={0.3} />
          <StatCard label="System Load" value="14%" change="0.5" isPositive={true} icon={Zap} delay={0.4} />
       </div>

       {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
             <div className="flex justify-between items-start mb-10">
                <div>
                   <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Revenue Growth</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly financial performance overview</p>
                </div>
                <div className="flex items-center space-x-3">
                   <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-600" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">Current</span>
                   </div>
                </div>
             </div>
             
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data}>
                      <defs>
                         <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
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
                        tickFormatter={(value) => `₹${value/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                           backgroundColor: '#0F172A', 
                           border: 'none', 
                           borderRadius: '16px',
                           padding: '12px'
                        }}
                        itemStyle={{ color: '#F1F5F9', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                        labelStyle={{ color: '#64748B', fontSize: '8px', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4F46E5" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorRev)" 
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Quick Stats / Recent Activity */}
          <div className="lg:col-span-4 space-y-10">
             <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-24 -mt-24" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10 relative">Goal Progress</h3>
                
                <div className="space-y-8 relative">
                   {[
                     { label: 'Revenue Target', val: 82, color: 'bg-indigo-500' },
                     { label: 'User Acquisition', val: 64, color: 'bg-emerald-500' },
                     { label: 'Class Attendance', val: 45, color: 'bg-amber-500' },
                   ].map((goal, i) => (
                     <div key={i} className="space-y-3">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{goal.label}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest">{goal.val}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${goal.val}%` }}
                             transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                             className={`h-full ${goal.color}`}
                           />
                        </div>
                     </div>
                   ))}
                </div>
                
                <button className="w-full mt-10 py-5 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">View All Reports</button>
             </div>

             <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Live Feed</h3>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-6">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-start space-x-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 group-hover:bg-indigo-600 transition-colors">
                           <Zap className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                        </div>
                        <div>
                           <p className="text-[11px] font-bold leading-tight group-hover:text-indigo-600 transition-colors">New Premium Enrollment</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">2 mins ago</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default React.memo(AdminOverview);
