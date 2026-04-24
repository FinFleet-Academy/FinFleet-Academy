import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Settings, Check, ChevronRight } from 'lucide-react';
import { useCookies, COOKIE_CATEGORIES } from '../../context/CookieContext';

const CookieConsent = () => {
  const { 
    consent, 
    showBanner, 
    showSettings, 
    setShowSettings, 
    acceptAll, 
    rejectNonEssential, 
    saveConsent 
  } = useCookies();

  const [localConsent, setLocalConsent] = useState(consent || {
    [COOKIE_CATEGORIES.ESSENTIAL]: true,
    [COOKIE_CATEGORIES.ANALYTICS]: false,
    [COOKIE_CATEGORIES.MARKETING]: false,
    [COOKIE_CATEGORIES.PREFERENCES]: false,
  });

  const handleToggle = (category) => {
    if (category === COOKIE_CATEGORIES.ESSENTIAL) return;
    setLocalConsent(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSaveCustom = () => {
    saveConsent(localConsent);
  };

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && !showSettings && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl hidden sm:block">
                      <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        We value your privacy
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Privacy Policy</a>.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </button>
                    <button
                      onClick={rejectNonEssential}
                      className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={acceptAll}
                      className="flex-1 md:flex-none px-8 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cookie Settings</h3>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                <CookieOption 
                  title="Essential"
                  description="Required for the website to function properly. Cannot be disabled."
                  enabled={true}
                  fixed={true}
                  onToggle={() => {}}
                />
                <CookieOption 
                  title="Analytics"
                  description="Helps us understand how visitors interact with our website to improve performance."
                  enabled={localConsent[COOKIE_CATEGORIES.ANALYTICS]}
                  onToggle={() => handleToggle(COOKIE_CATEGORIES.ANALYTICS)}
                />
                <CookieOption 
                  title="Marketing"
                  description="Used to deliver more relevant advertisements and track ad campaign performance."
                  enabled={localConsent[COOKIE_CATEGORIES.MARKETING]}
                  onToggle={() => handleToggle(COOKIE_CATEGORIES.MARKETING)}
                />
                <CookieOption 
                  title="Preferences"
                  description="Allows the website to remember choices you make (like language or region)."
                  enabled={localConsent[COOKIE_CATEGORIES.PREFERENCES]}
                  onToggle={() => handleToggle(COOKIE_CATEGORIES.PREFERENCES)}
                />
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={rejectNonEssential}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Reject All
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleSaveCustom}
                  className="w-full sm:w-auto px-8 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const CookieOption = ({ title, description, enabled, onToggle, fixed = false }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
    <div className="flex-1">
      <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        {title}
        {fixed && <span className="text-[10px] uppercase tracking-wider bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">Always On</span>}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
    <button
      onClick={onToggle}
      disabled={fixed}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
      } ${fixed ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default CookieConsent;
