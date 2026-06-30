import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const GlowButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => {
  const buttonRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
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
        boxShadow: isHovered ? '0 0 20px rgba(139,92,246,0.5)' : '0 0 10px rgba(0,0,0,0.5)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139,92,246,0.3) 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
      {/* Glass laser shine sweep */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit z-[4]">
        <div className="absolute top-0 left-[-150%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] animate-button-shine" />
      </div>
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default GlowButton;
