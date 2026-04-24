import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, PlayCircle, CheckCircle2, 
  Circle, Lock, ExternalLink, Star, Share2, 
  MessageSquare, Clock, Trophy, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import CommentSection from '../components/shared/CommentSection';
import LikeButton from '../components/shared/LikeButton';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  let videoId = '';
  
  try {
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v');
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split(/[?#]/)[0];
    }
  } catch (e) {
    console.error("URL Parsing Error", e);
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { user, plan, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          axios.get(`/api/courses/${courseId}`),
          isAuthenticated ? axios.get('/api/courses/progress').catch(() => ({ data: [] })) : { data: [] },
        ]);
        setCourse(courseRes.data);
        const prog = progressRes.data.find(p => p.courseId?._id === courseId || p.courseId === courseId);
        setProgress(prog || null);
      } catch {
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, isAuthenticated]);

  const handleToggleComplete = async () => {
    if (!isAuthenticated) return toast.error("Please login to track progress");
    try {
      await axios.post('/api/courses/progress', { courseId });
      const res = await axios.get('/api/courses/progress');
      const prog = res.data.find(p => p.courseId?._id === courseId || p.courseId === courseId);
      setProgress(prog || null);
      toast.success(prog?.completed ? 'Lesson marked as complete!' : 'Progress reset');
    } catch { toast.error('Failed to update progress'); }
  };

  const isPremiumLocked = course?.isPremium && plan === 'FREE';
  const isCompleted = progress?.completed;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080C10]">
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080C10]">
      <div className="text-center">
        <h2 className="text-3xl font-black dark:text-white mb-4 uppercase tracking-tighter">Course Not Found</h2>
        <Link to="/courses" className="text-brand-600 font-black uppercase tracking-widest text-xs">← Back to Courses</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C10] pb-32 font-sans selection:bg-brand-500/20">
      
      {/* 1. Header Bar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/courses" className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-600 transition-colors">
               <ArrowLeft className="w-4 h-4 mr-2" />
               All Courses
            </Link>
            <div className="flex items-center space-x-6">
               <div className="hidden md:flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> 45m Session
               </div>
               <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-brand-50 transition-colors">
                  <Share2 className="w-4 h-4 text-slate-400" />
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

          {/* 2. COURSE HERO & META */}
          <div className="relative">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div className="max-w-2xl">
                   <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="text-[10px] font-black px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 rounded-full uppercase tracking-widest border border-brand-100 dark:border-brand-800">
                         {course.difficulty || 'All Levels'}
                      </span>
                      <span className="text-[10px] font-black px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full uppercase tracking-widest">
                         {course.category}
                      </span>
                   </div>
                   <h1 className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter leading-tight mb-6">
                      {course.title}
                   </h1>
                   <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {course.description}
                   </p>
                </div>
                
                <div className="flex-shrink-0">
                   <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center min-w-[200px]">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Your Progress</div>
                      <div className="relative w-24 h-24 mx-auto mb-6">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                            <motion.circle 
                              cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                              strokeDasharray="251.2" 
                              initial={{ strokeDashoffset: 251.2 }}
                              animate={{ strokeDashoffset: 251.2 - (isCompleted ? 1 : 0.5) * 251.2 }}
                              className="text-brand-600" 
                            />
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center">
                            {isCompleted ? <Trophy className="w-8 h-8 text-amber-500" /> : <PlayCircle className="w-8 h-8 text-brand-600" />}
                         </div>
                      </div>
                      <button 
                        onClick={handleToggleComplete}
                        className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'}`}>
                        {isCompleted ? 'Completed' : 'Mark as Complete'}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* 3. VIDEO SECTION */}
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition-opacity" />
             <div className="relative bg-black rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl border border-white/5">
                {isPremiumLocked ? (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-md p-10 text-center">
                      <Lock className="w-16 h-16 text-white mb-6 animate-pulse" />
                      <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Premium Plan Required</h3>
                      <p className="text-slate-400 text-sm font-bold mb-10 max-w-sm">This premium course is reserved for our Pro and Elite members. Upgrade your plan to unlock all lessons.</p>
                      <Link to="/pricing" className="px-12 py-5 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Upgrade Plan</Link>
                   </div>
                ) : course.videoUrl ? (
                  <iframe
                    src={getYouTubeEmbedUrl(course.videoUrl)}
                    title={course.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                     <BookOpen className="w-16 h-16 text-slate-700 mb-4" />
                     <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Text Only Lesson</p>
                  </div>
                )}
             </div>
             {!isPremiumLocked && course.videoUrl && (
                <div className="mt-4 flex items-center justify-between px-6">
                   <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Content</span>
                   </div>
                   <a href={course.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:underline flex items-center">
                      Watch on YouTube <ExternalLink className="w-3 h-3 ml-1.5" />
                   </a>
                </div>
             )}
          </div>

          {/* 4. CONTENT & DISCUSSION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-slate-100 dark:border-slate-800">
             <div className="lg:col-span-2 space-y-12">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                   <h2 className="text-2xl font-black dark:text-white uppercase tracking-widest mb-8">Lesson Notes</h2>
                   {course.content ? course.content.split('\n\n').map((para, i) => (
                     <p key={i} className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6 font-medium">
                        {para}
                     </p>
                   )) : (
                     <p className="text-slate-400 italic">No additional notes for this lesson.</p>
                   )}
                </div>

                <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex items-center space-x-4 mb-10">
                      <MessageSquare className="w-6 h-6 text-brand-600" />
                      <h3 className="text-xl font-black dark:text-white uppercase tracking-widest">Student Discussion</h3>
                   </div>
                   <CommentSection targetId={course._id} targetType="course" />
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Quick Actions</h3>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold dark:text-white">Like this Lesson</span>
                         <LikeButton targetId={course._id} targetType="course" size="md" />
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold dark:text-white">Status</span>
                         <div className="flex items-center space-x-2 text-emerald-500 text-xs font-black uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Live</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-8 -mt-8" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-6">Instructor's Note</h3>
                   <p className="text-slate-400 text-xs font-bold leading-relaxed">"Mastering this lesson is key to understanding how markets really work."</p>
                   <div className="mt-8 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xs text-brand-400">FF</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">FinFleet Academy Team</div>
                   </div>
                </div>
             </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
