import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, FileText, Camera, Save, CheckCircle, 
  Shield, Star, Crown, Zap, Lock, Eye, EyeOff, Award, 
  ExternalLink, Users, ChevronRight, UserPlus, UserMinus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PLAN_META = {
  'FREE':       { icon: Shield, color: 'text-slate-500',  bg: 'bg-slate-100 dark:bg-slate-800',  label: 'Free'        },
  'PRO':        { icon: Zap,    color: 'text-blue-500',   bg: 'bg-blue-100 dark:bg-blue-900/30',  label: 'Pro'         },
  'ELITE':      { icon: Star,   color: 'text-brand-500',  bg: 'bg-brand-100 dark:bg-brand-900/30',label: 'Elite'       },
  'ELITE PRIME':{ icon: Crown,  color: 'text-amber-500',  bg: 'bg-amber-100 dark:bg-amber-900/30',label: 'Elite Prime' },
};

const PrivacyRow = ({ label, field, value, onChange, options = ['public', 'followers', 'private'] }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex flex-col">
      <span className="text-sm font-bold dark:text-white">{label}</span>
      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Visibility level</span>
    </div>
    <div className="flex items-center bg-slate-50 dark:bg-slate-950 p-1 rounded-xl">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(field, opt)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            value === opt
              ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-sm'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const ProfilePage = () => {
  const { user, plan, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('edit');
  const [form, setForm]         = useState({ name: '', mobile: '', bio: '', profileImage: '' });
  const [privacy, setPrivacy]   = useState({ email: 'private', mobile: 'private', bio: 'public', followersList: 'public', followingList: 'public', certificates: 'public' });
  const [certs, setCerts]       = useState([]);
  const [social, setSocial]     = useState({ followers: [], following: [] });
  const [saving, setSaving]     = useState(false);
  const [loadingSocial, setLoadingSocial] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', mobile: user.mobile || '', bio: user.bio || '', profileImage: user.profileImage || '' });
      if (user.privacy) setPrivacy({ ...privacy, ...user.privacy });
      if (user.certificates) setCerts(user.certificates);
      fetchSocialData();
    }
  }, [user]);

  const fetchSocialData = async () => {
    setLoadingSocial(true);
    try {
      const { data } = await axios.get('/api/follow/me');
      setSocial(data);
    } catch { console.error("Social data fetch failed"); }
    finally { setLoadingSocial(false); }
  };

  const handleUnfollow = async (targetId) => {
    try {
      await axios.delete(`/api/follow/${targetId}`);
      toast.success('Unfollowed successfully');
      fetchSocialData();
    } catch {
      toast.error('Failed to unfollow');
    }
  };

  const handlePrivacyChange = (field, val) => setPrivacy(prev => ({ ...prev, [field]: val }));

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      await axios.put('/api/user/privacy', { privacy });
      toast.success('Privacy settings synced!');
    } catch { toast.error('Sync failed'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: 'edit', label: 'Settings', icon: User },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'certificates', label: 'Achievements', icon: Award },
  ];

  const fadeInUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  return (
    <div className="py-12 md:py-24 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-center space-x-6">
            <div className="relative group">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-gradient-to-br from-brand-600 to-indigo-600 p-1 shadow-2xl shadow-brand-500/20">
                  {form.profileImage ? (
                    <img src={form.profileImage} alt="Profile" className="w-full h-full rounded-[2.25rem] object-cover bg-white" />
                  ) : (
                    <div className="w-full h-full rounded-[2.25rem] bg-slate-900 flex items-center justify-center text-white text-3xl font-black">
                      {user?.name?.[0]}
                    </div>
                  )}
               </div>
               <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-brand-600" />
               </button>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-black dark:text-white tracking-tight">{user?.name}</h1>
                <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-brand-100 dark:border-brand-800">
                  Verified
                </span>
              </div>
              <div className="flex items-center space-x-4 text-slate-400 text-sm font-bold">
                 <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> {social.followers?.length || 0} Followers</span>
                 <span className="flex items-center"><UserPlus className="w-4 h-4 mr-1.5" /> {social.following?.length || 0} Following</span>
              </div>
            </div>
          </div>
          <Link to={`/user/${user?._id}`} className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest dark:text-white shadow-sm flex items-center hover:shadow-md transition-all active:scale-95">
             Preview Public <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-2">
               {tabs.map(t => (
                 <button
                   key={t.id}
                   onClick={() => setActiveTab(t.id)}
                   className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                     activeTab === t.id
                       ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20'
                       : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                   }`}
                 >
                   <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-white' : 'text-slate-400'}`} />
                   <span className="uppercase tracking-widest text-[10px]">{t.label}</span>
                 </button>
               ))}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-8 -mt-8" />
               <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-4 flex items-center">
                  <Crown className="w-3 h-3 mr-2" />
                  Subscription
               </h3>
               <div className="text-xl font-black mb-1">{plan}</div>
               <p className="text-slate-400 text-[10px] font-bold mb-6">Access to all premium modules</p>
               <Link to="/pricing" className="text-[10px] font-black uppercase tracking-widest text-brand-400 hover:text-brand-300 transition-colors">Upgrade Plan →</Link>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'edit' && (
                <motion.div key="edit" {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm h-full">
                  <h2 className="text-xl font-black dark:text-white mb-8 uppercase tracking-widest">Account Details</h2>
                  <form onSubmit={(e) => { e.preventDefault(); toast.success("Saved"); }} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                           <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white focus:border-brand-500 focus:outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Email</label>
                           <input value={user?.email} readOnly className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-400 cursor-not-allowed" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Biography</label>
                        <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={4} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold dark:text-white focus:border-brand-500 focus:outline-none transition-all resize-none" placeholder="Share your investing journey..." />
                     </div>
                     <button type="submit" className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Sync Changes
                     </button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'privacy' && (
                <motion.div key="privacy" {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm h-full">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-widest">Privacy & Trust</h2>
                    <Shield className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                     <PrivacyRow label="Email Visibility" field="email" value={privacy.email} onChange={handlePrivacyChange} />
                     <PrivacyRow label="Mobile Presence" field="mobile" value={privacy.mobile} onChange={handlePrivacyChange} />
                     <PrivacyRow label="Bio & Profile" field="bio" value={privacy.bio} onChange={handlePrivacyChange} />
                     <PrivacyRow label="Followers List" field="followersList" value={privacy.followersList} onChange={handlePrivacyChange} options={['public', 'private']} />
                     <PrivacyRow label="Following List" field="followingList" value={privacy.followingList} onChange={handlePrivacyChange} options={['public', 'private']} />
                     <PrivacyRow label="Achievement Badges" field="certificates" value={privacy.certificates} onChange={handlePrivacyChange} />
                  </div>
                  <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                        <Lock className="w-3 h-3 inline mr-2" />
                        All data is encrypted. Selecting "Private" ensures your data is only visible to you. "Followers" allows verified connections to see your shared insights.
                     </p>
                  </div>
                  <button onClick={handleSavePrivacy} className="mt-8 px-10 py-4 bg-brand-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-700 shadow-xl shadow-brand-500/20 transition-all">
                     Update Privacy
                  </button>
                </motion.div>
              )}

              {activeTab === 'social' && (
                 <motion.div key="social" {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm h-full">
                    <h2 className="text-xl font-black dark:text-white mb-10 uppercase tracking-widest">My Network</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Followers ({social.followers?.length || 0})</h3>
                          <div className="space-y-4">
                             {social.followers?.map(f => (
                                <div key={f._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                                   <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                                      <span className="text-xs font-black dark:text-white uppercase tracking-tight">{f.name}</span>
                                   </div>
                                   <Link to={`/user/${f._id}`} className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                      <ChevronRight className="w-4 h-4 text-slate-400" />
                                   </Link>
                                </div>
                             ))}
                             {social.followers?.length === 0 && <p className="text-xs font-bold text-slate-400 italic">No followers yet.</p>}
                          </div>
                       </div>
                       <div className="space-y-6">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Following ({social.following?.length || 0})</h3>
                          <div className="space-y-4">
                             {social.following?.map(f => (
                                <div key={f._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                                   <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                                      <span className="text-xs font-black dark:text-white uppercase tracking-tight">{f.name}</span>
                                   </div>
                                   <button onClick={() => handleUnfollow(f._id)} className="text-[10px] font-black uppercase text-red-500 hover:underline">Unfollow</button>
                                </div>
                             ))}
                             {social.following?.length === 0 && <p className="text-xs font-bold text-slate-400 italic">Following no one.</p>}
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'certificates' && (
                <motion.div key="certs" {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm h-full">
                  <h2 className="text-xl font-black dark:text-white mb-10 uppercase tracking-widest">Achievements</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {certs.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-40">
                           <Award className="w-16 h-16 mx-auto mb-4" />
                           <p className="text-sm font-black uppercase tracking-widest">No certifications earned</p>
                        </div>
                     ) : (
                        certs.map(c => (
                           <div key={c._id} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-brand-500/50 transition-all relative">
                              {!c.isVisible && <div className="absolute top-4 right-4"><EyeOff className="w-4 h-4 text-slate-400" /></div>}
                              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                 <Award className="w-8 h-8 text-brand-600" />
                              </div>
                              <h4 className="text-sm font-black dark:text-white mb-1 uppercase tracking-tight">{c.courseName}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.completedAt).toLocaleDateString()}</p>
                              <div className="mt-6 w-full pt-4 border-t border-slate-200 dark:border-slate-800">
                                 <button 
                                   onClick={async () => {
                                     try {
                                       const { data } = await axios.put('/api/user/certificate-visibility', { certId: c._id, isVisible: !c.isVisible });
                                       setCerts(data.certificates);
                                       toast.success(c.isVisible ? 'Hidden from public' : 'Visible to public');
                                     } catch { toast.error('Failed to update visibility'); }
                                   }}
                                   className="text-[10px] font-black uppercase text-brand-600 hover:underline"
                                 >
                                   {c.isVisible ? 'Hide Certificate' : 'Show Certificate'}
                                 </button>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
