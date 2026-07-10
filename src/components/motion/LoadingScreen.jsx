import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [mounted, setMounted] = useState(true);
  const [directionClass, setDirectionClass] = useState('');

  useEffect(() => {
    let nextDirection = 'right-to-left';
    try {
      const stored = sessionStorage.getItem('currentWaveDirection');
      if (stored === 'right-to-left') {
        nextDirection = 'left-to-right';
      } else {
        nextDirection = 'right-to-left';
      }
      sessionStorage.setItem('currentWaveDirection', nextDirection);
    } catch (e) {
      console.error("sessionStorage error:", e);
    }

    setDirectionClass(nextDirection === 'right-to-left' ? 'wave-only-rtl' : 'wave-only-ltr');

    const timer = setTimeout(() => {
      setMounted(false);
      if (onComplete) onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden pointer-events-none"
      style={{
        animation: 'fadeOutBg 0.3s ease 0.9s forwards'
      }}
    >
      {/* Hollywood Light Wave Overlay Container */}
      <div className={`hollywood-wave-container ${directionClass}`} />

      {/* Cinematic Logo in the center */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 2,
          animation: 'dissolveLogo 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <h1 
          className="cinematic-gradient-text" 
          style={{ 
            fontFamily: "'Inter', 'Outfit', sans-serif",
            fontWeight: '900',
            fontSize: '54px',
            letterSpacing: '-0.04em',
            margin: 0,
            textTransform: 'uppercase'
          }}
        >
          EDURA
        </h1>
        <p 
          style={{ 
            color: '#8b5cf6', 
            fontSize: '11px', 
            fontWeight: '800', 
            letterSpacing: '0.15em', 
            margin: '8px 0 0 0',
            textTransform: 'uppercase'
          }}
        >
          PREMIUM LEARNING CONSOLE
        </p>
      </div>

      <style>{`
        .hollywood-wave-container {
          position: fixed;
          top: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
        }

        .wave-only-rtl {
          left: 0;
          background: linear-gradient(to right, transparent, #00f5ff, #9b51e0, transparent);
          animation: sweepRightToLeft 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform, opacity;
        }

        .wave-only-ltr {
          left: 0;
          background: linear-gradient(to right, transparent, #9b51e0, #00f5ff, transparent);
          animation: sweepLeftToRight 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes sweepRightToLeft {
          0% { transform: translateX(100vw); opacity: 1; }
          100% { transform: translateX(-100vw); opacity: 0; }
        }

        @keyframes sweepLeftToRight {
          0% { transform: translateX(-100vw); opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }

        @keyframes dissolveLogo {
          0% { opacity: 0; transform: translate(-50%, -42%) scale(0.96); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          75% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -58%) scale(1.04); }
        }

        @keyframes fadeOutBg {
          0% { background-color: rgba(0, 0, 0, 1); }
          100% { background-color: rgba(0, 0, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
