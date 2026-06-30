import React from 'react';
import './EduraPreloader.css';

const EduraPreloader = ({ message = 'Loading...' }) => {
  return (
    <div className="edura-preloader">
      <div className="preloader-inner">
        <div className="preloader-glow-ring" />
        <div className="preloader-logo-container">
          <img
            src="/images/edura-logo.jpg.jpg"
            alt="EDURA Loading"
            className="preloader-logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="preloader-logo-fallback" style={{ display: 'none' }}>
            <span className="preloader-letter">E</span>
          </div>
        </div>
        <div className="preloader-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <p className="preloader-message">{message}</p>
      </div>
    </div>
  );
};

export default EduraPreloader;
