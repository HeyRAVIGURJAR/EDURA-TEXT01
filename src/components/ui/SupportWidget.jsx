import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, HeartHandshake, BookOpen } from 'lucide-react';
import { submitSupportMessage } from '../../services/api';
import { sanitizeInput } from '../../utils/sanitize';
import './SupportWidget.css';

const ADMINS = [
  { name: 'Admin 1', username: '@noble_emir' },
  { name: 'Admin 2', username: '@cloudycache' },
  { name: 'Admin 3', username: '@PearlFlare' },
  { name: 'Admin 4', username: '@r_ohit_1702' },
];

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('academic'); // 'academic' | 'emotional'
  const [message, setMessage] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('@noble_emir');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanMsg = sanitizeInput(message);
    if (!cleanMsg.trim()) return;

    setIsSending(true);
    try {
      const result = await submitSupportMessage(cleanMsg, selectedAdmin);
      if (result.success) {
        setSuccess(true);
        setMessage('');
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        alert('Failed to send support ticket. Simulating local backup log.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="support-widget-container">
      {/* Trigger floating button */}
      <motion.button 
        className="support-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Main Support Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="support-panel glass-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="support-panel-header">
              <div className="bot-avatar-wrapper">
                <div className="bot-avatar">🤖</div>
                <span className="online-dot" />
              </div>
              <div className="bot-header-text">
                <h5>EDURA Assistant</h5>
                <p>Always online to help you</p>
              </div>
            </div>

            {/* Framer Motion Sliding Tabs */}
            <div className="support-tabs">
              <button 
                className={`support-tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
                onClick={() => setActiveTab('academic')}
              >
                <BookOpen size={14} />
                <span>Academic</span>
                {activeTab === 'academic' && (
                  <motion.div className="support-tab-active-pill" layoutId="activeSupportTab" />
                )}
              </button>
              <button 
                className={`support-tab-btn ${activeTab === 'emotional' ? 'active' : ''}`}
                onClick={() => setActiveTab('emotional')}
              >
                <HeartHandshake size={14} />
                <span>Emotional</span>
                {activeTab === 'emotional' && (
                  <motion.div className="support-tab-active-pill" layoutId="activeSupportTab" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="support-content-body">
              {activeTab === 'academic' ? (
                <div className="support-academic-view">
                  <p className="support-instruction-text">
                    Ask dynamic academic doubt support, raise batch issues, or suggest updates.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="support-widget-form">
                    <div className="support-form-group">
                      <label>Select Preferred Admin Counselor:</label>
                      <div className="admin-buttons-grid">
                        {ADMINS.map((admin) => (
                          <button
                            key={admin.username}
                            type="button"
                            className={`admin-select-chip ${selectedAdmin === admin.username ? 'active' : ''}`}
                            onClick={() => setSelectedAdmin(admin.username)}
                          >
                            {admin.name} ({admin.username})
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="support-form-group">
                      <textarea
                        placeholder="Type your question or issue details here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={3}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="support-submit-send-btn"
                      disabled={isSending || !message.trim()}
                    >
                      {isSending ? 'Sending Ticket...' : 'Send to Telegram'}
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="support-emotional-view">
                  <div className="emotional-greeting">
                    <h4>Namaste! 🙏</h4>
                    <p>
                      Hum samajhte hain padhai ka pressure zyada ho sakta hai. 
                      Aap yahan aaram se apni baat share kar sakte hain. We are here to support your mental wellbeing.
                    </p>
                  </div>
                  
                  <div className="support-form-group">
                    <label>Reach out directly to counselor admins:</label>
                    <div className="admin-buttons-grid col-2">
                      {ADMINS.map((admin) => (
                        <a
                          key={admin.username}
                          href={`https://t.me/${admin.username.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-link-card-3d"
                        >
                          {admin.name} ({admin.username})
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Success message overlay */}
              <AnimatePresence>
                {success && (
                  <motion.div 
                    className="support-success-overlay"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span>✓ Ticket Sent! Admins notified via Telegram Bot.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportWidget;
