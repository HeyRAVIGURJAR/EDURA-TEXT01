import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, User, Mail, Lock, Sparkles,
  ArrowLeft, Loader2, ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { sanitizeInput } from '../utils/sanitize';
import { loginSchema, signupSchema, getPasswordStrength } from '../utils/validate';
import GlowButton from '../components/GlowButton';
import EduraLogo from '../components/ui/EduraLogo';
import './AuthPage.css';

// --- Rate Limiting Constants ---
const RATE_LIMIT_KEY = 'edura_auth_rate';
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

const getRateState = () => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { attempts: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
};

const setRateState = (state) => {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
};

// --- Google Icon SVG ---
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// --- Password Strength Meter ---
const PasswordStrengthMeter = ({ password }) => {
  const strength = getPasswordStrength(password);
  if (!password) return null;

  return (
    <motion.div
      className="password-strength-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="password-strength-bar-track">
        <motion.div
          className="password-strength-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${(strength.score / 5) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ backgroundColor: strength.color }}
        />
      </div>
      <span className="password-strength-label" style={{ color: strength.color }}>
        {strength.label}
      </span>
    </motion.div>
  );
};

// --- Main Component ---
const AuthPage = () => {
  const navigate = useNavigate();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const { login, signup, isAuthenticated, loginError, clearError } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeError, setShakeError] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Rate limiting state
  const [rateState, setRateStateLocal] = useState(getRateState());
  const [lockCountdown, setLockCountdown] = useState(0);
  const lockTimerRef = useRef(null);

  const isLocked = lockCountdown > 0;

  // Real, beautiful images of actresses & EDURA provided images (loaded directly from artifacts via custom Vite middleware)
  const actressImages = [
    { src: '/artifacts/media__1782815915641.png', name: 'EDURA Logo', invert: true },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Emma_Watson_2017_%28cropped%29.jpg', name: 'Emma Watson' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Kalyani_Priyadarshan.jpg', name: 'Kalyani Priyadarshan' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Rashmika-Mandanna_at_the_music_launch_of_Chhaava.jpg', name: 'Rashmika Mandanna' },
    { src: '/artifacts/media__1782815886554.jpg', name: 'EDURA Highlight' },
    { src: '/artifacts/media__1782815898246.png', name: 'EDURA Feature' },
    { src: '/artifacts/media__1782815908083.png', name: 'EDURA Exclusive' },
    { src: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=400&q=80', name: 'Evie Templeton' }
  ];

  const [shuffledImages, setShuffledImages] = useState(actressImages.slice(0, 6));

  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      setShuffledImages((prev) => {
        const newImages = [...actressImages].sort(() => 0.5 - Math.random());
        return newImages.slice(0, 6);
      });
    }, 6000); // Shuffle every 6 seconds

    return () => clearInterval(shuffleInterval);
  }, []);

  // Navigate away if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  // Clear errors on mode switch
  useEffect(() => {
    clearError();
    setFieldErrors({});
    setTouchedFields({});
    setFormData({ username: '', email: '', password: '' });
  }, [isLogin, clearError]);

  // Lockout countdown timer
  useEffect(() => {
    const rate = getRateState();
    const now = Date.now();
    if (rate.lockedUntil > now) {
      const remaining = Math.ceil((rate.lockedUntil - now) / 1000);
      setLockCountdown(remaining);

      lockTimerRef.current = setInterval(() => {
        const r = getRateState();
        const diff = Math.ceil((r.lockedUntil - Date.now()) / 1000);
        if (diff <= 0) {
          setLockCountdown(0);
          clearInterval(lockTimerRef.current);
          setRateState({ attempts: 0, lockedUntil: 0 });
          setRateStateLocal({ attempts: 0, lockedUntil: 0 });
        } else {
          setLockCountdown(diff);
        }
      }, 1000);
    }
    return () => clearInterval(lockTimerRef.current);
  }, [rateState.lockedUntil]);

  // --- Real-time validation on change ---
  const validateField = useCallback((name, value) => {
    const schema = isLogin ? loginSchema : signupSchema;
    const error = schema.validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touchedFields[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked || isLoading) return;

    // Validate all fields
    const schema = isLogin ? loginSchema : signupSchema;
    const result = schema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(result.errors);
      setTouchedFields({ username: true, email: true, password: true });
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }

    setIsLoading(true);

    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 800));

    const username = sanitizeInput(formData.username);
    const email = sanitizeInput(formData.email);
    const password = formData.password;

    let success;
    if (isLogin) {
      success = login(username || email, password);
    } else {
      if (!username || !email || !password) { setIsLoading(false); return; }
      success = signup(username, email, password);
    }

    if (!success) {
      // Rate limiting: increment attempts
      const current = getRateState();
      const newAttempts = current.attempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_SECONDS * 1000;
        setRateState({ attempts: newAttempts, lockedUntil });
        setRateStateLocal({ attempts: newAttempts, lockedUntil });
      } else {
        setRateState({ ...current, attempts: newAttempts });
        setRateStateLocal({ ...current, attempts: newAttempts });
      }

      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    } else {
      // Reset rate limit on successful login
      setRateState({ attempts: 0, lockedUntil: 0 });
      setRateStateLocal({ attempts: 0, lockedUntil: 0 });
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth integration
    addNotification({
      message: 'Google OAuth integration coming soon! Use email/password for now.',
      type: 'warning',
    });
  };

  const formVariants = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, x: 30, transition: { duration: 0.25 } },
  };

  const attemptsRemaining = MAX_ATTEMPTS - rateState.attempts;

  return (
    <div className="auth-page">
      {/* Left Side — Form */}
      <div className="auth-left">
        <div className="auth-form-container">

          {/* Back to Home */}
          <motion.button
            className="auth-back-btn"
            onClick={() => navigate('/')}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Home</span>
          </motion.button>

          {/* Logo */}
          <motion.div
            className="auth-logo flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <EduraLogo size={48} showText={true} />
            <p className="auth-tagline" style={{ marginTop: '0.5rem' }}>AI-Powered Education Platform</p>
          </motion.div>

          {/* Auth Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              className={`auth-form glass-panel ${shakeError ? 'shake' : ''}`}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onSubmit={handleSubmit}
              noValidate
            >
              <h2 className="auth-form-title">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="auth-form-subtitle">
                {isLogin
                  ? 'Sign in to continue your learning journey'
                  : 'Join thousands of students already on EDURA'}
              </p>

              {/* Lockout Banner */}
              <AnimatePresence>
                {isLocked && (
                  <motion.div
                    className="auth-lockout-banner"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <ShieldAlert size={18} />
                    <div>
                      <strong>Too many attempts.</strong>
                      <p>Try again in <span className="auth-lockout-timer">{lockCountdown}s</span></p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username */}
              <div className={`auth-input-group ${fieldErrors.username && touchedFields.username ? 'has-error' : ''}`}>
                <User size={18} className="auth-input-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder={isLogin ? 'Username or Email' : 'Choose a username'}
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLocked}
                  autoComplete="username"
                />
              </div>
              <AnimatePresence>
                {fieldErrors.username && touchedFields.username && (
                  <motion.p className="auth-field-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                    {fieldErrors.username}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Email (signup only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={`auth-input-group ${fieldErrors.email && touchedFields.email ? 'has-error' : ''}`}>
                      <Mail size={18} className="auth-input-icon" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isLocked}
                        autoComplete="email"
                      />
                    </div>
                    <AnimatePresence>
                      {fieldErrors.email && touchedFields.email && (
                        <motion.p className="auth-field-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                          {fieldErrors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password */}
              <div className={`auth-input-group ${fieldErrors.password && touchedFields.password ? 'has-error' : ''}`}>
                <Lock size={18} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLocked}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  maxLength={32}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {fieldErrors.password && touchedFields.password && (
                  <motion.p className="auth-field-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                    {fieldErrors.password}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Password Strength Meter (signup only) */}
              <AnimatePresence>
                {!isLogin && <PasswordStrengthMeter password={formData.password} />}
              </AnimatePresence>

              {/* Login Error from Store */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    className={`auth-error ${loginError === 'blocked' ? 'blocked' : ''}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {loginError === 'blocked'
                      ? '🚫 Your account has been restricted. Contact support.'
                      : `⚠ ${loginError}`}
                    {!isLocked && attemptsRemaining > 0 && attemptsRemaining < MAX_ATTEMPTS && (
                      <span className="auth-attempts-left"> ({attemptsRemaining} attempts remaining)</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <GlowButton
                type="submit"
                disabled={isLocked || isLoading}
                className="w-full py-3 text-base font-bold rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </GlowButton>

              {/* Divider */}
              <div className="auth-divider">
                <span>or</span>
              </div>

              {/* Google Login */}
              <button
                type="button"
                className="auth-google-btn"
                onClick={handleGoogleLogin}
                disabled={isLocked}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              {/* Toggle Login/Signup */}
              <div className="auth-toggle">
                <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                <button
                  type="button"
                  className="auth-toggle-btn"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </motion.form>
          </AnimatePresence>

          {/* Demo Hint */}
          <motion.div
            className="auth-demo-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Sparkles size={14} />
            <span>Demo: <code>priya_sharma</code> / <code>test123</code></span>
          </motion.div>
        </div>
      </div>
      {/* Right Side — Visual Showcase */}
      <div className="auth-right" style={{ position: 'relative', overflow: 'hidden', background: '#09090b', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* The Ball Animation (Hitting Screen) */}
        <motion.div
          initial={{ scale: 0, opacity: 0, zIndex: 50 }}
          animate={{ scale: [0, 5, 20], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: "easeIn" }}
          style={{ position: 'absolute', width: 50, height: 50, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #fff, #ef4444)', top: '50%', left: '50%', transformOrigin: 'center center' }}
        />

        {/* The Tree Animation (Growing) */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0.8], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: 0, right: '10%', width: 120, height: 250, background: 'linear-gradient(to top, #16a34a, #4ade80)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transformOrigin: 'bottom center', zIndex: 10, opacity: 0.5, filter: 'blur(10px)' }}
        />

        {/* Dynamic Image Grid */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '1fr', gap: '8px', padding: '16px', opacity: 0.6 }}>
          <AnimatePresence>
            {shuffledImages.map((img, index) => {
              const isMain = index === 0;
              return (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  style={{
                    gridColumn: isMain ? 'span 2' : 'span 1',
                    gridRow: isMain ? 'span 2' : 'span 1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                  }}
                >
                  <img 
                    src={img.src} 
                    alt={img.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: img.invert ? 'contain' : 'cover',
                      filter: img.invert ? 'invert(1)' : 'none',
                      padding: img.invert ? '2rem' : '0' 
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: isMain ? '16px' : '12px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)'
                  }}>
                    {img.name}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Content Overlay */}
        <div className="auth-cover-overlay" style={{ zIndex: 2, background: 'linear-gradient(to top, #09090b 10%, transparent 60%, #09090b 90%)' }} />
        <div className="auth-cover-content" style={{ zIndex: 20, position: 'relative', marginTop: 'auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              Learn Without <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Limits</span>
            </h2>
            <p style={{ color: 'rgba(241,245,249,0.9)', fontSize: '1rem', lineHeight: 1.7, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Gamified learning, AI-powered tutoring, and a community that pushes you forward.</p>
          </motion.div>
        </div>
      </div>

    </div>

  );
};

export default AuthPage;
