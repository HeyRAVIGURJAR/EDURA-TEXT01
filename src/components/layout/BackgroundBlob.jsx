import React, { useEffect, useRef } from 'react';
import './BackgroundBlob.css';

const BackgroundBlob = () => {
  const blobRef = useRef(null);

  useEffect(() => {
    // Detect touch/mobile screens
    const isTouch = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );

    // On touch/mobile screens, keep the blob static to save CPU/GPU cycles
    if (isTouch) {
      if (blobRef.current) {
        blobRef.current.style.left = '50%';
        blobRef.current.style.top = '50%';
      }
      return;
    }

    let animationFrameId = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let animating = false;

    const animateBlob = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      // If the blob has caught up with the cursor, pause the animation frame loop
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        currentX = targetX;
        currentY = targetY;
        if (blobRef.current) {
          blobRef.current.style.left = `${currentX}px`;
          blobRef.current.style.top = `${currentY}px`;
        }
        animating = false;
        animationFrameId = null;
        return;
      }

      currentX += dx * 0.05;
      currentY += dy * 0.05;

      if (blobRef.current) {
        blobRef.current.style.left = `${currentX}px`;
        blobRef.current.style.top = `${currentY}px`;
      }
      animationFrameId = requestAnimationFrame(animateBlob);
    };

    const handlePointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      // Only start requestAnimationFrame loop if not already animating
      if (!animating) {
        animating = true;
        animationFrameId = requestAnimationFrame(animateBlob);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    
    // Initial centering animation
    animating = true;
    animationFrameId = requestAnimationFrame(animateBlob);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="blob-blur"></div>
      <div id="blob" ref={blobRef}></div>
    </>
  );
};

export default BackgroundBlob;
