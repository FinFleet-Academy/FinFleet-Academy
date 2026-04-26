import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, FileText, Camera, Save, CheckCircle, 
  Shield, Star, Crown, Zap, Lock, Eye, EyeOff, Award, 
  ExternalLink, Users, ChevronRight, UserPlus, UserMinus,
  Linkedin, Twitter, Instagram
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
  const [certs, setCerts]       = useState([]);
  const [social, setSocial]     = useState({ followers: [], following: [] });
  const [loadingSocial, setLoadingSocial] = useState(false);

  useEffect(() => {
    if (user) {
      setCerts(user.certificates || []);
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

  const fadeInUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  return (
    <div className="py-12 md:py-24 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header (Premium Card) */}
        <div className="relative mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
              <div className="relative">
                <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-brand-600 to-indigo-600 p-1.5 shadow-2xl shadow-brand-500/20">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-[2.75rem] object-cover bg-white" />
                  ) : (
                    <div className="w-full h-full rounded-[2.75rem] bg-slate-900 flex items-center justify-center text-white text-4xl font-black">
                      {user?.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                  <div>
                    <h1 className="text-4xl font-black dark:text-white tracking-tighter mb-2">{user?.name}</h1>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">@{user?.username || 'finfleeter'}</p>
                  </div>
                  <div className="flex items-center justify-center md:justify-end space-x-3">
                    <Link to="/settings" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                      Edit Profile
                    </Link>
                    <Link to={`/user/${user?._id}`} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-brand-50 transition-all">
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                <p className="text-lg font-bold text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8 italic">
                  {user?.bio || "No biography provided yet. Master the markets with FinFleet Academy."}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  {user?.socialLinks?.linkedin?.url && (
                    <a href={user.socialLinks.linkedin.url} target="_blank" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:text-brand-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {user?.socialLinks?.twitter?.url && (
                    <a href={user.socialLinks.twitter.url} target="_blank" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:text-brand-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {user?.socialLinks?.instagram?.url && (
                    <a href={user.socialLinks.instagram.url} target="_blank" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:text-brand-600 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Identity & Stats */}
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Ecosystem Stats</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-3xl font-black dark:text-white mb-1">{social.followers?.length || 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Followers</p>
                </div>
                <div>
                  <p className="text-3xl font-black dark:text-white mb-1">{social.following?.length || 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Following</p>
                </div>
                <div>
                  <p className="text-3xl font-black dark:text-white mb-1">{certs.length || 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Certificates</p>
                </div>
                <div>
                  <p className="text-3xl font-black dark:text-white mb-1">0</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trades</p>
                </div>
              </div>
            </div>

            {/* Trading Identity Card */}
            <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-[50px] -mr-16 -mt-16" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-6 flex items-center">
                <Crown className="w-3 h-3 mr-2" />
                Trading Identity
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Skill Level</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-400">
                    {user?.skillLevel || 'Beginner'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verification</span>
                  <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <CheckCircle className="w-3 h-3 mr-1.5" /> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Member Since</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
                    {new Date(user?.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Network & Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black dark:text-white uppercase tracking-widest">Network Highlights</h2>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500">Following</button>
                  <button className="px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">Activity</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {social.following?.slice(0, 4).map(f => (
                  <div key={f._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl group border border-transparent hover:border-brand-500/20 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center font-black text-xs">
                        {f.name?.[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black dark:text-white uppercase tracking-tight leading-none mb-1">{f.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Community Member</span>
                      </div>
                    </div>
                    <Link to={`/user/${f._id}`} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  </div>
                ))}
                {(!social.following || social.following.length === 0) && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                    <Users className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Your network is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
