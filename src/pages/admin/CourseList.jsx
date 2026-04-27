import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Filter, MoreVertical, 
  Trash2, Edit3, Eye, Layers, Users, Zap
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses');
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course and all its lessons?')) return;
    try {
      await axios.delete(`/api/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Course Vault.</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-brand-600" /> Manage academy curriculum & student access
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/courses/new')}
          className="px-8 py-4 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-3"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Curriculum</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Level</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Access</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Lessons</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-none">
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-6">
                    <img src={course.thumbnail} alt="" className="w-16 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                    <div>
                      <h4 className="text-sm font-black dark:text-white tracking-tighter leading-none mb-1.5 uppercase">{course.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{course.level}</span>
                </td>
                <td className="px-8 py-8">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    course.accessPlan === 'elite' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                    course.accessPlan === 'prime' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {course.accessPlan}
                  </span>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400">
                    <Layers className="w-4 h-4" />
                    <span>{course.lessons?.length || 0} Lessons</span>
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-brand-600 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(course._id)}
                      className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {courses.length === 0 && !loading && (
          <div className="py-24 text-center">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No courses found in the vault</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseList;
