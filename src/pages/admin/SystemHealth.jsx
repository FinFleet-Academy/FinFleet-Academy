import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, Zap, ShieldCheck, AlertCircle, 
  Clock, Database, Cpu, HardDrive, RefreshCcw 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const SystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/health', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHealth(data);
    } catch (error) {
      console.error('Failed to fetch health:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !health) {
    return <div className="animate-pulse space-y-8 p-8">
      <div className="h-40 bg-slate-800/50 rounded-[2.5rem]" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-40 bg-slate-800/50 rounded-[2.5rem]" />)}
      </div>
    </div>;
  }

  const { gateway, services } = health;

  return (
    <div className="space-y-8 p-2 sm:p-8">
      {/* 1. Cluster Status */}
      <Card className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">SaaS Cluster Active</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">API Gateway: {gateway}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-6 md:mt-0">
          <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={fetchHealth}>Resync Mesh</Button>
        </div>
      </Card>

      {/* 2. Microservices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Card key={service.name} padding="p-6" hover={false} className="relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{service.name} Service</h4>
                <div className="flex items-center space-x-2 mt-2">
                   <Badge variant={service.status === 'Healthy' ? 'emerald' : 'red'}>
                     {service.status}
                   </Badge>
                </div>
              </div>
              <Activity className={`w-5 h-5 ${service.status === 'Healthy' ? 'text-indigo-600' : 'text-red-500'}`} />
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  <span>Instance Latency</span>
                  <span className={service.latency > 100 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}>
                    {service.latency}ms
                  </span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (service.latency / 200) * 100)}%` }}
                    className={`h-full ${service.latency > 100 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                  />
               </div>
            </div>

            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 rounded-full ${
               service.status === 'Healthy' ? 'bg-indigo-600' : 'bg-red-600'
            }`} />
          </Card>
        ))}
      </div>

      {/* 3. Infrastructure Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card title="Traffic Orchestration">
            <div className="flex items-center space-x-3 mb-6">
               <Cpu className="w-5 h-5 text-emerald-500" />
               <span className="text-[11px] font-black uppercase tracking-widest">Global Ingress Stats</span>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Request Routing</span>
                     <span className="text-xs font-black">Active (Round Robin)</span>
                  </div>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Auto-Scaling</span>
                     <Badge variant="indigo">HPA Configured</Badge>
                  </div>
               </div>
            </div>
         </Card>
         <Card title="Event Bus">
            <div className="flex items-center space-x-3 mb-6">
               <RefreshCcw className="w-5 h-5 text-amber-500" />
               <span className="text-[11px] font-black uppercase tracking-widest">Inter-Service Mesh</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inter-service communication is orchestrated via the <strong>Redis Pub/Sub</strong> event bus.
              This ensures full fault isolation and asynchronous consistency across the distributed architecture.
            </p>
         </Card>
      </div>
    </div>
  );
};

export default SystemHealth;
