import React, { useEffect, useState } from 'react';
import './CommandPalette.css';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="palette-overlay" onClick={() => setIsOpen(false)}>
      <div className="palette-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="palette-header">
          <input 
            type="text" 
            className="palette-input" 
            placeholder="Search badges, batches, or actions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="palette-body">
          <div className="palette-group">
            <h4 className="palette-group-title">Quick Actions</h4>
            <div className="palette-item">Go to Dashboard</div>
            <div className="palette-item">View Recent Badges</div>
            <div className="palette-item">Toggle Audio Sensory</div>
          </div>
        </div>
        <div className="palette-footer">
          <span className="shortcut-hint"><kbd>esc</kbd> to close</span>
          <span className="shortcut-hint"><kbd>↵</kbd> to select</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
