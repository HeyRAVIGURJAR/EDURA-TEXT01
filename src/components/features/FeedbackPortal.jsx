import React, { useState } from 'react';
import { sanitizeInput } from '../../utils/sanitize';
import './FeedbackPortal.css';

const CATEGORIES = [
  { id: 'bug', icon: '🐛', label: 'Bug Report' },
  { id: 'feature', icon: '✨', label: 'Feature Request' },
  { id: 'content', icon: '📚', label: 'Content Issue' },
  { id: 'uiux', icon: '🎨', label: 'UI/UX' },
  { id: 'perf', icon: '⚡', label: 'Performance' },
  { id: 'general', icon: '💬', label: 'General' },
];

const FeedbackPortal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [sentiment, setSentiment] = useState(5);
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Sanitize inputs
    const cleanHeadline = sanitizeInput(headline);
    const cleanDescription = sanitizeInput(description);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4); // Success step
    }, 1500);
  };

  const resetAndClose = () => {
    setStep(1);
    setCategory(null);
    setSentiment(5);
    setHeadline('');
    setDescription('');
    onClose();
  };

  return (
    <div className={`feedback-overlay ${isOpen ? 'visible' : ''}`} onClick={resetAndClose}>
      <div className="feedback-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {step < 4 && (
          <div className="feedback-header">
            <h2>
              <span>💡</span> EDURA Feedback
            </h2>
            <button className="feedback-close" onClick={resetAndClose}>✕</button>
          </div>
        )}

        <div className="feedback-body">
          {step === 1 && (
            <div className="fade-up visible">
              <h3 className="step-title">Step 1: What is this regarding?</h3>
              <div className="category-grid">
                {CATEGORIES.map((cat) => (
                  <div 
                    key={cat.id}
                    className={`category-card ${category === cat.id ? 'selected' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span className="category-label">{cat.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-premium" 
                  disabled={!category}
                  onClick={() => setStep(2)}
                  style={{ opacity: !category ? 0.5 : 1 }}
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-up visible">
              <h3 className="step-title">Step 2: How likely are you to recommend this feature/fix?</h3>
              <div className="slider-container">
                <div className="slider-value-display">{sentiment}</div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={sentiment}
                  onChange={(e) => setSentiment(parseInt(e.target.value))}
                  className="sentiment-slider"
                />
                <div className="slider-labels">
                  <span>0 - Bilkul nahi</span>
                  <span>10 - Zaroor karunga</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-premium" onClick={() => setStep(3)}>Next Step →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="fade-up visible">
              <h3 className="step-title">Step 3: Tell us more</h3>
              
              <div className="input-group">
                <input 
                  type="text" 
                  className="feedback-input" 
                  placeholder="Ek line mein batao (Headline)"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <textarea 
                  className="feedback-textarea" 
                  placeholder="Poori detail (Description)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="attachment-dropzone">
                <div className="attachment-icon">📎</div>
                <p>Click or drag to upload Screenshot/Recording</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Max 5MB (PNG, JPG, MP4)</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button type="submit" className="btn-premium" disabled={isSubmitting || !headline || !description}>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback ✨'}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="feedback-success fade-up visible">
              <div className="success-icon">✓</div>
              <h3>Thank You!</h3>
              <p>Your feedback is invaluable. Our team reviews all submissions within 48 hours.</p>
              <button className="btn-premium" style={{ marginTop: '2rem' }} onClick={resetAndClose}>
                Close Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPortal;
