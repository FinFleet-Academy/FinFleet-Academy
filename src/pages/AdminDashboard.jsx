import React, { useState, useEffect } from 'react';
import { useAuth, PLANS } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button';

// SaaS Admin Components
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from './admin/Overview.jsx';
import AdminLiveClasses from './admin/LiveClasses.jsx';
import AdminUsers from './admin/Users.jsx';
import AdminCourseList from './admin/CourseList.jsx';
import AdminCourseCreator from './admin/CourseCreator.jsx';
import AdminPayments from './admin/Payments.jsx';
import AdminSettings from './admin/Settings.jsx';
import AdminAuditLogs from './admin/AuditLogs.jsx';
import SystemHealth from './admin/SystemHealth.jsx';
import { useAdminSocket } from '../hooks/useAdminSocket';
import { StatCardSkeleton, ChartSkeleton, TableSkeleton } from '../components/admin/AdminSkeleton';

import { Routes, Route, useLocation } from 'react-router-dom';
import AdminAnalytics from './admin/Analytics.jsx';
import SupportManager from './admin/SupportManager.jsx';
import AdminNotifications from './admin/Notifications.jsx';

const AdminDashboard = () => {
  const { isAdmin, fetchUsers, upgradePlan } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
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
      
      setUsersList(Array.isArray(users) ? users : []);
      setLiveClassesList(Array.isArray(allLiveClasses.data) ? allLiveClasses.data : []);
      setAnalyticsData(allAnalytics.data);
    } catch (error) {
      console.error("Admin Load Error:", error);
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
        <Button onClick={() => navigate('/')} className="mt-10">Return Home</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
         <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin mb-4" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing SaaS Core</p>
      </div>
    );
  }

  const getActiveTab = () => {
    const segments = pathname.split('/');
    const last = segments[segments.length - 1];
    return last === 'admin' ? 'overview' : last;
  };

  const handleTabChange = (tabId) => {
    const path = tabId === 'overview' ? '/admin' : `/admin/${tabId}`;
    navigate(path);
  };

  return (
    <AdminLayout activeTab={getActiveTab()} setActiveTab={handleTabChange}>
      <Routes>
        <Route index element={<AdminOverview stats={analyticsData} />} />
        <Route path="classes" element={<AdminLiveClasses classes={liveClassesList} loadData={loadData} />} />
        <Route path="courses" element={<AdminCourseList />} />
        <Route path="courses/new" element={<AdminCourseCreator />} />
        <Route path="users" element={<AdminUsers users={usersList} upgradePlan={upgradePlan} />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="audit" element={<AdminAuditLogs />} />
        <Route path="health" element={<SystemHealth />} />
        <Route path="support" element={<SupportManager />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
