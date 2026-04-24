import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Award, CheckCircle, Target, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const QuizPage = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data } = await axios.get('/api/quizzes');
      setQuizzes(data);
    } catch {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setAnswers({});
    setResult(null);
  };

  const submitQuiz = async () => {
    const formattedAnswers = activeQuiz.questions.map((_, i) => answers[i] ?? -1);
    try {
      const { data } = await axios.post(`/api/quizzes/submit/${activeQuiz._id}`, { answers: formattedAnswers });
      setResult(data);
      if (data.passed) {
        toast.success(`Quiz Passed! +${data.earnedPoints} Skill Points`);
      } else {
        toast.error('Quiz Failed. Better luck next time!');
      }
    } catch {
      toast.error('Failed to submit quiz');
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  if (activeQuiz && !result) {
    const q = activeQuiz.questions[currentQIndex];
    const isLast = currentQIndex === activeQuiz.questions.length - 1;
    const progress = ((currentQIndex) / activeQuiz.questions.length) * 100;

    return (
      <div className="bg-[#020617] min-h-[calc(100vh-64px)] py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">{activeQuiz.title}</h2>
            <button onClick={() => setActiveQuiz(null)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-1.5 mb-10 overflow-hidden">
            <div className="bg-brand-500 h-1.5 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <motion.div key={currentQIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-400 text-[10px] font-black uppercase tracking-widest mb-6">
              Question {currentQIndex + 1} of {activeQuiz.questions.length}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-10">{q.question}</h3>
            
            <div className="space-y-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQIndex]: i })}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center ${answers[currentQIndex] === i ? 'border-brand-500 bg-brand-500/10 text-white shadow-xl' : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-white/5'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${answers[currentQIndex] === i ? 'border-brand-500' : 'border-slate-700'}`}>
                    {answers[currentQIndex] === i && <div className="w-3 h-3 bg-brand-500 rounded-full" />}
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">{opt}</span>
                </button>
              ))}
            </div>

            <div className="mt-12 flex justify-end">
              {isLast ? (
                <button 
                  onClick={submitQuiz}
                  disabled={answers[currentQIndex] === undefined}
                  className="px-10 py-5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center shadow-lg shadow-brand-500/20"
                >
                  Submit Quiz <CheckCircle className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentQIndex(i => i + 1)}
                  disabled={answers[currentQIndex] === undefined}
                  className="px-10 py-5 bg-white hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center shadow-xl"
                >
                  Next Question <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-[#020617] min-h-[calc(100vh-64px)] flex items-center justify-center py-20 px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 max-w-2xl w-full text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32" />
          
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 ${result.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
             {result.passed ? <Award className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
          </div>
          
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">{result.passed ? 'Assessment Passed!' : 'Assessment Failed'}</h2>
          <p className="text-slate-400 font-bold mb-10 text-sm">You scored {result.score} out of {result.total}. {result.passed ? 'Excellent work, you are mastering the markets.' : 'Review the material and try again.'}</p>
          
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Final Score</p>
               <p className="text-3xl font-black text-white">{Math.round((result.score / result.total) * 100)}%</p>
            </div>
            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Skill Points Earned</p>
               <p className={`text-3xl font-black ${result.earnedPoints > 0 ? 'text-brand-500' : 'text-slate-600'}`}>+{result.earnedPoints}</p>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button onClick={() => { setActiveQuiz(null); setResult(null); }} className="px-10 py-5 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform">
              Back to Quizzes
            </button>
            <Link to="/community" className="px-10 py-5 bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-700 transition-all flex items-center">
              View Leaderboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20 md:py-32 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center md:text-left">
           <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-6 border border-brand-100 dark:border-brand-800">
              <BrainCircuit className="w-3 h-3 text-brand-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Knowledge Assessments</span>
           </motion.div>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-xl">
                 <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter mb-6">Finance <span className="text-gradient">Quizzes.</span></motion.h1>
                 <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">
                    Test your financial knowledge, earn Skill Points, and climb the global leaderboard.
                 </motion.p>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-900 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz, i) => (
              <motion.div key={quiz._id} {...fadeInUp} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 group-hover:border-brand-500/30 transition-colors">
                      <Target className="w-6 h-6 text-brand-600" />
                    </div>
                    <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-brand-100 dark:border-brand-800">
                      {quiz.points} PTS
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black dark:text-white mb-3 group-hover:text-brand-600 transition-colors">{quiz.title}</h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-3 mb-6">{quiz.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quiz.questions.length} Questions</span>
                  <button onClick={() => startQuiz(quiz)} className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20 hover:scale-110 active:scale-95 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {quizzes.length === 0 && (
              <div className="col-span-full text-center py-20 opacity-50">
                <BrainCircuit className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">No quizzes available right now</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
