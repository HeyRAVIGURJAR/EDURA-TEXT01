import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Focus, X, Timer, Zap, Trophy, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

/* ─── Confetti Burst (CSS-based, no npm needed) ─── */
const ConfettiPiece = ({ index }) => {
  const colors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899', '#EF4444'];
  const color = colors[index % colors.length];
  const x = (Math.random() - 0.5) * 400;
  const rotation = Math.random() * 720 - 360;
  const delay = Math.random() * 0.4;
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      animate={{ opacity: 0, y: -200, x, rotate: rotation, scale: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut', delay }}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: Math.random() * 10 + 6, height: Math.random() * 6 + 4,
        background: color, borderRadius: 2,
        pointerEvents: 'none', zIndex: 9999,
      }}
    />
  );
};

const Confetti = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {[...Array(60)].map((_, i) => <ConfettiPiece key={i} index={i} />)}
  </div>
);

const SESSION_PRESETS = [
  { label: '25 min', seconds: 25 * 60, xp: 50 },
  { label: '1 hr', seconds: 60 * 60, xp: 150 },
  { label: '2 hr', seconds: 2 * 60 * 60, xp: 350 },
  { label: '3 hr', seconds: 3 * 60 * 60, xp: 600 },
];

const SUCCESS_MESSAGES = [
  { title: '🔥 Absolute Beast!', body: 'You crushed it. Your brain just leveled up harder than most people do in a week.' },
  { title: '⚡ Unstoppable!', body: 'Another focus session in the books. Legends don\'t quit — and you didn\'t.' },
  { title: '🏆 Scholar Mode: Activated', body: 'That focus session just earned you serious XP. Keep the streak alive!' },
  { title: '🧠 Big Brain Energy', body: 'Deep focus achieved. You\'re one session closer to your dream rank.' },
  { title: '🌟 Top 1% Aspirant', body: 'Most people can\'t focus for this long. You\'re built differently.' },
];

const PomodoroEngine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(SESSION_PRESETS[0]);
  const [timeLeft, setTimeLeft] = useState(SESSION_PRESETS[0].seconds);
  const [isActive, setIsActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [successMsg] = useState(() => SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);
  const addXP = useAuthStore(state => state.addXP);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      const xp = selectedPreset.xp;
      setEarnedXP(xp);
      addXP(xp);
      setShowConfetti(true);
      setShowSuccess(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedPreset, addXP]);

  const handlePresetSelect = useCallback((preset) => {
    if (isActive) return;
    setSelectedPreset(preset);
    setTimeLeft(preset.seconds);
  }, [isActive]);

  const toggleTimer = useCallback(() => setIsActive(a => !a), []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(selectedPreset.seconds);
  }, [selectedPreset]);

  const closeSuccess = useCallback(() => {
    setShowSuccess(false);
    setIsOpen(false);
    resetTimer();
  }, [resetTimer]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = selectedPreset.seconds;
  const progress = (totalSeconds - timeLeft) / totalSeconds;

  const fmt = (n) => String(n).padStart(2, '0');

  return (
    <>
      {/* ── Persistent Top-Right Pill (dashboard only) ── */}
      {isActive && !isOpen && (
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 z-[998] flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white cursor-pointer select-none"
          style={{
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.4)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 20px rgba(139,92,246,0.3)',
          }}
        >
          <Timer size={14} className="text-purple-400" />
          <span className="font-mono text-purple-200">
            {hours > 0 ? `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}` : `${fmt(minutes)}:${fmt(seconds)}`}
          </span>
          <span className="text-purple-400 text-xs">Focus</span>
        </motion.button>
      )}

      {/* ── Floating Focus Button ── */}
      {!isActive && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center z-40"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            boxShadow: '0 0 25px rgba(139,92,246,0.5)',
          }}
        >
          <Focus className="text-white" size={22} />
        </motion.button>
      )}

      {/* ── Confetti ── */}
      {showConfetti && <Confetti />}

      {/* ── Success Modal ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 40 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative text-center p-10 rounded-3xl max-w-sm w-full mx-4"
              style={{
                background: 'rgba(9,9,18,0.9)',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 60px rgba(139,92,246,0.3)',
              }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-white mb-2">{successMsg.title}</h2>
              <p className="text-gray-400 mb-6">{successMsg.body}</p>

              <div className="flex items-center justify-center gap-3 mb-8 p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Zap size={20} className="text-yellow-400" />
                <span className="text-yellow-400 font-black text-xl">+{earnedXP} XP Earned!</span>
              </div>

              <button
                onClick={closeSuccess}
                className="w-full py-3 rounded-xl font-bold text-white text-lg"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}
              >
                Back to Study 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Timer Modal ── */}
      <AnimatePresence>
        {isOpen && !showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="relative p-8 rounded-3xl max-w-md w-full mx-4 text-center"
              style={{
                background: isActive ? 'rgba(4,4,12,0.97)' : 'rgba(18,18,27,0.97)',
                border: '1px solid rgba(139,92,246,0.25)',
                boxShadow: '0 0 60px rgba(139,92,246,0.15)',
              }}
            >
              {!isActive && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              )}

              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Focus size={20} className="text-purple-400" />
                <h2 className="text-xl font-black text-white">
                  {isActive ? 'Deep Focus Active' : 'Set Your Focus Session'}
                </h2>
              </div>

              {/* Preset Selector */}
              {!isActive && (
                <div className="flex gap-2 justify-center flex-wrap mb-8">
                  {SESSION_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetSelect(preset)}
                      className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                      style={{
                        background: selectedPreset.label === preset.label
                          ? 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
                          : 'rgba(255,255,255,0.05)',
                        border: selectedPreset.label === preset.label
                          ? '1px solid transparent'
                          : '1px solid rgba(255,255,255,0.08)',
                        color: selectedPreset.label === preset.label ? '#fff' : '#94A3B8',
                        boxShadow: selectedPreset.label === preset.label ? '0 0 15px rgba(139,92,246,0.4)' : 'none',
                      }}
                    >
                      {preset.label}
                      <span className="block text-xs opacity-70">+{preset.xp} XP</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Circular Progress Ring */}
              <div className="relative flex items-center justify-center mx-auto mb-8" style={{ width: 200, height: 200 }}>
                <svg width="200" height="200" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                  <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="100" cy="100" r="88" fill="none"
                    stroke="url(#timerGrad)" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                  <defs>
                    <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <div
                    className="font-mono font-black tracking-widest"
                    style={{
                      fontSize: hours > 0 ? '2.2rem' : '3rem',
                      background: 'linear-gradient(135deg, #A78BFA, #06B6D4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: isActive ? 'drop-shadow(0 0 10px rgba(139,92,246,0.6))' : 'none',
                    }}
                  >
                    {hours > 0 ? `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}` : `${fmt(minutes)}:${fmt(seconds)}`}
                  </div>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-purple-500 text-xs tracking-widest uppercase mt-1"
                    >
                      In The Zone
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                    boxShadow: '0 0 20px rgba(139,92,246,0.5)',
                  }}
                >
                  {isActive ? <Pause size={26} className="text-white" /> : <Play size={26} className="ml-1 text-white" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <RotateCcw size={22} />
                </button>
              </div>

              {isActive && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-600 text-xs mt-6 tracking-wide"
                >
                  Close this — the timer keeps running in the top-right corner
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PomodoroEngine;
