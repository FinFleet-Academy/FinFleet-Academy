import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CookieProvider } from './context/CookieContext';
import { AnimatePresence, motion } from 'framer-motion';

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
const CoursePlayer = lazy(() => import('./pages/courses/CoursePlayer'));
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
                      <Route path="/courses/learn/:courseId" element={<CoursePlayer />} />
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
              

              

              <CookieConsent />
            </AppLayout>
          )}
        </CookieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
