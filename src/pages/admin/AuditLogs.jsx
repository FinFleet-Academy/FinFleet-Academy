import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, Search, Shield, User, Globe, Activity,
  Clock, Filter, Download, Zap, Database
} from 'lucide-react';
import axios from 'axios';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get('/api/audit', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLogs(data);
      } catch (error) {
        console.error("Audit Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
             <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Audit Ledger.</h2>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                <History className="w-4 h-4 mr-2 text-indigo-600" /> Immutable record of administrative operations
             </p>
          </div>
          <button className="flex items-center space-x-3 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-xl transition-all">
             <Download className="w-5 h-5" />
             <span>Export Log</span>
          </button>
       </div>

       {/* Toolbar */}
       <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 w-full group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Filter by admin, action, or module..." 
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
             />
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
             <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-6 py-5 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logs:</span>
                <span className="text-[10px] font-black text-indigo-600">{logs.length}</span>
             </div>
          </div>
       </div>

       {/* Logs List */}
       <div className="space-y-4">
          {loading ? (
             [1,2,3,4,5].map(i => (
               <div key={i} className="h-24 w-full bg-slate-100 dark:bg-slate-900/50 rounded-[2rem] animate-pulse" />
             ))
          ) : logs.map((log) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={log._id}
              className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-6"
            >
               <div className="flex items-center space-x-6 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                    log.module === 'users' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' :
                    log.module === 'payments' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                     <Database className="w-5 h-5" />
                  </div>
                  <div>
                     <div className="flex items-center space-x-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{log.module}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black uppercase tracking-tighter dark:text-white">{log.action}</span>
                     </div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                        <User className="w-3 h-3 mr-1.5" /> {log.admin?.name || 'System'}
                        <span className="mx-3 opacity-20">|</span>
                        <Globe className="w-3 h-3 mr-1.5" /> {log.ipAddress || 'Internal'}
                     </p>
                  </div>
               </div>
               <div className="flex items-center space-x-8">
                  <div className="text-right">
                     <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                        <Clock className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {new Date(log.timestamp).toLocaleTimeString()}
                     </div>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleDateString()}</p>
                  </div>
                  <button className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100 dark:border-slate-800 shadow-sm">
                     <Activity className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>
          ))}
          {!loading && logs.length === 0 && (
            <div className="py-24 text-center">
               <Shield className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No administrative actions logged yet</p>
            </div>
          )}
       </div>
    </div>
  );
};

export default React.memo(AdminAuditLogs);
