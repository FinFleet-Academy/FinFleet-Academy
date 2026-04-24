import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, User, Search, Filter, MoreVertical, ShieldCheck, 
  Mail, ArrowUpCircle, Ban, UserCheck, ShieldAlert,
  Download, ExternalLink, Activity
} from 'lucide-react';
import { PLANS } from '../../context/AuthContext';

const AdminUsers = ({ users = [], upgradePlan }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = (users || []).filter(u => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
             <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">User Directory.</h2>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                <Users className="w-4 h-4 mr-2 text-indigo-600" /> Manage student accounts & access tiers
             </p>
          </div>
          <button className="flex items-center space-x-3 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-xl transition-all">
             <Download className="w-5 h-5" />
             <span>Export CSV</span>
          </button>
       </div>

       {/* Toolbar */}
       <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 w-full group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Search by name, email, or user ID..." 
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
             <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-6 py-5 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total:</span>
                <span className="text-[10px] font-black text-indigo-600">{users.length}</span>
             </div>
          </div>
       </div>

       {/* Users Table */}
       <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Tier</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
             </thead>
             <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-none">
                     <td className="px-10 py-8">
                        <div className="flex items-center space-x-6">
                           <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 font-black text-sm border border-slate-200 dark:border-slate-700">
                              {u.name[0].toUpperCase()}
                           </div>
                           <div>
                              <h4 className="text-sm font-black dark:text-white tracking-tighter leading-none mb-1.5 uppercase">{u.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-8">
                        <div className="flex items-center space-x-3">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             u.plan === PLANS.PRIME ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                             u.plan === PLANS.ELITE ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                             'bg-slate-100 text-slate-500 border-slate-200'
                           }`}>
                              {u.plan}
                           </span>
                           {u.isAdmin && (
                             <ShieldCheck className="w-4 h-4 text-indigo-600" />
                           )}
                        </div>
                     </td>
                     <td className="px-8 py-8">
                        <div className="flex flex-col space-y-1">
                           <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <Activity className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {u.enrolledCourses?.length || 0} Courses
                           </div>
                           <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                        </div>
                     </td>
                     <td className="px-8 py-8">
                        <div className="flex items-center space-x-2">
                           <span className="w-2 h-2 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Verified</span>
                        </div>
                     </td>
                     <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           <button 
                             onClick={() => upgradePlan(u._id, PLANS.ELITE)}
                             className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"
                             title="Upgrade to Elite"
                           >
                              <ArrowUpCircle className="w-4 h-4" />
                           </button>
                           <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                              <Mail className="w-4 h-4" />
                           </button>
                           <button className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                              <Ban className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {filteredUsers.length === 0 && (
             <div className="py-24 text-center">
                <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No users found matching your query</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default AdminUsers;
