import React, { createContext, useContext, useState, useEffect } from 'react';

const CookieContext = createContext();

export const COOKIE_CATEGORIES = {
  ESSENTIAL: 'essential',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  PREFERENCES: 'preferences',
};

const DEFAULT_CONSENT = {
  [COOKIE_CATEGORIES.ESSENTIAL]: true,
  [COOKIE_CATEGORIES.ANALYTICS]: false,
  [COOKIE_CATEGORIES.MARKETING]: false,
  [COOKIE_CATEGORIES.PREFERENCES]: false,
};

export const CookieProvider = ({ children }) => {
  const [consent, setConsent] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent');
    console.log('Checking for saved cookie consent:', savedConsent);
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
      setShowBanner(false);
    } else {
      console.log('No consent found, showing banner');
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newConsent) => {
    const consentToSave = { ...DEFAULT_CONSENT, ...newConsent };
    setConsent(consentToSave);
    localStorage.setItem('cookie-consent', JSON.stringify(consentToSave));
    setShowBanner(false);
    setShowSettings(false);
    
    // Trigger script loading logic here if needed
    applyConsent(consentToSave);
  };

  const acceptAll = () => {
    const allAccepted = {
      [COOKIE_CATEGORIES.ESSENTIAL]: true,
      [COOKIE_CATEGORIES.ANALYTICS]: true,
      [COOKIE_CATEGORIES.MARKETING]: true,
      [COOKIE_CATEGORIES.PREFERENCES]: true,
    };
    saveConsent(allAccepted);
  };

  const rejectNonEssential = () => {
    saveConsent(DEFAULT_CONSENT);
  };

  const applyConsent = (currentConsent) => {
    // Logic to enable/disable scripts based on consent
    // Example: if (currentConsent.analytics) { loadGA(); }
    if (currentConsent.analytics) {
      console.log('Analytics cookies enabled');
      // window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
    if (currentConsent.marketing) {
      console.log('Marketing cookies enabled');
    }
  };

  return (
    <CookieContext.Provider value={{
      consent,
      showBanner,
      showSettings,
      setShowBanner,
      setShowSettings,
      acceptAll,
      rejectNonEssential,
      saveConsent,
    }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookies = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};
