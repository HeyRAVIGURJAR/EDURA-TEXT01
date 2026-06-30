import React, { useState, useEffect } from 'react';
import './ThemeSelectorModal.css';

const THEMES = [
  { id: 'light', name: 'Light Mode', icon: '☀️' },
  { id: 'dark', name: 'Dark Mode', icon: '🌙' },
  { id: 'cyberpunk-red', name: 'Cyberpunk Red', icon: '🔴' },
  { id: 'lavender-dreams', name: 'Lavender Dreams', icon: '💜' },
  { id: 'emerald-city', name: 'Emerald City', icon: '💚' },
  { id: 'ocean', name: 'Ocean Deep', icon: '🌊' },
  { id: 'dracula', name: 'Dracula Midnight', icon: '🧛' },
  { id: 'custom', name: 'Custom HSL', icon: '🎨' },
];

const ThemeSelectorModal = ({ isOpen, onClose, currentTheme, onSelectTheme }) => {
  const [hue, setHue] = useState(250);
  const [saturation, setSaturation] = useState(80);
  const [lightness, setLightness] = useState(60);

  useEffect(() => {
    if (currentTheme === 'custom') {
      applyCustomHSL(hue, saturation, lightness);
    }
  }, [hue, saturation, lightness, currentTheme]);

  const applyCustomHSL = (h, s, l) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', `hsl(${h}, ${s}%, ${l}%)`);
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${h}, ${s}%, ${l}%), hsl(${h + 30}, ${s}%, ${l - 10}%))`);
    // More variables can be dynamically updated based on HSL here
  };

  const resetCustomHSL = () => {
    const root = document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--gradient-primary');
  };

  const handleSelect = (id) => {
    if (id !== 'custom') {
      resetCustomHSL();
    }
    onSelectTheme(id);
  };

  if (!isOpen) return null;

  return (
    <div className="theme-modal-overlay visible" onClick={onClose}>
      <div className="theme-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="theme-modal-header">
          <h3>Theme Engine</h3>
          <button className="theme-modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="theme-grid">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
              onClick={() => handleSelect(theme.id)}
            >
              <div className="theme-icon">{theme.icon}</div>
              <span>{theme.name}</span>
              {currentTheme === theme.id && <div className="theme-active-indicator">✔</div>}
            </button>
          ))}
        </div>

        {currentTheme === 'custom' && (
          <div className="custom-hsl-panel fade-up visible">
            <h4>Custom HSL Control</h4>
            
            <div className="hsl-control">
              <label>Hue ({hue})</label>
              <input 
                type="range" 
                min="0" max="360" 
                value={hue} 
                onChange={(e) => setHue(e.target.value)} 
                className="hsl-slider hue-slider"
              />
            </div>
            
            <div className="hsl-control">
              <label>Saturation ({saturation}%)</label>
              <input 
                type="range" 
                min="0" max="100" 
                value={saturation} 
                onChange={(e) => setSaturation(e.target.value)} 
                className="hsl-slider"
              />
            </div>

            <div className="hsl-control">
              <label>Lightness ({lightness}%)</label>
              <input 
                type="range" 
                min="0" max="100" 
                value={lightness} 
                onChange={(e) => setLightness(e.target.value)} 
                className="hsl-slider"
              />
            </div>

            <div 
              className="color-preview" 
              style={{ background: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelectorModal;
