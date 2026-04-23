import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, PlayCircle, Star, Search, Filter, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const [coursesRes, progressRes] = await Promise.all([
        axios.get('/api/courses'),
        axios.get('/api/courses/progress')
      ]);
      setCourses(coursesRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleComplete = async (courseId) => {
    try {
      await axios.post('/api/courses/progress', { courseId });
      toast.success('Progress updated!');
      fetchData(); // Refresh to show completed state
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const isCompleted = (courseId) => {
    return progress.some(p => p.courseId._id === courseId && p.completed);
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-full mb-6"
          >
            <Star className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-bold text-brand-700 dark:text-brand-300 uppercase tracking-widest">Academy Curriculum</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black dark:text-white mb-6">
            Master the <span className="text-brand-600">Financial Markets</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Structured learning paths designed by industry experts to take you from beginner to professional trader.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses, levels, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex space-x-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold dark:text-white hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             [...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
             ))
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-500 italic">No courses found matching your search.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <motion.div
                key={course._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-premium group overflow-hidden flex flex-col h-full"
              >
                <div className={`h-48 ${course.bg || 'bg-brand-100'} flex items-center justify-center relative overflow-hidden`}>
                  <BookOpen className={`w-20 h-20 ${course.color || 'text-brand-600'} opacity-20 transform group-hover:scale-110 transition-transform duration-500`} />
                  <div className="absolute top-4 right-4">
                    {isCompleted(course._id) ? (
                      <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
                        <PlayCircle className="w-5 h-5 text-brand-600" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-[10px] font-bold py-1 px-2 border border-brand-100 dark:border-brand-800 text-brand-600 rounded-md uppercase tracking-widest">
                      Trading
                    </span>
                    <span className="text-[10px] font-bold py-1 px-2 border border-slate-100 dark:border-slate-800 text-slate-500 rounded-md uppercase tracking-widest">
                      Beginner
                    </span>
                  </div>
                  
                  <Link to={`/courses/${course._id}`}>
                    <h3 className="text-xl font-bold dark:text-white mb-3 group-hover:text-brand-600 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 flex-grow">
                    {course.description || "Master the core principles and advanced strategies in this comprehensive module."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => handleToggleComplete(course._id)}
                      className={`flex items-center space-x-2 text-sm font-bold transition-colors ${isCompleted(course._id) ? 'text-emerald-500' : 'text-slate-400 hover:text-brand-600'}`}
                    >
                      {isCompleted(course._id) ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      <span>{isCompleted(course._id) ? 'Completed' : 'Mark Complete'}</span>
                    </button>
                    
                    <Link to={`/courses/${course._id}`} className="flex items-center space-x-1 text-sm font-bold text-brand-600 group-hover:underline">
                      <span>Start Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
