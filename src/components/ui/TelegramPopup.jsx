import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Rocket } from 'lucide-react';
import './TelegramPopup.css';

const TelegramPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('edura_telegram_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('edura_telegram_seen', 'true');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'EDURA - The Premium Learning Platform',
          text: 'Join the EDURA community on Telegram for the best study materials and updates!',
          url: 'https://t.me/InEducationAORAFarming',
        });
      } else {
        await navigator.clipboard.writeText('https://t.me/InEducationAORAFarming');
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="telegram-popup-overlay">
      <div className="community-popup">
        <button className="community-close" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="community-icon-wrapper flex items-center justify-center">
          <div className="community-icon flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-400 fill-purple-400/20 drop-shadow-[0_0_12px_rgba(168,85,247,0.9)] animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>
        
        <h2 className="community-title">Join Our Community</h2>
        <p className="community-subtitle">
          Stay updated with latest materials, notes, PDFs and important notifications.
        </p>
        
        <div className="community-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <a 
            href="https://t.me/InEducationAORAFarming" 
            target="_blank" 
            rel="noopener noreferrer"
            className="community-btn btn-telegram"
            onClick={handleClose}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            Join Telegram
          </a>
          <button 
            onClick={handleShare}
            className="community-btn"
            style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Share with Friends
          </button>
        </div>
      </div>
    </div>
  );
};

// Use createPortal to ensure the fixed overlay covers the whole screen
const TelegramPopupWrapper = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return ReactDOM.createPortal(<TelegramPopup />, document.body);
};

export default TelegramPopupWrapper;
