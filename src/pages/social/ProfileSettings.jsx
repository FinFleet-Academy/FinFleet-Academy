import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, User, Lock, Globe, 
  Linkedin, Twitter, Instagram, 
  CheckCircle, AlertTriangle, Moon, 
  Sun, Eye, EyeOff, Save, Trash2,
  ExternalLink, Key
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const ProfileSettings = () => {
  const { user, setUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    skillLevel: 'Beginner',
    socialLinks: { 
      linkedin: { url: '', visibility: 'PUBLIC' }, 
      twitter: { url: '', visibility: 'PUBLIC' }, 
      instagram: { url: '', visibility: 'PUBLIC' },
      website: { url: '', visibility: 'PUBLIC' }
    },
    privacy: { email: 'PRIVATE', mobile: 'PRIVATE', stats: 'PRIVATE', certificates: 'PUBLIC' }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        skillLevel: user.skillLevel || 'Beginner',
        socialLinks: user.socialLinks || { 
          linkedin: { url: '', visibility: 'PUBLIC' }, 
          twitter: { url: '', visibility: 'PUBLIC' }, 
          instagram: { url: '', visibility: 'PUBLIC' },
          website: { url: '', visibility: 'PUBLIC' }
        },
        privacy: user.privacy || { email: 'PRIVATE', mobile: 'PRIVATE', stats: 'PRIVATE', certificates: 'PUBLIC' }
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/user/profile', formData);
      setUser(res.data);
      toast.success("Settings synchronized successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Key },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ];

  const fadeInUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] py-20 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black dark:text-white tracking-tighter uppercase">Settings</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Manage your institutional identity & preferences</p>
          </div>
          <Link to="/profile" className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-600 hover:underline">
            View Public Profile <ExternalLink className="w-3 h-3 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-black/10'
                    : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 border border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div key="profile" {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm space-y-10">
                  <div className="space-y-8">
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">Public Profile</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Display Name</label>
                        <input 
                          type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:border-brand-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Trading Handle (@)</label>
                        <input 
                          type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:border-brand-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Biography (Max 160 chars)</label>
                      <textarea 
                        maxLength={160}
                        value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white focus:border-brand-500 transition-all outline-none resize-none h-32"
                        placeholder="Tell the community about your trading journey..."
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Trading Skill Level</label>
                      <div className="flex flex-wrap gap-3">
                        {['Beginner', 'Intermediate', 'Pro'].map(level => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormData({...formData, skillLevel: level})}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              formData.skillLevel === level
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-xs font-black dark:text-white uppercase tracking-widest">Social Connections</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { id: 'linkedin', icon: Linkedin, color: 'text-blue-600' },
                          { id: 'twitter', icon: Twitter, color: 'text-slate-400' },
                          { id: 'instagram', icon: Instagram, color: 'text-pink-600' },
                          { id: 'website', icon: Globe, color: 'text-brand-600' }
                        ].map(social => (
                          <div key={social.id} className="relative">
                            <social.icon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${social.color}`} />
                            <input 
                              type="text" 
                              placeholder={`${social.id.charAt(0).toUpperCase() + social.id.slice(1)} URL`}
                              value={formData.socialLinks[social.id].url}
                              onChange={(e) => setFormData({
                                ...formData, 
                                socialLinks: {
                                  ...formData.socialLinks, 
                                  [social.id]: { ...formData.socialLinks[social.id], url: e.target.value }
                                }
                              })}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold dark:text-white focus:border-brand-500 outline-none transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleUpdate} disabled={loading}
                      className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'account' && (
                <motion.div key="account" {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm space-y-10">
                  <div className="space-y-8">
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">Account Settings</h2>
                    <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</span>
                        <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-black text-brand-600 border border-slate-100 dark:border-slate-800">Primary</span>
                      </div>
                      <p className="text-sm font-bold dark:text-white">{user?.email}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xs font-black dark:text-white uppercase tracking-widest">Security</h3>
                      <button className="flex items-center space-x-3 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-600 hover:border-brand-500 transition-all">
                        <Lock className="w-4 h-4" />
                        <span>Change Account Password</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'privacy' && (
                <motion.div key="privacy" {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm space-y-10">
                  <div className="space-y-8">
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">Privacy Controls</h2>
                    <div className="space-y-4">
                      {Object.keys(formData.privacy).map(field => (
                        <div key={field} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 group hover:border-brand-500/30 transition-all">
                          <div>
                            <h4 className="text-sm font-black dark:text-white uppercase mb-1">{field} Visibility</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Control who can view this information</p>
                          </div>
                          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                            {['PUBLIC', 'FOLLOWERS', 'PRIVATE'].map(level => (
                              <button 
                                key={level}
                                type="button" 
                                onClick={() => setFormData({...formData, privacy: {...formData.privacy, [field]: level}})}
                                className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                  formData.privacy[field] === level 
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleUpdate} disabled={loading}
                      className="px-10 py-4 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-500/20 hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Syncing...' : 'Update Privacy Settings'}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div key="appearance" {...fadeInUp} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm space-y-10">
                  <div className="space-y-8">
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">Appearance</h2>
                    <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
                          {isDark ? <Moon className="w-8 h-8 text-brand-600" /> : <Sun className="w-8 h-8 text-amber-500" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-black dark:text-white uppercase">Theme Selection</h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Switch between light and dark modes</p>
                        </div>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                      >
                        {isDark ? 'Switch to Light' : 'Switch to Dark'}
                      </button>
                    </div>
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

export default ProfileSettings;
