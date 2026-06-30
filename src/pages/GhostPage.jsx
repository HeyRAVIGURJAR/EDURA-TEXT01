import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff, Home } from 'lucide-react';
import './GhostPage.css';

const GhostPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="ghost-page">
      <div className="ghost-bg">
        <div className="ghost-grid" />
        <div className="ghost-orb ghost-orb-1" />
        <div className="ghost-orb ghost-orb-2" />
        <div className="ghost-orb ghost-orb-3" />
      </div>

      <motion.div
        className="ghost-content"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Floating Ghost SVG */}
        <motion.div
          className="ghost-icon-container"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg className="ghost-svg" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M60 10C33.5 10 12 31.5 12 58V120C12 120 20 110 30 115C40 120 45 110 55 115C65 120 70 110 80 115C90 120 98 115 108 120V58C108 31.5 86.5 10 60 10Z"
              fill="url(#ghostGrad)"
              fillOpacity="0.15"
              stroke="url(#ghostStroke)"
              strokeWidth="2"
            />
            <circle cx="42" cy="55" r="6" fill="#8A2BE2" opacity="0.8" />
            <circle cx="78" cy="55" r="6" fill="#8A2BE2" opacity="0.8" />
            <circle cx="42" cy="55" r="3" fill="#fff" />
            <circle cx="78" cy="55" r="3" fill="#fff" />
            <ellipse cx="60" cy="78" rx="8" ry="5" fill="#8A2BE2" opacity="0.3" />
            <defs>
              <linearGradient id="ghostGrad" x1="12" y1="10" x2="108" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8A2BE2" />
                <stop offset="1" stopColor="#00BFFF" />
              </linearGradient>
              <linearGradient id="ghostStroke" x1="12" y1="10" x2="108" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8A2BE2" stopOpacity="0.6" />
                <stop offset="1" stopColor="#00BFFF" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <div className="ghost-shield-badge">
          <ShieldOff size={16} />
          <span>ACCESS DENIED</span>
        </div>

        <h1 className="ghost-title">
          <span className="ghost-404">404</span>
          <span className="ghost-divider" />
          Page Not Found
        </h1>

        <p className="ghost-desc">
          The page you're looking for doesn't exist or you don't have permission to access it.
          You'll be redirected automatically.
        </p>

        <div className="ghost-countdown">
          Redirecting in <span className="ghost-count-num">{countdown}</span> seconds...
        </div>

        <motion.button
          className="ghost-home-btn"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={18} />
          Go Home Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default GhostPage;
