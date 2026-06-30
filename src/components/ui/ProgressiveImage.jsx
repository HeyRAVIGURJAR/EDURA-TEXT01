import React, { useState } from 'react';

const ProgressiveImage = ({ src, alt, className = "", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      className={`${className} transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-105'
      }`}
      {...props}
    />
  );
};

export default ProgressiveImage;
