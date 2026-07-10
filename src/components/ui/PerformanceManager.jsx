import React, { useEffect } from 'react';

const PerformanceManager = () => {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCount = 0;
    let checkInterval;

    const measure = () => {
      frameCount++;
      requestAnimationFrame(measure);
    };

    // Start measuring frames
    const animId = requestAnimationFrame(measure);

    // Every 2.5 seconds, calculate FPS
    checkInterval = setInterval(() => {
      const now = performance.now();
      const delta = now - lastTime;
      const fps = (frameCount * 1000) / delta;

      frameCount = 0;
      lastTime = now;

      // If FPS drops below 48, count it as a lag event
      if (fps < 48) {
        lowFpsCount++;
        // If we get 3 consecutive lag checks, activate low-end mode
        if (lowFpsCount >= 3) {
          document.documentElement.classList.add('perf-low-end');
          console.warn("[Edura Performance Manager] FPS dropped to", Math.round(fps), "- Optimizing rendering for low-spec device.");
        }
      } else {
        lowFpsCount = Math.max(0, lowFpsCount - 1);
        if (lowFpsCount === 0) {
          document.documentElement.classList.remove('perf-low-end');
        }
      }
    }, 2500);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(checkInterval);
    };
  }, []);

  return null;
};

export default PerformanceManager;
