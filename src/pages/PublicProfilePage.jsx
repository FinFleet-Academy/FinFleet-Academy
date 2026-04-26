import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, UserCheck, Users, BookOpen, Award, Lock, Mail, Phone,
  Calendar, Sparkles, ChevronRight, Shield, MessageCircle, Star, ExternalLink, ShieldCheck
} from 'lucide-react';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('achievements'); // achievements, followers, following

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/api/user/profile/${userId}`);
        setProfile(data);
      } catch (err) {
        toast.error('Profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!profile) return;
    setFollowLoading(true);
    try {
      if (profile.isFollowing) {
        await axios.delete(`/api/follow/${userId}`);
        setProfile(p => ({ ...p, isFollowing: false, followerCount: Math.max(0, p.followerCount - 1) }));
      } else {
        await axios.post(`/api/follow/${userId}`);
        setProfile(p => ({ ...p, isFollowing: true, followerCount: p.followerCount + 1 }));
        toast.success(`Following ${profile.name}`);
      }
    } catch { toast.error('Action failed'); }
    finally { setFollowLoading(false); }
  };

  const handleMessage = () => {
    if (!isAuthenticated) return navigate('/login');
    navigate('/chatbot', { state: { initialMode: 'private', initialPartner: profile } });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080C10]">
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080C10]">
      <div className="text-center">
        <h2 className="text-3xl font-black dark:text-white mb-4 uppercase tracking-tighter">Profile Not Found</h2>
        <Link to="/community" className="text-brand-600 font-black uppercase tracking-widest text-xs hover:underline">← Back to Community</Link>
      </div>
    </div>
  );

  const initials = profile.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const containerVars = {
    show: { transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={containerVars}
      className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] py-12 md:py-24 font-sans selection:bg-brand-500/20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* 1. PROFILE HEADER CARD */}
        <motion.div variants={itemVars} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          </div>
          
          <div className="px-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 mb-8 gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] border-8 border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{initials}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" title="Verified Trader" />
              </div>

              <div className="flex space-x-3">
                {!profile.isSelf ? (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`flex items-center space-x-2 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        profile.isFollowing
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20'
                      }`}
                    >
                      {profile.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      <span>{profile.isFollowing ? 'Following' : 'Follow'}</span>
                    </button>
                    {profile.isFollowing && (
                       <button onClick={handleMessage} className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl hover:scale-[1.05] transition-all">
                          <MessageCircle className="w-5 h-5" />
                       </button>
                    )}
                  </>
                ) : (
                  <Link to="/profile" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                    Configure Profile
                  </Link>
                )}
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-2">
                 <h1 className="text-3xl font-black dark:text-white tracking-tighter">{profile.name}</h1>
                 <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="text-[10px] font-black px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 rounded-full uppercase tracking-widest border border-brand-100 dark:border-brand-800">
                    {profile.plan || 'MEMBER'}
                 </span>
                 <span className="text-[10px] font-black px-3 py-1 bg-slate-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 rounded-full uppercase tracking-widest border border-slate-200 dark:border-slate-800">
                    {profile.skillLevel || 'Beginner'}
                 </span>
                 <span className="text-[10px] font-black px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-full uppercase tracking-widest">
                    Joined {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                 </span>
              </div>

              {profile.bio !== null ? (
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                  {profile.bio || "This user hasn't added a biography yet. They are likely busy mastering the markets."}
                </p>
              ) : (
                <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold mb-8 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl w-fit">
                   <Lock className="w-3.5 h-3.5" />
                   <span>Bio is restricted by privacy settings</span>
                </div>
              )}

              <div className="flex items-center space-x-12 py-6 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex flex-col">
                    <span className="text-2xl font-black dark:text-white">{profile.followerCount}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Followers</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-2xl font-black dark:text-white">{profile.followingCount}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Following</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-2xl font-black dark:text-white">{profile.certificates?.length || 0}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Certificates</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PROFILE TABS */}
        <div className="flex space-x-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-px">
          {['achievements', 'followers', 'following'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-brand-500 text-brand-600 dark:text-brand-500' 
                  : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 2. TAB CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* Left: Contact & Social */}
           <motion.div variants={itemVars} className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Verified Info</h3>
                 <div className="space-y-4">
                    {profile.email ? (
                       <div className="flex items-center space-x-3 text-sm font-bold dark:text-white">
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"><Mail className="w-4 h-4 text-slate-400" /></div>
                          <span className="truncate">{profile.email}</span>
                       </div>
                    ) : (
                       <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400">
                          <Lock className="w-3.5 h-3.5" /> <span>Email Restricted</span>
                       </div>
                    )}
                    {profile.mobile ? (
                       <div className="flex items-center space-x-3 text-sm font-bold dark:text-white">
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"><Phone className="w-4 h-4 text-slate-400" /></div>
                          <span>{profile.mobile}</span>
                       </div>
                    ) : (
                       <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400">
                          <Lock className="w-3.5 h-3.5" /> <span>Mobile Restricted</span>
                       </div>
                    )}
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-8 -mt-8" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-6 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Trust Rating
                 </h3>
                 <div className="text-2xl font-black mb-1">Top 5%</div>
                 <p className="text-slate-400 text-[10px] font-bold leading-relaxed">This learner consistently engages with community insights and completes modules.</p>
              </div>
           </motion.div>

           {/* Right: Tab Content */}
           <motion.div variants={itemVars} className="md:col-span-2 space-y-8">
              
              {activeTab === 'achievements' && (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-sm">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Platform Achievements</h3>
                      <Award className="w-5 h-5 text-brand-600" />
                   </div>

                   {profile.certificatesHidden ? (
                      <div className="py-12 text-center bg-slate-50 dark:bg-slate-950 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                         <Lock className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Achievements are set to private</p>
                      </div>
                   ) : profile.certificates?.length === 0 ? (
                      <div className="py-12 text-center opacity-40">
                         <p className="text-xs font-black uppercase tracking-widest">No certifications yet</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {profile.certificates.map((cert, i) => (
                            <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 group hover:border-brand-500/50 transition-all">
                               <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                  <Award className="w-5 h-5 text-brand-600" />
                               </div>
                               <h4 className="text-xs font-black dark:text-white uppercase tracking-tight line-clamp-1">{cert.courseName}</h4>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified · {new Date(cert.completedAt).toLocaleDateString()}</p>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
              )}

              {(activeTab === 'followers' || activeTab === 'following') && (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                     {activeTab === 'followers' ? 'Network Followers' : 'Network Following'}
                   </h3>
                   
                   {!profile[activeTab] ? (
                     <div className="py-12 text-center bg-slate-50 dark:bg-slate-950 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Lock className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network list is set to private</p>
                     </div>
                   ) : profile[activeTab].length === 0 ? (
                     <div className="py-12 text-center opacity-40">
                        <p className="text-xs font-black uppercase tracking-widest">No users found</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        {profile[activeTab].map(u => (
                          <div key={u._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-500/30 transition-all">
                             <Link to={`/user/${u._id}`} className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-brand-600 dark:text-white overflow-hidden">
                                  {u.profileImage ? <img src={u.profileImage} alt="" className="w-full h-full object-cover" /> : u.name[0]}
                                </div>
                                <div>
                                   <p className="text-xs font-black dark:text-white uppercase tracking-tight">{u.name}</p>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{u.plan || 'MEMBER'}</p>
                                </div>
                             </Link>
                             <button onClick={() => navigate('/chatbot', { state: { initialMode: 'private', initialPartner: u } })} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-600 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                             </button>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              )}

           </motion.div>


        </div>

      </div>
    </motion.div>
  );
};

export default PublicProfilePage;
