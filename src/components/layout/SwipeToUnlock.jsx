import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import './SwipeToUnlock.css';

const SwipeToUnlock = ({ onUnlock }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const handleDragStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e) => {
    if (!isDragging.current || unlocked) return;
    
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    let diffX = currentX - startX.current;
    
    if (diffX < 0) diffX = 0;
    
    const containerWidth = containerRef.current.offsetWidth;
    const maxDrag = containerWidth - 70; // knob width + padding
    
    if (diffX >= maxDrag) {
      diffX = maxDrag;
      setUnlocked(true);
      setTimeout(() => {
        if (onUnlock) onUnlock();
      }, 600); // Wait for unlock animation
    }
    
    setDragX(diffX);
  };

  const handleDragEnd = () => {
    if (unlocked) return;
    isDragging.current = false;
    setDragX(0); // Snap back smoothly via CSS transition
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [unlocked]);

  return (
    <div className={`swipe-overlay ${unlocked ? 'fade-out' : ''}`}>
      {/* Interactive Constellation Background */}
      <Particles
        id="unlock-particles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              resize: true,
            },
            modes: {
              grab: { distance: 250, links: { opacity: 1, color: "#8b5cf6" } },
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 180, enable: true, opacity: 0.2, width: 1.5 },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 0.3,
              straight: false,
            },
            number: { density: { enable: true, area: 1000 }, value: 70 },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0 pointer-events-auto"
      />

      <div className="swipe-content relative z-10 w-full px-6 flex flex-col items-center justify-center min-h-screen">
        
        {/* Floating Text with slow, smooth animation */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="text-center mb-16 relative"
        >
          {/* Glowing Aura behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none" />
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] mb-2">
            EDURA
          </h1>
          <p className="text-purple-300 font-medium tracking-[0.3em] uppercase text-sm md:text-lg drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
            Premium Experience
          </p>
        </motion.div>
        
        {/* Premium Glassmorphism Slider */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div 
            className={`swipe-container ${unlocked ? 'unlocked' : ''}`} 
            ref={containerRef}
          >
            <div 
              className="swipe-track" 
              style={{ width: `calc(${dragX}px + 70px)` }}
            />
            
            <span className="swipe-text">
              {unlocked ? "Access Granted" : "Slide to Unlock EDURA"}
            </span>
            
            <div 
              className={`swipe-knob ${isDragging.current ? 'dragging' : ''}`}
              style={{ transform: `translateX(${dragX}px)`, transition: isDragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              {unlocked ? (
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SwipeToUnlock;
