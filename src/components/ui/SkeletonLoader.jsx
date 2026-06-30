import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-card glass-panel metallic-shimmer">
      <div className="skeleton-circle"></div>
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-subtitle"></div>
      <div className="skeleton-bottom-circle"></div>
    </div>
  );
};

export default SkeletonLoader;
