import { useEffect } from 'react';

/**
 * SmoothScroll — Lightweight Lenis-like smooth scrolling using CSS.
 * Since we can't install the `lenis` npm package, this applies
 * CSS scroll-behavior: smooth globally and a lightweight JS
 * scroll easing for a premium, fluid feel.
 * 
 * Drop-in: just mount <SmoothScroll /> once in App.
 */
const SmoothScroll = () => {
  useEffect(() => {
    // Apply CSS smooth scroll to html element
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Smooth anchor link handling
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      
      const id = target.getAttribute('href').slice(1);
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return null;
};

export default SmoothScroll;
