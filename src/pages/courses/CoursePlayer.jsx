import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, FileText, HelpCircle, Bot, CheckCircle, 
  ChevronLeft, ChevronRight, Lock, PlayCircle,
  Menu, X, ArrowRight, Star, Clock, Award, Zap
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('video');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [quizScore, setQuizScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await axios.get(`/api/courses/${courseId}`);
      setCourse(data);
      if (data.lessons?.length > 0) {
        // Load last watched or first lesson
        const lastId = data.enrollment?.lastWatchedLesson;
        const initialLesson = data.lessons.find(l => l._id === lastId) || data.lessons[0];
        loadLessonContent(initialLesson._id);
      }
    } catch (err) {
      toast.error('Failed to load course');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const loadLessonContent = async (lessonId) => {
    try {
      const { data } = await axios.get(`/api/courses/lesson/${lessonId}`);
      setActiveLesson(data);
      setActiveTab('video');
      setQuizScore(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access Denied');
    }
  };

  const markCompleted = async () => {
    if (!activeLesson) return;
    try {
      await axios.put(`/api/courses/${courseId}/progress`, { lessonId: activeLesson._id });
      setCourse(prev => ({
        ...prev,
        enrollment: {
          ...prev.enrollment,
          completedLessons: [...(prev.enrollment?.completedLessons || []), activeLesson._id]
        }
      }));
      toast.success('Lesson completed!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuizSubmit = (score) => {
    setQuizScore(score);
    // Optionally save score to DB here
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading Academy...</div>;
  if (!course) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#080C10] overflow-hidden font-sans">
      
      {/* 1. Progress Sidebar (Left) */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 380 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col relative z-20"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <div>
              <h1 className="text-sm font-black dark:text-white uppercase tracking-tighter leading-tight line-clamp-1">{course.title}</h1>
              <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(course.enrollment?.completedLessons?.length / course.lessons?.length) * 100}%` }}
                   className="h-full bg-brand-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                 />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
                {course.enrollment?.completedLessons?.length || 0} / {course.lessons?.length} Completed
              </p>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
           {course.lessons?.map((l, idx) => {
             const isCompleted = course.enrollment?.completedLessons?.includes(l._id);
             const isActive = activeLesson?._id === l._id;
             const isLocked = !l.isFreePreview && !course.enrollment;

             return (
               <button
                 key={l._id}
                 disabled={isLocked}
                 onClick={() => loadLessonContent(l._id)}
                 className={`w-full flex items-center space-x-4 p-5 rounded-3xl transition-all text-left relative group ${
                   isActive ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 
                   isLocked ? 'opacity-50 grayscale cursor-not-allowed' :
                   'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                 }`}
               >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isActive ? 'bg-white/20 border-white/20 text-white' : 
                    isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400'
                  }`}>
                     {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-[11px] font-black uppercase tracking-tight truncate">{l.title}</h4>
                     <div className="flex items-center space-x-3 mt-1 opacity-60">
                        <span className="text-[9px] font-bold uppercase tracking-widest">{l.duration}</span>
                        {isLocked && <Lock className="w-3 h-3" />}
                     </div>
                  </div>
                  {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
               </button>
             );
           })}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
           <button 
             onClick={() => navigate('/courses')}
             className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors flex items-center justify-center space-x-2"
           >
              <ChevronLeft className="w-4 h-4" />
              <span>Exit Course</span>
           </button>
        </div>
      </motion.aside>

      {/* 2. Main Player Area (Right) */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shrink-0">
           {!sidebarOpen && (
             <button onClick={() => setSidebarOpen(true)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-brand-600 transition-all">
                <Menu className="w-5 h-5" />
             </button>
           )}
           <div className="flex-1 px-6">
              <h2 className="text-xs font-black dark:text-white uppercase tracking-[0.2em]">{activeLesson?.title}</h2>
           </div>
           <div className="flex items-center space-x-4">
              <button 
                onClick={markCompleted}
                className="px-6 py-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center space-x-2"
              >
                 <CheckCircle className="w-4 h-4" />
                 <span>Mark Complete</span>
              </button>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12">
           <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Media Section */}
              <div className="aspect-video bg-black rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white dark:border-slate-900 relative">
                 <iframe 
                   src={activeLesson?.videoUrl}
                   className="w-full h-full"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 />
              </div>

              {/* Tabs Section */}
              <div className="space-y-8">
                 <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit mx-auto">
                    <TabButton active={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={Play} label="Lecture" />
                    {activeLesson?.notes && <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={FileText} label="Notes" />}
                    {activeLesson?.hasQuiz && <TabButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={HelpCircle} label="Quiz" />}
                    {activeLesson?.aiSummary && <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={Bot} label="AI Insights" />}
                 </div>

                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 lg:p-16 border border-slate-100 dark:border-slate-800 shadow-sm min-h-[400px]"
                    >
                       {activeTab === 'video' && (
                         <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                               <div className="p-3 bg-brand-600 rounded-2xl text-white">
                                  <Play className="w-5 h-5 fill-current" />
                               </div>
                               <div>
                                  <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Lesson Overview</h3>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Foundational concepts and live chart examples</p>
                               </div>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                               This lesson covers the core principles of {activeLesson?.title}. Follow along with the chart examples and ensure you take notes in the next tab.
                            </p>
                         </div>
                       )}

                       {activeTab === 'notes' && (
                         <div className="prose prose-slate dark:prose-invert max-w-none prose-sm lg:prose-base font-medium leading-relaxed" 
                              dangerouslySetInnerHTML={{ __html: activeLesson.notes }} 
                         />
                       )}

                       {activeTab === 'quiz' && (
                         <LessonQuiz quiz={activeLesson.quiz} onComplete={handleQuizSubmit} currentScore={quizScore} />
                       )}

                       {activeTab === 'summary' && (
                         <div className="space-y-8">
                            <div className="flex items-center space-x-4 text-brand-600">
                               <Bot className="w-8 h-8" />
                               <h3 className="text-lg font-black uppercase tracking-tighter">Finor AI: Lesson Synthesis</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Core Takeaways</h4>
                                  <p className="text-sm font-bold leading-relaxed dark:text-slate-300">
                                     {activeLesson.aiSummary}
                                  </p>
                               </div>
                               <div className="space-y-4">
                                  <div className="p-6 bg-brand-500/5 rounded-2xl border border-brand-500/10 flex items-center space-x-4">
                                     <Zap className="w-5 h-5 text-brand-600" />
                                     <p className="text-[10px] font-black uppercase tracking-tight">Focus on Volume Divergence</p>
                                  </div>
                                  <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center space-x-4">
                                     <Award className="w-5 h-5 text-emerald-600" />
                                     <p className="text-[10px] font-black uppercase tracking-tight">Highly Actionable Strategy</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                       )}
                    </motion.div>
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-3 px-6 py-3.5 rounded-[1.25rem] transition-all text-[10px] font-black uppercase tracking-widest ${
      active 
      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg' 
      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
     <Icon className="w-4 h-4" />
     <span>{label}</span>
  </button>
);

const LessonQuiz = ({ quiz, onComplete, currentScore }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (currentScore !== null || submitted) {
    const score = currentScore || 0;
    return (
      <div className="text-center py-10 space-y-6">
         <div className="w-24 h-24 bg-brand-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-brand-600/30">
            <Award className="w-12 h-12 text-white" />
         </div>
         <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Quiz Complete!</h3>
         <p className="text-4xl font-black text-brand-600">{score}%</p>
         <button 
           onClick={() => { setSubmitted(false); setAnswers({}); onComplete(null); }}
           className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest"
         >
           Retake Quiz
         </button>
      </div>
    );
  }

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    const finalScore = Math.round((correct / quiz.length) * 100);
    setSubmitted(true);
    onComplete(finalScore);
  };

  return (
    <div className="space-y-12">
       <div className="flex items-center justify-between">
          <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Knowledge Assessment</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quiz.length} Questions</span>
       </div>
       <div className="space-y-10">
          {quiz.map((q, qIdx) => (
            <div key={qIdx} className="space-y-6">
               <p className="text-sm font-black dark:text-white leading-relaxed">
                  <span className="text-brand-600 mr-2">Q{qIdx + 1}.</span>
                  {q.question}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setAnswers({...answers, [qIdx]: opt})}
                      className={`p-6 rounded-2xl text-left text-[11px] font-bold transition-all border ${
                        answers[qIdx] === opt 
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xl shadow-brand-600/20' 
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-brand-500'
                      }`}
                    >
                       {opt}
                    </button>
                  ))}
               </div>
            </div>
          ))}
       </div>
       <button 
         onClick={handleSubmit}
         className="w-full py-6 bg-brand-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-600/20 hover:scale-[1.01] transition-all"
       >
         Finalize Submission
       </button>
    </div>
  );
};

export default CoursePlayer;
