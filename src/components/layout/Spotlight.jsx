import React, { useEffect, useState } from 'react';

const Spotlight = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [position, setPosition] = useState({ x: -1000, y: -1000 });

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
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(138, 43, 226, 0.08), transparent 40%)`
      }}
    />
  );
};

export default Spotlight;
