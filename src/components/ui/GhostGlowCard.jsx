import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const GhostGlowCard = ({ children, className = '', onClick, ...props }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`ghost-glow-card relative overflow-hidden backdrop-blur-md bg-white/5 rounded-2xl border-none transition-shadow duration-300 ${className}`}
      {...props}
    >
      <div className="ghost-glow-aurora" />
      <div className="ghost-glow-mouse" />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default GhostGlowCard;
