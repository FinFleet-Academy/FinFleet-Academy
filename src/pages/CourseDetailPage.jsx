import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, PlayCircle, CheckCircle2, Circle, Lock, ExternalLink, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import CommentSection from '../components/shared/CommentSection';
import LikeButton from '../components/shared/LikeButton';

const difficultyColors = {
  Beginner:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Advanced:     'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
};

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { user, plan } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          axios.get(`/api/courses/${courseId}`),
          axios.get('/api/courses/progress').catch(() => ({ data: [] })),
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
  }, [courseId]);

  const handleToggleComplete = async () => {
    try {
      await axios.post('/api/courses/progress', { courseId });
      // Re-fetch progress
      const res = await axios.get('/api/courses/progress');
      const prog = res.data.find(p => p.courseId?._id === courseId || p.courseId === courseId);
      setProgress(prog || null);
      toast.success(prog?.completed ? 'Marked complete!' : 'Marked incomplete');
    } catch { toast.error('Failed to update progress'); }
  };

  const isPremiumLocked = course?.isPremium && plan === 'FREE';
  const isCompleted = progress?.completed;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-3">Course not found</h2>
        <Link to="/courses" className="text-brand-600 hover:underline text-sm">← Back to Courses</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <Link to="/courses" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Hero card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Cover */}
            <div className={`h-48 ${course.bg || 'bg-brand-100'} flex items-center justify-center relative`}>
              <BookOpen className={`w-24 h-24 ${course.color || 'text-brand-600'} opacity-15`} />
              {isCompleted && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </div>
              )}
            </div>

            <div className="p-8">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${difficultyColors[course.difficulty] || difficultyColors.Beginner}`}>
                  {course.difficulty}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {course.category}
                </span>
                {course.isPremium && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" /> Premium
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold dark:text-white mb-3">{course.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{course.description}</p>

              {/* Action row */}
              <div className="flex items-center flex-wrap gap-3">
                <LikeButton targetId={course._id} targetType="course" size="md" />
                <button
                  onClick={handleToggleComplete}
                  disabled={isPremiumLocked}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : isPremiumLocked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isPremiumLocked ? <Lock className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  <span>{isCompleted ? 'Completed' : isPremiumLocked ? 'Upgrade to Access' : 'Mark as Complete'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {isPremiumLocked ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm">
              <Lock className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">Premium Content</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">This course is available for Pro and Elite subscribers. Upgrade your plan to unlock full access.</p>
              <Link to="/pricing" className="inline-flex items-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-colors">
                Upgrade Plan →
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-xl font-bold dark:text-white mb-6">Course Content</h2>

              {/* Video */}
              {course.videoUrl && (
                <div className="mb-8">
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
                    <iframe
                      src={course.videoUrl.replace('watch?v=', 'embed/')}
                      title={course.title}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                  <a href={course.videoUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-xs text-slate-400 hover:text-brand-600 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open on YouTube
                  </a>
                </div>
              )}

              {/* Text content */}
              {course.content && (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {course.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Comments Section */}
              <CommentSection targetId={course._id} targetType="course" />
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
