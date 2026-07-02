import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GRADIENTS = [
  'conic-gradient(from 0deg, transparent 0%, #8b5cf6 25%, #06b6d4 50%, #ec4899 75%, transparent 100%)', // Violet-Cyan-Pink
  'conic-gradient(from 90deg, transparent 0%, #3b82f6 30%, #10b981 60%, #f59e0b 80%, transparent 100%)', // Blue-Green-Amber
  'conic-gradient(from 180deg, transparent 0%, #f43f5e 25%, #8b5cf6 50%, #06b6d4 75%, transparent 100%)', // Rose-Purple-Cyan
  'conic-gradient(from 45deg, transparent 0%, #ec4899 30%, #a855f7 60%, #f59e0b 80%, transparent 100%)', // Pink-Violet-Amber
  'conic-gradient(from 120deg, transparent 0%, #00bfff 25%, #7c3aed 60%, #10b981 85%, transparent 100%)'  // Cyan-Purple-Emerald
];

const MOUSE_GLOWS = [
  'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.45), transparent 60%)', // Violet
  'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.45), transparent 60%)', // Cyan
  'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.45), transparent 60%)', // Emerald
  'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(244, 63, 94, 0.45), transparent 60%)', // Rose
  'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245, 158, 11, 0.45), transparent 60%)' // Amber
];

const GhostGlowCard = ({ children, className = '', onClick, ...props }) => {
  const cardRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [gradientIdx, setGradientIdx] = useState(0);

  useEffect(() => {
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };
    setIsTouchDevice(checkTouch());
    // Assign a random distinct visual gradient to each card
    setGradientIdx(Math.floor(Math.random() * GRADIENTS.length));
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={isTouchDevice ? undefined : handleMouseMove}
      onClick={onClick}
      className={`ghost-glow-card relative overflow-hidden backdrop-blur-md bg-white/5 rounded-2xl border-none transition-shadow duration-300 ${className}`}
      {...props}
    >
      {!isTouchDevice && (
        <div 
          className="ghost-glow-aurora" 
          style={{ backgroundImage: GRADIENTS[gradientIdx] }}
        />
      )}
      {!isTouchDevice && (
        <div 
          className="ghost-glow-mouse" 
          style={{ backgroundImage: MOUSE_GLOWS[gradientIdx] }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default GhostGlowCard;
