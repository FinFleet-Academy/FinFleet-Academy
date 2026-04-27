import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Linkedin, Twitter, Instagram, Globe, 
  Shield, Award, Users, Activity, 
  MapPin, Calendar, Link as LinkIcon, 
  CheckCircle, Plus, UserPlus, UserMinus,
  ArrowLeft, Settings, Share2, MoreHorizontal
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/profile/${username}`);
      setData(res.data.profile);
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      toast.error("Profile not found");
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) return navigate('/login');
    try {
      if (isFollowing) {
        await axios.post(`/api/follow/unfollow/${data._id}`);
        setIsFollowing(false);
      } else {
        await axios.post(`/api/follow/follow/${data._id}`);
        setIsFollowing(true);
      }
    } catch (err) {
      toast.error("Social operation failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  const isOwnProfile = currentUser?._id === data._id;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-brand-500/30">
      
      {/* 1. BLUETOOTH HERO SECTION */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-[#020617] z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974717535-7c446a0594ca?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 blur-sm scale-105" />
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 z-20 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-32 relative z-30">
        
        {/* 2. PROFILE CORE CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-8 pb-20">
          
          {/* Sidebar: Identity & Stats */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16" />
              
              {/* Avatar */}
              <div className="relative group mb-8">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl relative z-10">
                  <img 
                    src={data.profileImage || `https://ui-avatars.com/api/?name=${data.name}&background=6366f1&color=fff`} 
                    className="w-full h-full object-cover" 
                    alt={data.name} 
                  />
                </div>
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 z-20 w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>

              {/* Name & Bio */}
              <div className="space-y-2 mb-8">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black text-white tracking-tighter uppercase">{data.name}</h1>
                  <div className="flex items-center space-x-1.5">
                    {data.plan === 'PRO' && (
                      <div className="group/badge relative">
                        <Shield className="w-4 h-4 text-brand-500" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-brand-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap z-50">Pro Elite</div>
                      </div>
                    )}
                    <div className="group/badge relative">
                      <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap z-50">Verified Trader</div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">@{data.username || 'finfleet_user'}</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed pt-2 italic line-clamp-3">
                  {data.bio || "No professional bio provided."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 mb-10">
                {isOwnProfile ? (
                  <button 
                    onClick={() => navigate('/settings/profile')}
                    className="w-full py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-slate-200 transition-colors shadow-lg"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleFollowToggle}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-lg ${
                      isFollowing 
                        ? 'bg-slate-800 text-white border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500' 
                        : 'bg-brand-600 text-white hover:bg-brand-500'
                    }`}
                  >
                    {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{isFollowing ? 'Following' : 'Follow User'}</span>
                  </button>
                )}
              </div>

              {/* Social Links */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Social Channels</p>
                <div className="flex flex-wrap gap-3">
                  {data.socialLinks?.linkedin && <a href={data.socialLinks.linkedin} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-brand-500/20 hover:text-brand-500 transition-all"><Linkedin className="w-4 h-4" /></a>}
                  {data.socialLinks?.twitter && <a href={data.socialLinks.twitter} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-brand-500/20 hover:text-brand-500 transition-all"><Twitter className="w-4 h-4" /></a>}
                  {data.socialLinks?.website && <a href={data.socialLinks.website} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-brand-500/20 hover:text-brand-500 transition-all"><Globe className="w-4 h-4" /></a>}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 text-center group hover:border-brand-500/30 transition-all">
                  <p className="text-2xl font-black text-white group-hover:text-brand-500 transition-colors">{data.stats?.followers || 0}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Followers</p>
               </div>
               <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 text-center group hover:border-indigo-500/30 transition-all">
                  <p className="text-2xl font-black text-white group-hover:text-indigo-500 transition-colors">{data.stats?.following || 0}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Following</p>
               </div>
               <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 text-center group hover:border-emerald-500/30 transition-all">
                  <p className="text-2xl font-black text-white group-hover:text-emerald-500 transition-colors">{data.stats?.coursesCompleted || 0}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Courses</p>
               </div>
               <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 text-center group hover:border-amber-500/30 transition-all">
                  <p className="text-2xl font-black text-white group-hover:text-amber-500 transition-colors">Elite</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Activity</p>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-8">
            
            {/* Credentials Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tighter uppercase">Verifiable Credentials</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Academic & Professional Certificates</p>
                  </div>
                </div>
                {isOwnProfile && (
                  <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-colors">
                    Upload New
                  </button>
                )}
              </div>

              {data.privacy?.certificates === 'PRIVATE' && !isOwnProfile ? (
                 <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                    <Shield className="w-12 h-12 text-slate-800" />
                    <p className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">Restricted Visibility</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mock Certificates for Bloomberg Visuals */}
                  {[1, 2].map(i => (
                    <div key={i} className="group relative bg-[#020617] border border-white/5 rounded-3xl p-6 hover:border-brand-500/50 transition-all cursor-pointer overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="flex items-start justify-between relative z-10">
                          <div>
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                               <Award className="w-5 h-5 text-brand-500" />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase mb-1">Financial Intelligence v2.0</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Issued by FinFleet Academy</p>
                          </div>
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                       </div>
                       <div className="mt-8 flex items-center justify-between relative z-10">
                          <span className="text-[9px] font-black text-slate-700 uppercase">ID: FF-2024-00{i}</span>
                          <span className="text-[9px] font-black text-brand-500 uppercase">Verifiable</span>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Network / Activity Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10"
            >
               <div className="flex items-center space-x-4 mb-10">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tighter uppercase">Neural Activity</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Feed & Engagement</p>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-[#020617]/50 rounded-[2rem] border border-white/5">
                      <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-8 h-8 text-slate-800" />
                      </div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Social Activity coming soon to identity layer</p>
                   </div>
                </div>
            </motion.div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
