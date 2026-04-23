import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated SVG graph line for fintech feel
const GraphLine = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
    viewBox="0 0 1200 600"
    preserveAspectRatio="xMidYMid slice"
  >
    <motion.path
      d="M0,400 C100,380 150,420 200,350 C250,280 300,320 400,260 C500,200 520,280 600,220 C680,160 750,200 850,150 C950,100 1000,130 1100,100 C1150,85 1180,90 1200,80"
      fill="none"
      stroke="url(#graphGrad)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
    />
    <motion.path
      d="M0,450 C80,440 160,460 250,420 C340,380 380,410 480,370 C580,330 620,360 720,310 C820,260 880,280 980,240 C1060,210 1130,220 1200,200"
      fill="none"
      stroke="url(#graphGrad2)"
      strokeWidth="1.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.6 }}
    />
    <defs>
      <linearGradient id="graphGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
        <stop offset="40%" stopColor="#8b5cf6" stopOpacity="1" />
        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="graphGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

// Floating orbs for ambient depth
const FloatingOrbs = () => (
  <>
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        top: '-10%', left: '-5%',
      }}
      animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
        bottom: '-5%', right: '-5%',
      }}
      animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
    <motion.div
      className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        top: '40%', right: '15%',
      }}
      animate={{ x: [0, 15, 0], y: [0, -30, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
    />
  </>
);

// Subtle particle dots
const Particles = () => {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map(dot => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            opacity: 0,
          }}
          animate={{ opacity: [0, 0.4, 0], y: [0, -20, -40] }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('visible'); // 'visible' | 'exiting'

  useEffect(() => {
    // Begin exit at 3.0s
    const exitTimer = setTimeout(() => setPhase('exiting'), 3000);
    // Notify parent after fade out completes (~3.7s)
    const doneTimer = setTimeout(() => onComplete(), 3700);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  const words = ['Learn.', 'Invest.', 'Grow.'];

  return (
    <AnimatePresence>
      {phase === 'visible' && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none"
          style={{ background: '#080C10' }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Background layers */}
          <FloatingOrbs />
          <Particles />
          <GraphLine />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Logo icon */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-6 relative"
            >
              {/* Pulsing glow ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ background: 'rgba(139,92,246,0.3)', filter: 'blur(20px)' }}
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-brand-600 flex items-center justify-center shadow-2xl">
                {/* Rocket SVG inline */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                </svg>
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              className="mb-2 relative"
            >
              {/* Light sweep effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['-200% 0', '400% 0'] }}
                transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
              />
              <h1
                className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '-0.03em' }}
              >
                Fin<span style={{ color: '#8b5cf6' }}>Fleet</span>
              </h1>
            </motion.div>

            {/* Tagline — word by word */}
            <div className="flex items-center space-x-2 mt-4">
              {words.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + i * 0.18, ease: 'easeOut' }}
                  className="text-lg sm:text-xl font-semibold"
                  style={{
                    color: i === 0 ? '#a78bfa' : i === 1 ? '#67e8f9' : '#4ade80',
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Loading bar */}
            <motion.div
              className="mt-10 w-48 h-[2px] rounded-full overflow-hidden bg-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #8b5cf6, #22c55e)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, delay: 1.2, ease: 'easeInOut' }}
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
