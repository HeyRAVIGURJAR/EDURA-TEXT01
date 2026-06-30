import React from 'react';
import './SupportPage.css';

const SupportPage = () => {
  return (
    <div className="support-container">
      <div className="support-card glass-panel">
        <div className="support-header">
          <div className="support-avatar">
            <span className="neon-text">RG</span>
          </div>
          <h2>Ravi Gurjar</h2>
          <p className="support-role">Lead Developer & Support</p>
        </div>
        
        <div className="support-body">
          <p>If you face any issues with the platform, batches, or your account, feel free to reach out directly to the developer team.</p>
          
          <div className="contact-links">
            <a href="mailto:hey.ravigurjar@gmail.com" className="contact-card glass-panel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <div>
                <h4>Email Support</h4>
                <span>hey.ravigurjar@gmail.com</span>
              </div>
            </a>
            
            <a href="https://t.me/noble_emir" target="_blank" rel="noopener noreferrer" className="contact-card glass-panel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              <div>
                <h4>Telegram Direct</h4>
                <span>@noble_emir</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
