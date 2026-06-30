import React from 'react';
import './RadialProgress.css';

const RadialProgress = ({ progress = 0, size = 100, strokeWidth = 8, color = 'var(--color-neon-primary)' }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="radial-progress-wrapper" style={{ width: size, height: size }}>
      <svg className="radial-progress-svg" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="radial-progress-bg"
          stroke="rgba(255, 255, 255, 0.1)"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="radial-progress-bar"
          stroke={color}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default RadialProgress;
