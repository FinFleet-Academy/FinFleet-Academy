import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, PlayCircle, Star, Search, Filter, ArrowRight, ArrowLeft, Heart, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LikeButton from '../components/shared/LikeButton';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchData = async (page = 1) => {
    try {
      const [coursesRes, progressRes] = await Promise.all([
        axios.get('/api/courses', { params: { page, limit: 12 } }),
        axios.get('/api/courses/progress').catch(() => ({ data: [] }))
      ]);
      const { courses: fetchedCourses, page: currentPage, pages, total } = coursesRes.data;
      setCourses(fetchedCourses || coursesRes.data);
      setPagination({ page: currentPage, pages, total });
      setProgress(progressRes.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page);
  }, [pagination.page]);

  const handleToggleComplete = async (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login');
    try {
      await axios.post('/api/courses/progress', { courseId });
      toast.success('Progress updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const isCompleted = (courseId) => {
    return progress.some(p => (p.courseId?._id === courseId || p.courseId === courseId) && p.completed);
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-full mb-8 border border-brand-100 dark:border-brand-800"
          >
            <Star className="w-4 h-4 text-brand-600 animate-pulse" />
            <span className="text-[10px] font-black text-brand-700 dark:text-brand-300 uppercase tracking-widest">Premium Academy</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black dark:text-white mb-6 tracking-tight"
          >
            Master the <span className="text-gradient">Financial Markets</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium"
          >
            Join a community of 100+ learners. From core principles to advanced trading systems.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-16 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search courses, levels, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] pl-14 pr-6 py-5 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all dark:text-white text-sm font-medium shadow-sm"
            />
          </div>
          <div className="flex space-x-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest dark:text-white hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center"
                >
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold">No courses match your exploration.</p>
                </motion.div>
              ) : (
                filteredCourses.map((course) => (
                  <motion.div
                    key={course._id}
                    variants={item}
                    layout
                    className="card-premium group flex flex-col h-full !p-0 overflow-hidden"
                  >
                    {/* Course Header/Image */}
                    <Link to={`/courses/${course._id}`} className={`h-52 ${course.bg || 'bg-brand-100'} flex items-center justify-center relative overflow-hidden`}>
                      <BookOpen className={`w-24 h-24 ${course.color || 'text-brand-600'} opacity-10 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-700`} />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      
                      {/* Interaction Overlay */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        <button 
                          onClick={(e) => handleToggleComplete(e, course._id)}
                          className={`p-2.5 rounded-xl shadow-xl transition-all active:scale-90 ${isCompleted(course._id) ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-brand-600'}`}
                        >
                          {isCompleted(course._id) ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Course Badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[10px] font-black px-3 py-1.5 bg-black/60 backdrop-blur-md text-white rounded-lg uppercase tracking-[0.15em] border border-white/10">
                          {course.difficulty || 'Beginner'}
                        </span>
                      </div>
                    </Link>
                    
                    {/* Course Info */}
                    <div className="p-8 flex-grow flex flex-col">
                      <div className="flex items-center space-x-2 mb-6">
                         <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                         <span className="text-xs font-bold text-slate-400">4.9 (100+ learners)</span>
                      </div>
                      
                      <Link to={`/courses/${course._id}`}>
                        <h3 className="text-2xl font-black dark:text-white mb-3 group-hover:text-brand-600 transition-colors leading-tight">
                          {course.title}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 flex-grow leading-relaxed font-medium">
                        {course.description || "Master the core principles and advanced strategies in this comprehensive module."}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center space-x-3">
                          <LikeButton targetId={course._id} targetType="course" size="sm" />
                          <div className="flex items-center space-x-1 text-slate-400">
                             <MessageSquare className="w-4 h-4" />
                             <span className="text-xs font-bold">8</span>
                          </div>
                        </div>
                        
                        <Link to={`/courses/${course._id}`} className="flex items-center space-x-1 text-sm font-black text-brand-600 group-hover:translate-x-1 transition-transform">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="mt-20 flex flex-col items-center">
            <div className="flex items-center space-x-4">
              <button 
                disabled={pagination.page === 1}
                onClick={() => setPagination(p => ({...p, page: p.page - 1}))}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-500 transition-all shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </button>
              
              <div className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400">
                Page <span className="text-brand-600 mx-1">{pagination.page}</span> of {pagination.pages}
              </div>

              <button 
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-500 transition-all shadow-sm"
              >
                <ArrowRight className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Displaying {courses.length} of {pagination.total} premium courses
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
