import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, Globe, Shield, CreditCard, 
  Bell, Mail, Key, Zap, Save, RefreshCw, Smartphone
} from 'lucide-react';

const AdminSettings = () => {
  const SettingSection = ({ title, description, children, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
       <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-950/20">
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-base font-black dark:text-white uppercase tracking-tighter">{title}</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{description}</p>
             </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all">
             <RefreshCw className="w-3.5 h-3.5" />
             <span>Sync</span>
          </button>
       </div>
       <div className="p-8 space-y-6">
          {children}
       </div>
    </div>
  );

  const InputField = ({ label, placeholder, type = "text", value }) => (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
       <input 
         type={type}
         placeholder={placeholder}
         className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
         defaultValue={value}
       />
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
             <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">System Matrix.</h2>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                <SettingsIcon className="w-4 h-4 mr-2 text-indigo-600" /> Platform configuration & API orchestrator
             </p>
          </div>
          <button className="flex items-center space-x-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all">
             <Save className="w-5 h-5" />
             <span>Commit Changes</span>
          </button>
       </div>

       <SettingSection 
         title="Global Infrastructure" 
         description="Core platform settings and regional configurations"
         icon={Globe}
       >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <InputField label="Platform Name" placeholder="FinFleet Academy" value="FinFleet Academy" />
             <InputField label="Support Email" placeholder="support@finfleet.com" value="support@finfleetacademy.com" />
          </div>
          <div className="flex items-center space-x-4 pt-4">
             <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all">
                <div className="flex items-center space-x-4">
                   <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm"><Shield className="w-5 h-5 text-indigo-600" /></div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white">Maintenance Mode</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Toggle site-wide access</p>
                   </div>
                </div>
                <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative p-1 transition-colors">
                   <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </div>
             </div>
             <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all">
                <div className="flex items-center space-x-4">
                   <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm"><Zap className="w-5 h-5 text-amber-500" /></div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-tighter dark:text-white">AI Engine Acceleration</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Enhanced chat response time</p>
                   </div>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 flex justify-end">
                   <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </div>
             </div>
          </div>
       </SettingSection>

       <SettingSection 
         title="API & Integrations" 
         description="Connect external services and providers"
         icon={Key}
       >
          <div className="space-y-8">
             <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                   <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20"><CreditCard className="w-5 h-5" /></div>
                   <h4 className="text-xs font-black uppercase tracking-widest">Razorpay Configuration</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Key ID" placeholder="rzp_live_..." type="password" />
                   <InputField label="Secret Key" placeholder="••••••••••••" type="password" />
                </div>
             </div>

             <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                   <div className="p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-lg"><RefreshCw className="w-5 h-5" /></div>
                   <h4 className="text-xs font-black uppercase tracking-widest">Zoom API Integration</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Client ID" placeholder="zoom_client_..." />
                   <InputField label="Client Secret" placeholder="••••••••••••" type="password" />
                </div>
             </div>
          </div>
       </SettingSection>

       <SettingSection 
         title="Notifications & Alerts" 
         description="Manage how the system communicates with users"
         icon={Bell}
       >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { icon: Mail, label: 'Email Alerts', status: true },
               { icon: Smartphone, label: 'Push Notifications', status: false },
               { icon: Zap, label: 'SMS Gateway', status: false }
             ].map((n, i) => (
               <div key={i} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-4 hover:border-indigo-500/20 transition-all cursor-pointer">
                  <div className={`p-4 rounded-full ${n.status ? 'bg-indigo-500/10 text-indigo-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                     <n.icon className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest mb-1">{n.label}</p>
                     <p className={`text-[8px] font-bold uppercase tracking-widest ${n.status ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {n.status ? 'Active' : 'Disabled'}
                     </p>
                  </div>
               </div>
             ))}
          </div>
       </SettingSection>
    </div>
  );
};

export default AdminSettings;
