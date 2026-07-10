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
  priority = false,
  fallbackSrc = '/images/hero-2.png'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const activeSrc = useFallback ? fallbackSrc : src;
  const optimizedSrc = activeSrc ? `${activeSrc}${activeSrc.includes('?') ? '&' : '?'}opt=webp` : '';

  useEffect(() => {
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
      
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding={decoding}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!useFallback) {
            setUseFallback(true);
          } else {
            setHasError(true);
            setIsLoaded(true);
          }
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'opacity' }}
      />
    </div>
  );
};

export default React.memo(ImageOptimizer);
