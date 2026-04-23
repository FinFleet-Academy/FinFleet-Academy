import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, FileText, Camera, Save, CheckCircle, Shield, Star, Crown, Zap, Lock, Eye, EyeOff, Award, ExternalLink } from 'lucide-react';
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

// Privacy radio row
const PrivacyRow = ({ label, field, value, onChange, options = ['public', 'followers', 'private'] }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <span className="text-sm font-medium dark:text-white">{label}</span>
    <div className="flex items-center space-x-1">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(field, opt)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
            value === opt
              ? opt === 'public' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : opt === 'followers' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
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
  const [saving, setSaving]     = useState(false);
  const [savedPrivacy, setSavedPrivacy] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', mobile: user.mobile || '', bio: user.bio || '', profileImage: user.profileImage || '' });
      if (user.privacy) setPrivacy({ ...privacy, ...user.privacy });
      if (user.certificates) setCerts(user.certificates);
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name cannot be empty');
    setSaving(true);
    try {
      const { data } = await axios.put('/api/user/profile', form);
      if (setUser) setUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const handlePrivacyChange = (field, val) => {
    setPrivacy(prev => ({ ...prev, [field]: val }));
    setSavedPrivacy(false);
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      await axios.put('/api/user/privacy', { privacy });
      setSavedPrivacy(true);
      toast.success('Privacy settings saved!');
    } catch { toast.error('Failed to save privacy settings'); }
    finally { setSaving(false); }
  };

  const toggleCertVisibility = async (certId, current) => {
    try {
      const { data } = await axios.put('/api/user/certificate-visibility', { certId, isVisible: !current });
      setCerts(data.certificates);
    } catch { toast.error('Failed to update certificate'); }
  };

  const planInfo = PLAN_META[plan] || PLAN_META['FREE'];
  const PlanIcon = planInfo.icon;
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const tabs = [
    { id: 'edit', label: 'Edit Profile' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'certificates', label: 'Certificates' },
  ];

  return (
    <div className="py-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold dark:text-white">My Profile</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage your information, privacy, and certificates.</p>
            </div>
            <Link to={`/user/${user?._id}`} className="flex items-center space-x-2 text-sm text-brand-600 hover:text-brand-700 font-semibold">
              <ExternalLink className="w-4 h-4" />
              <span>View public profile</span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center shadow-sm">
              <div className="relative mb-4">
                {form.profileImage ? (
                  <img src={form.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-500/30" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 text-2xl font-bold">
                    {initials}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold dark:text-white">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Current Plan</p>
              <div className={`flex items-center space-x-3 p-3 rounded-xl ${planInfo.bg}`}>
                <PlanIcon className={`w-5 h-5 ${planInfo.color}`} />
                <span className={`font-bold ${planInfo.color}`}>{planInfo.label}</span>
              </div>
              <a href="/pricing" className="block mt-3 text-center text-xs font-bold text-brand-600 hover:text-brand-500">Upgrade →</a>
            </div>

            {/* Tab nav */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-b last:border-0 border-slate-100 dark:border-slate-800 ${
                    activeTab === t.id
                      ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right content */}
          <div className="md:col-span-2">

            {/* EDIT PROFILE */}
            {activeTab === 'edit' && (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold dark:text-white">Edit Information</h2>

                {[
                  { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name', required: true },
                  { name: 'mobile', label: 'Mobile Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
                  { name: 'profileImage', label: 'Profile Image URL', icon: Camera, type: 'url', placeholder: 'https://...' },
                ].map(f => (
                  <div key={f.name} className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{f.label}</label>
                    <div className="relative">
                      <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange}
                        placeholder={f.placeholder} required={f.required}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>
                  </div>
                ))}

                {/* Email read-only */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={user?.email || ''} readOnly className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-400 cursor-not-allowed" />
                  </div>
                  <p className="text-[10px] text-slate-400">Email cannot be changed.</p>
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Bio</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-4 w-4 h-4 text-slate-400" />
                    <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us a bit about yourself..." rows={3} maxLength={300}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition resize-none" />
                    <p className="text-[10px] text-slate-400 text-right mt-1">{form.bio.length}/300</p>
                  </div>
                </div>

                <button type="submit" disabled={saving} className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </form>
            )}

            {/* PRIVACY SETTINGS */}
            {activeTab === 'privacy' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold dark:text-white flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-brand-600" />
                    Privacy Settings
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Control who can see your information. All rules are enforced at the server level.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Basic Info</p>
                  <div className="bg-white dark:bg-slate-900 rounded-lg px-4">
                    <PrivacyRow label="Email address" field="email" value={privacy.email} onChange={handlePrivacyChange} />
                    <PrivacyRow label="Mobile number" field="mobile" value={privacy.mobile} onChange={handlePrivacyChange} />
                    <PrivacyRow label="Bio" field="bio" value={privacy.bio} onChange={handlePrivacyChange} />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Social</p>
                  <div className="bg-white dark:bg-slate-900 rounded-lg px-4">
                    <PrivacyRow label="Followers list" field="followersList" value={privacy.followersList} onChange={handlePrivacyChange} options={['public', 'private']} />
                    <PrivacyRow label="Following list" field="followingList" value={privacy.followingList} onChange={handlePrivacyChange} options={['public', 'private']} />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Certificates</p>
                  <div className="bg-white dark:bg-slate-900 rounded-lg px-4">
                    <PrivacyRow label="Certificate visibility" field="certificates" value={privacy.certificates} onChange={handlePrivacyChange} />
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-start space-x-2">
                  <Shield className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                  <span><strong>Followers only</strong> means only users who follow you can see that field. <strong>Private</strong> means no one else can see it, not even via the API.</span>
                </div>

                <button onClick={handleSavePrivacy} disabled={saving} className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors disabled:opacity-60">
                  {savedPrivacy ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : savedPrivacy ? 'Saved!' : 'Save Privacy Settings'}</span>
                </button>
              </div>
            )}

            {/* CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold dark:text-white flex items-center">
                    <Award className="w-5 h-5 mr-2 text-brand-600" />
                    My Certificates
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Toggle visibility for each certificate on your public profile.</p>
                </div>

                {certs.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No certificates yet. Complete courses to earn them!</p>
                    <Link to="/courses" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline">Browse Courses →</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {certs.map(cert => (
                      <div key={cert._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold dark:text-white">{cert.courseName}</p>
                            <p className="text-xs text-slate-400">{new Date(cert.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleCertVisibility(cert._id, cert.isVisible)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            cert.isVisible
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {cert.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{cert.isVisible ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
