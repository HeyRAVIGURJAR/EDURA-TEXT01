import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X, Star } from 'lucide-react';

/* ─────────────────────────────────────────────────────
   CelebrationEngine — Global Celebration Animations
   - Confetti burst
   - Achievement badge popup
   - Welcome modal for first login
   ───────────────────────────────────────────────────── */

// ── Confetti Particle System ──
const ConfettiParticle = ({ index, color }) => {
  const size = 6 + Math.random() * 6;
  const startX = Math.random() * 100;
  const drift = (Math.random() - 0.5) * 40;
  const rotateEnd = Math.random() * 720 - 360;
  const duration = 2 + Math.random() * 1.5;
  const shape = Math.random() > 0.5 ? '50%' : '2px';

  return (
    <motion.div
      initial={{ 
        x: `${startX}vw`, 
        y: -20, 
        rotate: 0, 
        opacity: 1, 
        scale: 1 
      }}
      animate={{ 
        x: `${startX + drift}vw`, 
        y: '110vh', 
        rotate: rotateEnd, 
        opacity: [1, 1, 0.8, 0], 
        scale: [1, 1.2, 0.8] 
      }}
      transition={{ duration, ease: 'easeOut', delay: index * 0.02 }}
      style={{
        position: 'fixed',
        width: size,
        height: size * 1.4,
        background: color,
        borderRadius: shape,
        zIndex: 99999,
        pointerEvents: 'none',
        boxShadow: `0 0 4px ${color}88`,
      }}
    />
  );
};

const CONFETTI_COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#3B82F6', '#F97316'];

export const ConfettiBurst = ({ trigger, duration = 4000 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: Date.now() + i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [trigger, duration]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {particles.map((p, i) => (
        <ConfettiParticle key={p.id} index={i} color={p.color} />
      ))}
    </div>
  );
};

// ── Achievement Badge Popup ──
export const AchievementPopup = ({ show, title, description, icon, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99998,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, rgba(18,18,30,0.95), rgba(9,9,20,0.98))',
              borderRadius: '24px',
              padding: '40px',
              textAlign: 'center',
              maxWidth: '360px',
              width: '90%',
              border: '1px solid rgba(139,92,246,0.3)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(139,92,246,0.15)',
              position: 'relative',
            }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            {/* Glowing Badge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                boxShadow: '0 0 40px rgba(139,92,246,0.5), inset 0 2px 4px rgba(255,255,255,0.2)',
                fontSize: '36px',
              }}
            >
              {icon || <Trophy size={36} color="#fff" />}
            </motion.div>

            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {title || 'Achievement Unlocked!'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
              {description || "You've earned a new badge. Keep going!"}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              style={{
                marginTop: '24px',
                padding: '10px 32px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
              }}
            >
              Awesome! 🎉
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Welcome Modal (First Login) ──
export const WelcomeModal = ({ show, userName, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99997,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, rgba(15,15,30,0.98), rgba(5,5,15,0.99))',
              borderRadius: '28px',
              padding: '48px 40px',
              textAlign: 'center',
              maxWidth: '420px',
              width: '90%',
              border: '1px solid rgba(91,86,230,0.3)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 100px rgba(91,86,230,0.1)',
            }}
          >
            {/* Logo */}
            <img 
              src="/images/edura-logo-new.png" 
              alt="EDURA" 
              style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px', border: '2px solid #5B56E6', objectFit: 'cover' }}
            />

            {/* Welcome text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                Welcome to EDURA! 🎓
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
                Hey <span style={{ color: '#8B5CF6', fontWeight: 700 }}>{userName || 'Aspirant'}</span>, your personalized learning journey starts now.
              </p>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>
                Explore batches, practice daily, and climb the leaderboard. Let's make your preparation count! 💪
              </p>
            </motion.div>

            {/* Sparkle icons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '20px 0' }}>
              {['🔥', '📚', '🏆', '🎯', '⚡'].map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{ fontSize: '24px' }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              style={{
                marginTop: '8px',
                padding: '12px 40px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #5B56E6, #7C3AED)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(91,86,230,0.4)',
                letterSpacing: '0.02em',
              }}
            >
              Let's Go! →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Main CelebrationEngine — renders all celebration overlays ──
const CelebrationEngine = () => {
  // This is a container component — celebrations are triggered via events
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [achievement, setAchievement] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  useEffect(() => {
    const handleConfetti = () => setConfettiTrigger(t => t + 1);
    const handleAchievement = (e) => setAchievement(e.detail);
    const handleWelcome = (e) => {
      setWelcomeName(e.detail?.name || 'Aspirant');
      setShowWelcome(true);
    };

    window.addEventListener('edura-confetti', handleConfetti);
    window.addEventListener('edura-achievement', handleAchievement);
    window.addEventListener('edura-welcome', handleWelcome);

    return () => {
      window.removeEventListener('edura-confetti', handleConfetti);
      window.removeEventListener('edura-achievement', handleAchievement);
      window.removeEventListener('edura-welcome', handleWelcome);
    };
  }, []);

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} />
      <AchievementPopup
        show={!!achievement}
        title={achievement?.title}
        description={achievement?.description}
        icon={achievement?.icon}
        onClose={() => setAchievement(null)}
      />
      <WelcomeModal
        show={showWelcome}
        userName={welcomeName}
        onClose={() => {
          setShowWelcome(false);
          localStorage.setItem('edura_welcomed', 'true');
        }}
      />
    </>
  );
};

export default CelebrationEngine;
