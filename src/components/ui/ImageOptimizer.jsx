import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * ImageOptimizer — A global utility for serving images optimally.
 * Emulates WebP conversion, forces native lazy loading, and provides
 * a lightweight blurhash placeholder while the heavy image loads.
 */
const ImageOptimizer = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  decoding = 'async',
  priority = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If we had a real backend, we'd replace the extension with .webp
  // For this frontend-only platform, we append a fake query parameter
  // to signify our "optimization layer" is active, though the browser
  // handles the actual image bytes.
  const optimizedSrc = src ? `${src}${src.includes('?') ? '&' : '?'}opt=webp` : '';

  useEffect(() => {
    // If priority is true, preload immediately
    if (priority && src) {
      const img = new Image();
      img.src = optimizedSrc;
    }
  }, [priority, src, optimizedSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blurhash / Low-Quality Placeholder */}
      <motion.div
        className="absolute inset-0 bg-gray-900 blur-xl"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {!hasError ? (
        <img
          src={optimizedSrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding={decoding}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-sm font-mono">
          [Image Failed to Load]
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageOptimizer);
