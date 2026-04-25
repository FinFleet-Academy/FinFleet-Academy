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

const ProfileSettings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    socialLinks: { 
      linkedin: { url: '', visibility: 'PUBLIC' }, 
      twitter: { url: '', visibility: 'PUBLIC' }, 
      instagram: { url: '', visibility: 'PUBLIC' },
      website: { url: '', visibility: 'PUBLIC' }
    },
    privacy: { email: 'PRIVATE', mobile: 'PRIVATE', stats: 'PUBLIC', certificates: 'PUBLIC' }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        socialLinks: user.socialLinks || { 
          linkedin: { url: '', visibility: 'PUBLIC' }, 
          twitter: { url: '', visibility: 'PUBLIC' }, 
          instagram: { url: '', visibility: 'PUBLIC' },
          website: { url: '', visibility: 'PUBLIC' }
        },
        privacy: user.privacy || { email: 'PRIVATE', mobile: 'PRIVATE', stats: 'PUBLIC', certificates: 'PUBLIC' }
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // URL Validation
      const validDomains = ['linkedin.com', 'x.com', 'twitter.com', 'instagram.com'];
      for (const platform of ['linkedin', 'twitter', 'instagram']) {
        const url = formData.socialLinks[platform].url;
        if (url && !validDomains.some(d => url.includes(d))) {
          throw new Error(`Invalid URL for ${platform}. Please use a valid domain.`);
        }
      }

      const res = await axios.put('/api/user/profile', formData);
      setUser(res.data);
      toast.success("Financial Identity Synchronized");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleSocialPrivacy = (platform) => {
    const levels = ['PUBLIC', 'FOLLOWERS', 'PRIVATE'];
    const current = formData.socialLinks[platform].visibility;
    const next = levels[(levels.indexOf(current) + 1) % levels.length];
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: { ...formData.socialLinks[platform], visibility: next }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 py-20 px-4 md:px-8 font-sans selection:bg-brand-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Identity Architecture</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Configure your external presence & privacy firewall</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          
          {/* 1. CORE IDENTITY */}
          <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-brand-500" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Public Identity</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Professional Name</label>
                  <input 
                    type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#020617] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-brand-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global Handle (@)</label>
                  <input 
                    type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-[#020617] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-brand-500 transition-all outline-none"
                  />
                </div>
             </div>
          </div>

          {/* 2. SOCIAL MEDIA SYNDICATION (GRANULAR) */}
          <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Social Syndication</h2>
             </div>

             <div className="space-y-6">
                {['linkedin', 'twitter', 'instagram'].map(platform => (
                  <div key={platform} className="p-8 bg-[#020617] border border-white/5 rounded-[2rem] space-y-6 group hover:border-brand-500/20 transition-all">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                           {platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-500" />}
                           {platform === 'twitter' && <Twitter className="w-5 h-5 text-slate-400" />}
                           {platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                           <span className="text-[10px] font-black uppercase tracking-widest text-white">{platform} Integration</span>
                        </div>
                        <button 
                          type="button" onClick={() => toggleSocialPrivacy(platform)}
                          className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                            formData.socialLinks[platform].visibility === 'PUBLIC' ? 'bg-emerald-500/10 text-emerald-500' :
                            formData.socialLinks[platform].visibility === 'FOLLOWERS' ? 'bg-brand-500/10 text-brand-500' :
                            'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {formData.socialLinks[platform].visibility}
                        </button>
                     </div>
                     <input 
                       type="url" 
                       placeholder={`https://${platform}.com/username`}
                       value={formData.socialLinks[platform].url}
                       onChange={(e) => setFormData({
                         ...formData, 
                         socialLinks: {
                           ...formData.socialLinks, 
                           [platform]: { ...formData.socialLinks[platform], url: e.target.value }
                         }
                       })}
                       className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-6 py-3 text-xs font-bold text-white focus:border-brand-500 outline-none transition-all"
                     />
                  </div>
                ))}
             </div>
          </div>

          {/* 3. GLOBAL PRIVACY FIREWALL */}
          <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-indigo-500" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Privacy Firewall</h2>
             </div>

             <div className="space-y-4">
                {Object.keys(formData.privacy).map(field => (
                  <div key={field} className="flex items-center justify-between p-6 bg-[#020617] border border-white/5 rounded-3xl group hover:border-brand-500/30 transition-all">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase mb-1">{field} Visibility</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Enforce access control for this field</p>
                    </div>
                    <button 
                      type="button" onClick={() => {
                        const levels = ['PUBLIC', 'FOLLOWERS', 'PRIVATE'];
                        const current = formData.privacy[field];
                        const next = levels[(levels.indexOf(current) + 1) % levels.length];
                        setFormData({...formData, privacy: {...formData.privacy, [field]: next}});
                      }}
                      className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        formData.privacy[field] === 'PUBLIC' ? 'bg-emerald-500/10 text-emerald-500' :
                        formData.privacy[field] === 'FOLLOWERS' ? 'bg-brand-500/10 text-brand-500' :
                        'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {formData.privacy[field]}
                    </button>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex items-center justify-end space-x-6 pt-8">
             <button 
               type="submit" disabled={loading}
               className="bg-white text-slate-950 px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center space-x-3 disabled:opacity-50"
             >
                {loading ? <div className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Synchronize Identity</span>
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
