import React, { useEffect, useState, useRef } from 'react';
import './ContextMenu.css';

const ContextMenu = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      
      // Keep menu within viewport bounds
      let x = e.clientX;
      let y = e.clientY;
      
      if (menuRef.current) {
        const { offsetWidth, offsetHeight } = menuRef.current;
        if (x + offsetWidth > window.innerWidth) x -= offsetWidth;
        if (y + offsetHeight > window.innerHeight) y -= offsetHeight;
      }
      
      setPosition({ x, y });
      setVisible(true);
    };

    const handleClick = () => setVisible(false);
    const handleScroll = () => setVisible(false);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="context-menu glass-panel" 
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
    >
      <div className="context-item" onClick={() => navigator.clipboard.writeText(window.location.href)}>
        <span>Copy Link</span>
        <span className="shortcut">⌘C</span>
      </div>
      <div className="context-item">
        <span>Share Badge</span>
        <span className="shortcut">⇧⌘S</span>
      </div>
      <div className="context-divider"></div>
      <div className="context-item">
        <span>Preferences</span>
        <span className="shortcut">⌘,</span>
      </div>
    </div>
  );
};

export default ContextMenu;
