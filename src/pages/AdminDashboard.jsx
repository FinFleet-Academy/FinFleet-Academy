import React, { useState, useEffect } from 'react';
import { useAuth, PLANS } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';

// SaaS Admin Components
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from './admin/Overview';
import AdminLiveClasses from './admin/LiveClasses';
import AdminUsers from './admin/Users';
import AdminPayments from './admin/Payments';
import AdminAnalytics from './admin/Analytics';
import AdminSettings from './admin/Settings';
import AdminAuditLogs from './admin/AuditLogs';

const AdminDashboard = () => {
  const { isAdmin, fetchUsers, upgradePlan } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [usersList, setUsersList] = useState([]);
  const [liveClassesList, setLiveClassesList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [users, allLiveClasses, allAnalytics] = await Promise.all([
        fetchUsers(),
        axios.get('/api/live-classes'),
        axios.get('/api/analytics/dashboard', { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
        }).catch(() => ({ data: null }))
      ]);
      
      setUsersList(users || []);
      setLiveClassesList(allLiveClasses.data || []);
      setAnalyticsData(allAnalytics.data);
    } catch (error) {
      console.error("Admin Load Error:", error);
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="py-24 text-center min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-8" />
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Access Denied.</h2>
        <p className="text-slate-500 font-bold max-w-sm uppercase tracking-widest text-[10px]">Administrator privileges required.</p>
        <button onClick={() => navigate('/')} className="mt-10 px-10 py-5 bg-indigo-600 text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl shadow-xl shadow-indigo-600/20">Return Home</button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview stats={analyticsData} />;
      case 'live_classes':
        return <AdminLiveClasses classes={liveClassesList} loadData={loadData} />;
      case 'users':
        return <AdminUsers users={usersList} upgradePlan={upgradePlan} />;
      case 'payments':
        return <AdminPayments />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'audit_logs':
        return <AdminAuditLogs />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
           <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin mb-4" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing SaaS Core</p>
        </div>
      ) : (
        renderContent()
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
