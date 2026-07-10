import React, { useId } from 'react';

const EduraLogo = ({ className = '', size = 32, subview = '', showText = true, showUnderline = false, style = {} }) => {
  const gradId = useId().replace(/:/g, '_');

  return (
    <div 
      className={`edura-logo-wrapper ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: `${Math.max(size * 0.25, 6)}px`, 
        userSelect: 'none',
        ...style 
      }}
    >
      <img
        src="/images/edura-logo-new.png"
        alt="Edura"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 8px rgba(139, 92, 246, 0.25))'
        }}
      />
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', lineHeight: '1.1' }}>
            <span
              className="edura-logo-text"
              style={{
                fontFamily: "'Inter', 'Outfit', sans-serif",
                fontWeight: '900',
                fontSize: `${size * 0.65}px`,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#ffffff',
                display: 'inline-block',
              }}
            >
              EDURA
            </span>
            {subview && (
              <>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.15)', 
                  fontSize: `${size * 0.55}px`, 
                  fontWeight: '200',
                  fontFamily: "'Inter', sans-serif",
                  margin: '0 1px',
                  lineHeight: '1',
                }}>
                  /
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', 'Outfit', sans-serif",
                    fontWeight: '700',
                    fontSize: `${size * 0.45}px`,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.75)',
                    display: 'inline-block',
                    lineHeight: '1',
                  }}
                >
                  {subview}
                </span>
              </>
            )}
          </div>
          
          {/* Parabolic Curve Underline with animated gradient flow */}
          {showUnderline && (
            <svg 
              width="100%" 
              height="6" 
              viewBox="0 0 100 10" 
              preserveAspectRatio="none" 
              style={{ 
                display: 'block', 
                marginTop: '2px',
                overflow: 'visible',
                pointerEvents: 'none'
              }}
            >
              <defs>
                <linearGradient id={`curveGrad-${gradId}`} x1="0%" y1="0%" x2="100%" y2="0%" spreadMethod="repeat">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="35%" stopColor="#9b51e0" />
                  <stop offset="70%" stopColor="#ff007f" />
                  <stop offset="100%" stopColor="#00f5ff" />
                  <animate attributeName="x1" values="0%;100%" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="100%;200%" dur="3s" repeatCount="indefinite" />
                </linearGradient>
              </defs>
              <path 
                d="M 0,2 Q 50,9 100,2" 
                fill="none" 
                stroke={`url(#curveGrad-${gradId})`} 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default EduraLogo;

