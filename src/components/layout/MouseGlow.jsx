import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const MouseGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      
      // Check if hovering over clickable elements
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') || 
        target.closest('button') || 
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Smooth spring physics for the trail effect
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: cursorX,
        top: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        width: isHovering ? 300 : 200,
        height: isHovering ? 300 : 200,
        borderRadius: '50%',
        background: isHovering 
          ? 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0) 70%)'
          : 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(139,92,246,0) 70%)',
        pointerEvents: 'none',
        zIndex: 9998, // Just below top-level modals
        mixBlendMode: 'screen',
        transition: 'width 0.3s ease, height 0.3s ease'
      }}
    />
  );
};

export default MouseGlow;
