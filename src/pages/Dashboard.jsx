import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Star, Zap, DollarSign, Activity, TrendingUp, TrendingDown, 
  Briefcase, Award, Send, Bot, Clock, Link2, Copy, Users, ChevronRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../components/feedback/Toast';
import { uiContent } from '../config/ui-content';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table, { TableRow, TableCell } from '../components/ui/Table';
import Skeleton, { TableSkeleton } from '../components/ui/Skeleton';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAppStore();
  const { addToast } = useToastStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [portfolio, setPortfolio] = useState({ items: [], balance: 0 });
  const [tradeHistory, setTradeHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, portfolioRes, historyRes] = await Promise.all([
          axios.get('/api/courses/progress').catch(() => ({ data: [] })),
          axios.get('/api/trade/portfolio').catch(() => ({ data: { portfolio: [], balance: 0 } })),
          axios.get('/api/trade/history').catch(() => ({ data: [] }))
        ]);
        
        setCourses(courseRes.data.slice(0, 3));
        setPortfolio({ items: portfolioRes.data.portfolio, balance: portfolioRes.data.balance });
        setTradeHistory(historyRes.data.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://finfleetacademy.com/signup?ref=${user?.referralCode}`);
    addToast('Referral link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-10">
      {/* 1. Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
          {uiContent.dashboard.welcome.replace('{name}', user?.name?.split(' ')[0] || 'Trader')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">
          {uiContent.common.tagline}
        </p>
      </motion.div>

      {/* 2. KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: uiContent.dashboard.stats.balance, value: `₹${portfolio.balance.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: uiContent.dashboard.stats.points, value: user?.points || 0, icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: uiContent.dashboard.stats.courses, value: courses.length, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'AI Quota', value: `${user?.chatCount || 0}/20`, icon: Zap, color: 'text-brand-600', bg: 'bg-brand-600/10' },
        ].map((kpi, i) => (
          <Card key={i} padding="p-6" hover={true} className="flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-2xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <Badge variant="indigo">Live</Badge>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpi.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Featured Section: Financial Hub & Market */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card 
          onClick={() => navigate('/financial')}
          className="lg:col-span-5 bg-slate-900 dark:bg-white rounded-[3rem] p-10 shadow-2xl group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[350px]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500 rounded-full blur-[100px] opacity-20 -mr-40 -mt-40 transition-all group-hover:opacity-30" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-brand-600 text-white flex items-center justify-center mb-8 shadow-xl shadow-brand-500/20">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-black text-white dark:text-slate-900 mb-4 tracking-tighter uppercase leading-none">Financial Hub</h3>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs mt-4">AI-powered tracking for your wealth, cards, and loans. Master your cashflow with neural insights.</p>
          </div>
          <div className="relative z-10 flex items-center justify-between mt-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initialize Hub</span>
            <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card title="Live Portfolio Pulse" className="lg:col-span-7 h-full">
           <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-6">
             <Activity className="w-12 h-12 text-brand-600 opacity-20 animate-pulse" />
             <div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Real-Time Market Tracking Active</p>
               <Button variant="ghost" size="sm" onClick={() => navigate('/trading')}>Open Trading Terminal</Button>
             </div>
           </div>
        </Card>
      </div>

      {/* 4. AI Assistant & Referral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden flex flex-col p-0">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest">AI Learning Hub</h2>
            </div>
            <Badge variant="emerald">System Optimal</Badge>
          </div>
          <div className="p-8 flex-grow space-y-6">
            <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-[2rem] rounded-tl-none border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                Analyze market sentiment, calculate risk-reward ratios, or learn complex trading concepts instantly. How can I assist your strategy today?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['"Risk Management"', '"NIFTY 50 Analysis"', '"Option Greeks"'].map(q => (
                <button 
                  key={q} 
                  onClick={() => setChatInput(q.replace(/"/g, ''))}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-600 hover:border-brand-600 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="relative pt-4">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message your AI Co-Pilot..."
                className="w-full pl-6 pr-14 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
              />
              <button className="absolute right-3 bottom-3 w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 hover:scale-105 transition-transform">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Tactical Assets">
            <div className="space-y-4">
              {tradeHistory.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${t.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {t.type === 'BUY' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase">{t.symbol}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">{t.type} · {new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black">₹{t.price.toLocaleString()}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" fullWidth className="mt-2" onClick={() => navigate('/pro-chart')}>
                Terminal Access
              </Button>
            </div>
          </Card>

          <Card padding="p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center">
              <Link2 className="w-4 h-4 mr-2" />
              Network Growth
            </h3>
            <p className="text-xs font-bold text-slate-500 mb-6 leading-relaxed">Expand the fleet. Earn <span className="text-brand-600">+10 AI tokens</span> per referral.</p>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-xl p-1.5 border border-slate-200 dark:border-slate-800">
              <code className="flex-grow text-[10px] font-black px-3 truncate">{user?.referralCode}</code>
              <button onClick={copyReferral} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition-colors active:scale-90">
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Holdings Table */}
      <Card title="Current Holdings" padding="p-0 overflow-hidden">
        <Table headers={['Asset', 'Quantity', 'Avg Price', 'Market', 'Status']}>
          {portfolio.items.length > 0 ? portfolio.items.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-black text-slate-900 dark:text-white uppercase">{item.symbol}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>₹{item.averagePrice.toLocaleString()}</TableCell>
              <TableCell className="uppercase text-[9px] tracking-widest">{item.market}</TableCell>
              <TableCell><Badge variant="emerald">Active</Badge></TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                Tactical portfolio is empty
              </TableCell>
            </TableRow>
          )}
        </Table>
      </Card>
    </div>
  );
};

export default Dashboard;
