import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, AlertTriangle } from 'lucide-react';

/* ─────────────────────────────────────────────────────
   NetworkStatus — Global Internet Handling Component
   Detects offline/online transitions, slow connections,
   and provides retry/auto-retry functionality.
   ───────────────────────────────────────────────────── */

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  // Detect online/offline
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setDismissed(false);
      // Auto-hide the "back online" banner after 3s
      setTimeout(() => setShowBanner(false), 3000);
    };

    const goOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
      setDismissed(false);
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Detect slow connection using Network Information API
  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return;

    const checkSpeed = () => {
      const effectiveType = connection.effectiveType;
      const isSlow = effectiveType === 'slow-2g' || effectiveType === '2g';
      setIsSlowConnection(isSlow);
      if (isSlow) {
        setShowBanner(true);
        setDismissed(false);
      }
    };

    checkSpeed();
    connection.addEventListener('change', checkSpeed);
    return () => connection.removeEventListener('change', checkSpeed);
  }, []);

  // Retry handler
  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      // Attempt a lightweight fetch to check connectivity
      await fetch('/manifest.webmanifest', { cache: 'no-store', mode: 'no-cors' });
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    } catch {
      // Still offline
      setIsOnline(false);
    } finally {
      setIsRetrying(false);
    }
  }, []);

  // Auto-retry when offline — try every 10 seconds
  useEffect(() => {
    if (isOnline) return;

    const interval = setInterval(async () => {
      try {
        await fetch('/manifest.webmanifest', { cache: 'no-store', mode: 'no-cors' });
        setIsOnline(true);
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 3000);
      } catch {
        // Still offline, keep trying
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isOnline]);

  if (!showBanner || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          background: !isOnline
            ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.95), rgba(185, 28, 28, 0.95))'
            : isSlowConnection
              ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.95), rgba(180, 83, 9, 0.95))'
              : 'linear-gradient(135deg, rgba(22, 163, 74, 0.95), rgba(21, 128, 61, 0.95))',
          color: '#fff',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Icon */}
        {!isOnline ? (
          <WifiOff size={16} />
        ) : isSlowConnection ? (
          <AlertTriangle size={16} />
        ) : (
          <Wifi size={16} />
        )}

        {/* Message */}
        <span>
          {!isOnline
            ? "You're offline — some features may be unavailable"
            : isSlowConnection
              ? "Slow connection detected — content may load slowly"
              : "Back online ✓"}
        </span>

        {/* Retry Button (only when offline) */}
        {!isOnline && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: isRetrying ? 'wait' : 'pointer',
              opacity: isRetrying ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw size={12} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}

        {/* Dismiss */}
        {isOnline && (
          <button
            onClick={() => setDismissed(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NetworkStatus;
