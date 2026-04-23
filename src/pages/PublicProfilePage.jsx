import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  UserPlus, UserCheck, Users, BookOpen, Award, Lock, Mail, Phone,
  Calendar, Sparkles, ChevronRight, Shield
} from 'lucide-react';

const badgeColors = {
  beginner:     'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced:     'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  expert:       'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const PrivacyLock = ({ label }) => (
  <div className="flex items-center space-x-2 text-slate-400 text-sm">
    <Lock className="w-4 h-4" />
    <span>{label} is private</span>
  </div>
);

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

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
    if (!profile) return;
    setFollowLoading(true);
    try {
      if (profile.isFollowing) {
        await axios.delete(`/api/follow/${userId}`);
        setProfile(p => ({ ...p, isFollowing: false, followerCount: p.followerCount - 1 }));
      } else {
        await axios.post(`/api/follow/${userId}`);
        setProfile(p => ({ ...p, isFollowing: true, followerCount: p.followerCount + 1 }));
      }
    } catch { toast.error('Action failed'); }
    finally { setFollowLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-2">Profile Not Found</h2>
        <Link to="/community" className="text-brand-600 hover:underline text-sm">← Back to Community</Link>
      </div>
    </div>
  );

  const initials = profile.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-violet-900 via-brand-900 to-slate-900" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-900 bg-brand-100 dark:bg-brand-900/30 text-brand-600 font-extrabold text-2xl flex items-center justify-center shadow-md overflow-hidden">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              {!profile.isSelf && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    profile.isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {profile.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{profile.isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              )}
              {profile.isSelf && (
                <Link to="/profile" className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors">
                  Edit Profile
                </Link>
              )}
            </div>

            <h1 className="text-2xl font-bold dark:text-white">{profile.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 font-semibold rounded-full capitalize">
                {profile.plan?.toLowerCase()} member
              </span>
              <span className="text-xs text-slate-400">
                Joined {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center space-x-6 mt-5 py-4 border-y border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <div className="text-xl font-bold dark:text-white">{profile.followerCount}</div>
                <div className="text-xs text-slate-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold dark:text-white">{profile.followingCount}</div>
                <div className="text-xs text-slate-500">Following</div>
              </div>
              {profile.certificates && (
                <div className="text-center">
                  <div className="text-xl font-bold dark:text-white">{profile.certificates.length}</div>
                  <div className="text-xs text-slate-500">Certificates</div>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="mt-4 space-y-2">
              {profile.bio !== null ? (
                profile.bio ? (
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{profile.bio}</p>
                ) : null
              ) : (
                <PrivacyLock label="Bio" />
              )}
              {profile.email !== null ? (
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
              ) : null}
              {profile.mobile !== null ? (
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Phone className="w-4 h-4" />
                  <span>{profile.mobile}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h2 className="font-bold text-lg dark:text-white flex items-center mb-5">
            <Award className="w-5 h-5 mr-2 text-brand-600" />
            Certificates
          </h2>
          {profile.certificatesHidden ? (
            <div className="flex items-center space-x-2 text-slate-400 text-sm py-4">
              <Shield className="w-5 h-5" />
              <span>This user's certificates are private.</span>
            </div>
          ) : profile.certificates?.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No certificates earned yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.certificates.map((cert, i) => (
                <div key={i} className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold dark:text-white">{cert.courseName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(cert.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <span className={`mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColors[cert.badge] || badgeColors.beginner}`}>
                      {cert.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Followers / Following */}
        {profile.followers && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="font-bold text-lg dark:text-white flex items-center mb-5">
              <Users className="w-5 h-5 mr-2 text-brand-600" />
              Followers
            </h2>
            {profile.followers.length === 0 ? (
              <p className="text-slate-400 text-sm">No followers yet.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile.followers.slice(0, 12).map(f => (
                  <Link key={f._id} to={`/user/${f._id}`} className="flex items-center space-x-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-brand-500/50 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 font-bold text-xs flex items-center justify-center">
                      {f.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs font-medium dark:text-white">{f.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PublicProfilePage;
