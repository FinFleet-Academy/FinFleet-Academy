import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CookieProvider } from './context/CookieContext';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingChatButton from './components/layout/FloatingChatButton';
import SplashScreen from './components/layout/SplashScreen';
import CookieConsent from './components/cookies/CookieConsent';
import AppLayout from './components/layout/AppLayout';

// Lazy Load Pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const FinorPage = lazy(() => import('./pages/FinorPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AboutFinorPage = lazy(() => import('./pages/AboutFinorPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const HelpPage = lazy(() => import('./pages/help/HelpSupportPage'));
const ToolsRouter = lazy(() => import('./pages/tools/ToolsRouter'));
const FinancialRouter = lazy(() => import('./pages/financial/FinancialRouter'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const TradingDashboard = lazy(() => import('./pages/TradingDashboard'));
import ProTradingChart from './pages/ProTradingChart';
const LiveClasses = lazy(() => import('./pages/LiveClasses'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProfileSettings = lazy(() => import('./pages/social/ProfileSettings'));

// Premium Loading Fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">FinFleet Academy Loading</p>
  </div>
);

import { useLocation } from 'react-router-dom';
import ToastContainer from './components/feedback/Toast';

// Show splash only once per browser session
const shouldShowSplash = !sessionStorage.getItem('finfleet_intro_seen');

function App() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);
  const [appReady, setAppReady] = useState(!shouldShowSplash);
  const location = useLocation();

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem('finfleet_intro_seen', 'true');
    setShowSplash(false);
    setAppReady(true);
  }, []);

  // Force reload on chunk load failure (common after new deployments)
  useEffect(() => {
    const handleError = (e) => {
      if (e.message?.includes('Failed to fetch dynamically imported module') || 
          e.message?.includes('Importing a module script failed')) {
        window.location.reload();
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CookieProvider>
          {/* Splash Screen */}
          <AnimatePresence mode="wait">
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          </AnimatePresence>

          {appReady && (
            <AppLayout>
              <ToastContainer />
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Suspense fallback={<PageLoader />}>
                    <Routes location={location}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/courses" element={<CoursesPage />} />
                      <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/finor/about" element={<AboutFinorPage />} />
                      <Route path="/finor" element={<FinorPage />} />
                      <Route path="/finor/:slug" element={<NewsDetailPage />} />
                      <Route path="/chatbot" element={<ChatPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/admin/*" element={<AdminDashboard />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<ProfileSettings />} />
                      <Route path="/feedback" element={<FeedbackPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/tools/*" element={<ToolsRouter />} />
                      <Route path="/financial/*" element={<FinancialRouter />} />
                      <Route path="/trading" element={<TradingDashboard />} />
                      <Route path="/pro-chart" element={<ProTradingChart />} />
                      <Route path="/community" element={<CommunityPage />} />
                      <Route path="/quizzes" element={<QuizPage />} />
                      <Route path="/user/:userId" element={<PublicProfilePage />} />
                      <Route path="/live-classes" element={<LiveClasses />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </motion.div>
              </AnimatePresence>
              

              
              {/* Floating WhatsApp Button */}
              <motion.a
                href="https://wa.me/918986165504"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-28 right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center group"
              >
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest border border-slate-700">
                  Chat on WhatsApp
                </div>
              </motion.a>
              
              <CookieConsent />
            </AppLayout>
          )}
        </CookieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
