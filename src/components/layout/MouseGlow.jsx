import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MouseGlow = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the trail effect
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch screens
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };
    
    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Fast clickable check without window.getComputedStyle (which causes layout thrashing)
      const target = e.target;
      if (!target) return;

      const isClickable = !!target.closest('a, button, [role="button"], input[type="submit"], input[type="button"], summary, select');
        
      // Only update state if hover status has changed to prevent infinite re-renders
      setIsHovering((prev) => {
        if (prev !== isClickable) return isClickable;
        return prev;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

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
