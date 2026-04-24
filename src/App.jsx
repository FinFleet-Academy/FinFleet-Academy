import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingChatButton from './components/layout/FloatingChatButton';
import SplashScreen from './components/layout/SplashScreen';

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
const HelpPage = lazy(() => import('./pages/HelpPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const TradingDashboard = lazy(() => import('./pages/TradingDashboard'));
const ProTradingChart = lazy(() => import('./pages/ProTradingChart'));
const LiveClasses = lazy(() => import('./pages/LiveClasses'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Premium Loading Fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-600 rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">FinFleet Loading</p>
  </div>
);

// Show splash only once per browser session
const shouldShowSplash = !sessionStorage.getItem('finfleet_intro_seen');

function App() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);
  const [appReady, setAppReady] = useState(!shouldShowSplash);

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem('finfleet_intro_seen', 'true');
    setShowSplash(false);
    setAppReady(true);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Splash Screen — renders above everything */}
        <AnimatePresence>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        </AnimatePresence>

        {/* Main App — staggered entry once splash exits */}
        {appReady && (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">

            {/* Navbar slides down */}
            <motion.div
              initial={shouldShowSplash ? { y: -64, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Navbar />
            </motion.div>

            {/* Page content fades in with Suspense for Lazy Loading */}
            <motion.main
              className="flex-grow"
              initial={shouldShowSplash ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            >
              <Suspense fallback={<PageLoader />}>
                <Routes>
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
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/trading" element={<TradingDashboard />} />
                  <Route path="/pro-chart" element={<ProTradingChart />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/user/:userId" element={<PublicProfilePage />} />
                  <Route path="/live-classes" element={<LiveClasses />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </motion.main>

            <Footer />
            <FloatingChatButton />
          </div>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
