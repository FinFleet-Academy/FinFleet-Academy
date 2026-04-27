import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Video, FileText, HelpCircle, Bot, Save, Trash2, 
  ChevronDown, ChevronUp, Image as ImageIcon, Layout,
  Layers, Zap, Shield, PlayCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminCourseCreator = () => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: 'Trading',
    level: 'Beginner',
    accessPlan: 'free'
  });

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddLesson = () => {
    setLessons([...lessons, {
      title: '',
      videoUrl: '',
      duration: '',
      notes: '',
      aiSummary: '',
      hasQuiz: false,
      quiz: [],
      order: lessons.length + 1,
      isExpanded: true
    }]);
  };

  const updateLesson = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const handleSaveCourse = async () => {
    if (!course.title || !course.thumbnail) return toast.error('Course title and thumbnail are required');
    
    setLoading(true);
    try {
      // 1. Create Course Meta
      const { data: createdCourse } = await axios.post('/api/courses', course);
      
      // 2. Create Lessons
      const lessonPromises = lessons.map(lesson => 
        axios.post(`/api/courses/${createdCourse._id}/lessons`, lesson)
      );
      await Promise.all(lessonPromises);

      toast.success('Course published successfully!');
      // Reset or redirect
    } catch (err) {
      toast.error('Failed to publish course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-32">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-2 uppercase">Architect Academy.</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
            <Layers className="w-4 h-4 mr-2 text-brand-600" /> Build high-conversion structured courses
          </p>
        </div>
        <button 
          onClick={handleSaveCourse}
          disabled={loading}
          className="px-10 py-5 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-3 disabled:opacity-50"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Publish Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Meta Data */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Course Identity</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                <input 
                  type="text" 
                  value={course.title}
                  onChange={e => setCourse({...course, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                  placeholder="Mastering Price Action"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                <textarea 
                  value={course.description}
                  onChange={e => setCourse({...course, description: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-brand-500 transition-all h-32 resize-none"
                  placeholder="The definitive guide to reading charts..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Thumbnail URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={course.thumbnail}
                    onChange={e => setCourse({...course, thumbnail: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Level</label>
                    <select 
                      value={course.level}
                      onChange={e => setCourse({...course, level: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-sm font-bold outline-none cursor-pointer"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Pro</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Access</label>
                    <select 
                      value={course.accessPlan}
                      onChange={e => setCourse({...course, accessPlan: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-sm font-bold outline-none cursor-pointer"
                    >
                      <option value="free">Free</option>
                      <option value="prime">Prime</option>
                      <option value="elite">Elite</option>
                    </select>
                 </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Lesson Builder */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-6">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Curriculum Builder</h3>
             <button 
               onClick={handleAddLesson}
               className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700"
             >
                <Plus className="w-4 h-4" />
                <span>Add Lesson</span>
             </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {lessons.map((lesson, idx) => (
                <LessonEditor 
                  key={idx} 
                  lesson={lesson} 
                  index={idx}
                  onChange={(field, val) => updateLesson(idx, field, val)}
                  onRemove={() => setLessons(lessons.filter((_, i) => i !== idx))}
                />
              ))}
            </AnimatePresence>

            {lessons.length === 0 && (
              <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                 <PlayCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No lessons added yet</p>
                 <button 
                   onClick={handleAddLesson}
                   className="mt-6 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-brand-500 transition-colors"
                 >
                   Create First Lesson
                 </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const LessonEditor = ({ lesson, index, onChange, onRemove }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 cursor-pointer" onClick={() => onChange('isExpanded', !lesson.isExpanded)}>
         <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
               {index + 1}
            </div>
            <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">
               {lesson.title || 'Untitled Lesson'}
            </h4>
         </div>
         <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-3 text-slate-300 hover:text-red-500 transition-colors"
            >
               <Trash2 className="w-4 h-4" />
            </button>
            {lesson.isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
         </div>
      </div>

      <AnimatePresence>
        {lesson.isExpanded && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Lesson Title</label>
                    <input 
                      type="text" 
                      value={lesson.title}
                      onChange={e => onChange('title', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                      placeholder="e.g., Intro to Candle Patterns"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Video URL (YT/Direct)</label>
                    <div className="relative">
                      <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={lesson.videoUrl}
                        onChange={e => onChange('videoUrl', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center space-x-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">Features</span>
                     <div className="flex items-center space-x-4">
                        <FeatureToggle icon={FileText} label="Notes" active={!!lesson.notes} />
                        <FeatureToggle icon={HelpCircle} label="Quiz" active={lesson.hasQuiz} onClick={() => onChange('hasQuiz', !lesson.hasQuiz)} />
                        <FeatureToggle icon={Bot} label="AI Summary" active={!!lesson.aiSummary} />
                     </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Lesson Notes (Rich Text / HTML)</label>
                    <textarea 
                      value={lesson.notes}
                      onChange={e => onChange('notes', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl px-6 py-4 text-sm font-bold outline-none focus:border-brand-500 transition-all h-48 resize-none font-mono"
                      placeholder="<p>Enter lesson content here...</p>"
                    />
                  </div>

                  {lesson.hasQuiz && (
                    <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lesson Quiz Builder</h5>
                       {/* Simplified Quiz Builder for Demo */}
                       <p className="text-[9px] font-bold text-slate-400">Add questions in JSON format or use the advanced builder in next step.</p>
                       <textarea 
                         value={JSON.stringify(lesson.quiz, null, 2)}
                         onChange={e => {
                           try {
                             onChange('quiz', JSON.parse(e.target.value));
                           } catch(e) {}
                         }}
                         className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-[11px] font-mono outline-none h-40"
                         placeholder='[{"question": "What is RSI?", "options": ["A", "B"], "correctAnswer": "A"}]'
                       />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">AI Summary (Generated or Manual)</label>
                    <textarea 
                      value={lesson.aiSummary}
                      onChange={e => onChange('aiSummary', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl px-6 py-4 text-sm font-bold outline-none focus:border-brand-500 transition-all h-24 resize-none"
                      placeholder="Key takeaways from this lesson..."
                    />
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FeatureToggle = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all border ${active ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'}`}
  >
     <Icon className="w-3 h-3" />
     <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default AdminCourseCreator;
