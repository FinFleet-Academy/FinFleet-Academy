import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingChatButton from './components/layout/FloatingChatButton';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import PricingPage from './pages/PricingPage';
import ChatPage from './pages/ChatPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import FinorPage from './pages/FinorPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AboutPage from './pages/AboutPage';
import AboutFinorPage from './pages/AboutFinorPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackPage from './pages/FeedbackPage';
import HelpPage from './pages/HelpPage';
import ToolsPage from './pages/ToolsPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
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
              <Route path="/community" element={<CommunityPage />} />
            </Routes>
          </main>
          <Footer />
          <FloatingChatButton />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
