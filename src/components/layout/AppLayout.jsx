import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Breadcrumbs from './Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const Footer = React.lazy(() => import('./Footer'));

const AppLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { isSidebarOpen, setSidebarOpen, toggleSidebar } = useAppStore();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

  // Auto-hide sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Determine if layout elements should be hidden
  const isAuth = ['/login', '/signup'].includes(pathname);
  const isLanding = pathname === '/';
  const hideLayout = isAuth || isLanding;

  if (hideLayout) return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans selection:bg-brand-500/20">
      
      {/* 1. Sidebar (Persistent or Drawer) */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <Sidebar isMobile={isMobile} />
        )}
      </AnimatePresence>

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Topbar */}
        <Topbar 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative bg-white dark:bg-[#080C10] flex flex-col">
          <div className="max-w-[1600px] mx-auto p-6 sm:p-8 lg:p-10 w-full flex-grow">
            <Breadcrumbs />
            {children}
          </div>
          <React.Suspense fallback={<div className="h-20 animate-pulse bg-slate-100 dark:bg-slate-900 mt-auto" />}>
            <Footer />
          </React.Suspense>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[90] lg:hidden"
        />
      )}
    </div>
  );
};

export default AppLayout;
