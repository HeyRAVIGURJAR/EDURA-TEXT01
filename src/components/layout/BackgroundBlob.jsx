import React, { useEffect, useRef } from 'react';
import './BackgroundBlob.css';

const BackgroundBlob = () => {
  const blobRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const animateBlob = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (blobRef.current) {
        blobRef.current.style.left = `${currentX}px`;
        blobRef.current.style.top = `${currentY}px`;
      }
      animationFrameId = requestAnimationFrame(animateBlob);
    };

    const handlePointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("pointermove", handlePointerMove);
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
