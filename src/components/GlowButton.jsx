import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const GlowButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => {
  const buttonRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [magneticPosition, setMagneticPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      
      // Calculate relative gradient position for glow tracker
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      const glowY = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x: glowX, y: glowY });

      // Calculate magnetic offset relative to the center of the button
      const pullFactor = 0.15; // amount of pull
      const magX = (e.clientX - rect.left - rect.width / 2) * pullFactor;
      const magY = (e.clientY - rect.top - rect.height / 2) * pullFactor;
      setMagneticPosition({ x: magX, y: magY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMagneticPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`stitch-border flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{
        '--stitch-bg': '#09090b', // Keep button dark
        boxShadow: isHovered 
          ? '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(6,182,212,0.2)' 
          : '0 0 10px rgba(0,0,0,0.5)',
      }}
      animate={{ x: magneticPosition.x, y: magneticPosition.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Dynamic tracking gradient overlay (purple to cyan) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139,92,246,0.3) 0%, rgba(6,182,212,0.15) 35%, transparent 70%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
      {/* Glass laser shine sweep */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit z-[4]">
        <div className="absolute top-0 left-[-150%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-button-shine" />
      </div>
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default GlowButton;
