import React, { useState } from 'react';
import axios from 'axios';
import { useAuth, PLANS } from '../context/AuthContext';
import { Users, Ticket, Trash2, ArrowUpCircle, XCircle, Search, ShieldAlert, BellRing, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { 
    isAdmin, 
    upgradePlan, 
    addCoupon, 
    deleteCoupon,
    fetchUsers,
    fetchSubscribers,
    fetchCoupons,
    adminSendNotification
  } = useAuth();
  
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([]);
  const [subscribersList, setSubscribersList] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [notifEmail, setNotifEmail] = useState('ALL');
  const [notifMessage, setNotifMessage] = useState('');

  const loadData = async () => {
    try {
      const [users, allCoupons, subscribers, adminStats] = await Promise.all([
        fetchUsers(),
        fetchCoupons(),
        fetchSubscribers(),
        axios.get('/api/admin/stats').then(res => res.data)
      ]);
      setUsersList(users);
      setCoupons(allCoupons);
      setSubscribersList(subscribers);
      setStats(adminStats);
    } catch (error) {
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Protect the route
  if (!isAdmin) {
    return (
      <div className="py-24 text-center min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-bold dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500">You must be logged in as an administrator to view this page.</p>
        <button onClick={() => navigate('/')} className="mt-6 btn-primary">Return Home</button>
      </div>
    );
  }

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode || !discountPercent) return;
    
    try {
      await addCoupon(couponCode, discountPercent);
      toast.success(`Coupon ${couponCode.toUpperCase()} created successfully!`);
      setCouponCode('');
      setDiscountPercent('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleUpgradeUser = async (userId, currentPlan) => {
    const plansOrder = Object.values(PLANS);
    const currentIndex = plansOrder.indexOf(currentPlan);
    
    if (currentIndex < plansOrder.length - 1) {
      const nextPlan = plansOrder[currentIndex + 1];
      try {
        await upgradePlan(userId, nextPlan);
        toast.success(`Upgraded user to ${nextPlan}.`);
        loadData();
      } catch (error) {
        toast.error("Failed to upgrade user");
      }
    } else {
      toast.error("User is already on the highest tier.");
    }
  };

  const handleCancelSubscription = async (userId) => {
    try {
      await upgradePlan(userId, PLANS.FREE);
      toast.success("Subscription cancelled");
      loadData();
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  const handleDeleteCoupon = async (couponId, code) => {
    try {
      await deleteCoupon(couponId);
      toast.success(`Coupon ${code} deleted.`);
      loadData();
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifMessage.trim()) return;
    
    try {
      await adminSendNotification(notifEmail, notifMessage);
      toast.success(`Notification sent to ${notifEmail === 'ALL' ? 'all users' : notifEmail}`);
      setNotifMessage('');
    } catch (error) {
      toast.error("Failed to send notification");
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold dark:text-white flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-brand-600" />
            Admin Operations
          </h1>
          <p className="text-slate-500 mt-2">Manage users, their subscriptions, notifications, and promotional coupons.</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value={stats?.summary?.totalUsers || 0} icon={<Users className="w-6 h-6" />} color="blue" />
          <StatCard title="Subscribers" value={stats?.summary?.totalSubscribers || 0} icon={<Mail className="w-6 h-6" />} color="purple" />
          <StatCard title="Total Courses" value={stats?.summary?.totalCourses || 0} icon={<Ticket className="w-6 h-6" />} color="amber" />
          <StatCard title="Revenue" value={`$${stats?.summary?.totalRevenue || 0}`} icon={<ArrowUpCircle className="w-6 h-6" />} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-premium p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold dark:text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-brand-600" />
                  User Subscriptions
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-sm text-slate-500">
                      <th className="py-3 px-4 font-bold">User</th>
                      <th className="py-3 px-4 font-bold">Current Plan</th>
                      <th className="py-3 px-4 font-bold">Chat Usage</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold dark:text-white">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.plan === PLANS.FREE ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                            'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                          }`}>
                            {u.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {u.plan !== PLANS.FREE && u.plan !== PLANS.PRO ? u.chatCount : '-'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleUpgradeUser(u._id, u.plan)}
                              className="p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                              title="Upgrade Plan"
                            >
                              <ArrowUpCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => {
                                handleCancelSubscription(u._id);
                                toast.success(`Cancelled subscription for ${u.name}`);
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Cancel Subscription"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Newsletter Subscribers */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold dark:text-white flex items-center mb-6">
                <Users className="w-5 h-5 mr-2 text-brand-600" />
                Newsletter Subscribers
              </h3>
              <div className="overflow-x-auto max-h-80 overflow-y-auto pr-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-sm text-slate-500">
                      <th className="py-3 px-4 font-bold">Email</th>
                      <th className="py-3 px-4 font-bold">Source</th>
                      <th className="py-3 px-4 font-bold">Date Subscribed</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {subscribersList.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-4 px-4 text-center text-slate-500">No subscribers found.</td>
                      </tr>
                    ) : (
                      subscribersList.map((sub) => (
                        <tr key={sub._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 px-4 font-bold dark:text-white">{sub.email}</td>
                          <td className="py-3 px-4 uppercase text-xs font-bold text-slate-500">{sub.source}</td>
                          <td className="py-3 px-4 text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notifications System */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold dark:text-white flex items-center mb-6">
                <BellRing className="w-5 h-5 mr-2 text-brand-600" />
                Broadcast Notification
              </h3>
              <form onSubmit={handleSendNotification} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Recipient</label>
                     <select
                       value={notifEmail}
                       onChange={(e) => setNotifEmail(e.target.value)}
                       className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white"
                     >
                       <option value="ALL">All Users</option>
                       {usersList.map(u => (
                         <option key={u._id} value={u.email}>{u.name} ({u.email})</option>
                       ))}
                     </select>
                   </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Message</label>
                  <textarea
                    required
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="Enter your notification message..."
                    rows="3"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary py-2.5 text-sm flex items-center shadow-lg">
                  <Send className="w-4 h-4 mr-2" />
                  Send Notification
                </button>
              </form>
            </div>
          </div>

          {/* Coupon Management */}
          <div className="space-y-6">
            
            {/* Create Coupon */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold dark:text-white flex items-center mb-6">
                <Ticket className="w-5 h-5 mr-2 text-brand-600" />
                Create Coupon
              </h3>
              
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Coupon Code</label>
                  <input
                    required
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. SUMMER50"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Discount Percentage (%)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white"
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-2.5 text-sm">
                  Create Coupon
                </button>
              </form>
            </div>

            {/* Active Coupons List */}
            <div className="card-premium p-6">
               <h4 className="font-bold dark:text-white mb-4">Active Coupons</h4>
               {coupons.length === 0 ? (
                 <p className="text-sm text-slate-500 italic">No active coupons available.</p>
               ) : (
                 <div className="space-y-3">
                   {coupons.map((c, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                       <div>
                         <div className="font-bold text-brand-600 dark:text-brand-400">{c.code}</div>
                         <div className="text-xs text-slate-500">{c.discountPercent}% OFF</div>
                       </div>
                       <button 
                         onClick={() => handleDeleteCoupon(c._id, c.code)}
                         className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div className="card-premium p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
