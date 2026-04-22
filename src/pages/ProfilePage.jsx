import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, FileText, Camera, Save, CheckCircle, Shield, Star, Crown, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PLAN_META = {
  'FREE':       { icon: Shield, color: 'text-slate-500',  bg: 'bg-slate-100 dark:bg-slate-800',  label: 'Free'        },
  'PRO':        { icon: Zap,    color: 'text-blue-500',   bg: 'bg-blue-100 dark:bg-blue-900/30',  label: 'Pro'         },
  'ELITE':      { icon: Star,   color: 'text-brand-500',  bg: 'bg-brand-100 dark:bg-brand-900/30',label: 'Elite'       },
  'ELITE PRIME':{ icon: Crown,  color: 'text-amber-500',  bg: 'bg-amber-100 dark:bg-amber-900/30',label: 'Elite Prime' },
};

const ProfilePage = () => {
  const { user, plan, setUser } = useAuth();
  const [form, setForm]         = useState({ name: '', mobile: '', bio: '', profileImage: '' });
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name:         user.name         || '',
        mobile:       user.mobile       || '',
        bio:          user.bio          || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name cannot be empty');
    setSaving(true);
    try {
      const { data } = await axios.put('/api/user/profile', form);
      if (setUser) setUser(data);
      setSaved(true);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const planInfo = PLAN_META[plan] || PLAN_META['FREE'];
  const PlanIcon = planInfo.icon;

  const initials = (user?.name || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="py-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-extrabold dark:text-white">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and account settings.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left column — Avatar + Plan */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-1 space-y-6">

            {/* Avatar */}
            <div className="card-premium p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                {form.profileImage ? (
                  <img src={form.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-500/30" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-brand-500/20">
                    {initials}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-brand-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold dark:text-white">{user?.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>

            {/* Plan Badge */}
            <div className="card-premium p-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Current Plan</p>
              <div className={`flex items-center space-x-3 p-3 rounded-xl ${planInfo.bg}`}>
                <PlanIcon className={`w-5 h-5 ${planInfo.color}`} />
                <span className={`font-bold ${planInfo.color}`}>{planInfo.label}</span>
              </div>
              <a href="/pricing" className="block mt-4 text-center text-xs font-bold text-brand-600 hover:text-brand-500 transition-colors">
                Upgrade Plan →
              </a>
            </div>
          </motion.div>

          {/* Right column — Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="md:col-span-2">
            <form onSubmit={handleSubmit} className="card-premium p-8 space-y-6">
              <h2 className="text-xl font-bold dark:text-white mb-2">Edit Information</h2>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Email cannot be changed.</p>
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-4 w-4 h-4 text-slate-400" />
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                    maxLength={300}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition resize-none"
                  />
                  <p className="text-[10px] text-slate-400 text-right mt-1">{form.bio.length}/300</p>
                </div>
              </div>

              {/* Profile Image URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Profile Image URL</label>
                <div className="relative">
                  <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="profileImage"
                    type="url"
                    value={form.profileImage}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-lg shadow-brand-500/25 disabled:opacity-60"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
