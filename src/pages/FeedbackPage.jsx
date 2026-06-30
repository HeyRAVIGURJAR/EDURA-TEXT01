import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug, Lightbulb, BookOpen, Palette, Zap, MessageCircle,
  ArrowRight, ArrowLeft, Paperclip, CheckCircle2, Send,
} from 'lucide-react';
import { sanitizeInput } from '../utils/sanitize';
import { useNotificationStore } from '../store/useNotificationStore';
import './FeedbackPage.css';

const CATEGORIES = [
  {
    id: 'bug',
    icon: Bug,
    label: 'Bug / Error',
    desc: 'App crash, feature kaam nahi, login problem...',
    color: '#EF4444',
  },
  {
    id: 'feature',
    icon: Lightbulb,
    label: 'Feature Idea',
    desc: 'Naya feature, improvement, ya app better banayein...',
    color: '#F59E0B',
  },
  {
    id: 'content',
    icon: BookOpen,
    label: 'Content Request',
    desc: 'Naya institute, teacher, batch, ya subject chahiye...',
    color: '#3B82F6',
  },
  {
    id: 'uiux',
    icon: Palette,
    label: 'UI / UX',
    desc: 'Design, navigation, colors – app ki look and feel...',
    color: '#A855F7',
  },
  {
    id: 'performance',
    icon: Zap,
    label: 'Performance',
    desc: 'Slow loading, lag, battery drain, video buffering...',
    color: '#10B981',
  },
  {
    id: 'general',
    icon: MessageCircle,
    label: 'General',
    desc: 'Koi bhi baat – compliment, concern, ya kuch bhi!',
    color: '#00BFFF',
  },
];

const FeedbackPage = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanHeadline = sanitizeInput(headline);
    const cleanDescription = sanitizeInput(description);

    if (!cleanHeadline || !cleanDescription || !category) return;

    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      // Save to localStorage for demo
      const feedbacks = JSON.parse(localStorage.getItem('edura_feedbacks') || '[]');
      feedbacks.push({
        id: Date.now(),
        category,
        headline: cleanHeadline,
        description: cleanDescription,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('edura_feedbacks', JSON.stringify(feedbacks));

      setIsSubmitting(false);
      setStep(3);
      addNotification({ message: 'Feedback submitted successfully!', type: 'success' });
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setCategory(null);
    setHeadline('');
    setDescription('');
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 60 : -60,
      opacity: 0,
    }),
  };

  return (
    <div className="feedback-page">
      {/* Hero Header */}
      <motion.div
        className="fp-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="fp-hero-glow" />
        <h1 className="fp-title">
          Shape the Future of <span className="gradient-text">EDURA</span>
        </h1>
        <p className="fp-subtitle">
          Aapka feedback directly app improve karta hai. Har mahine top feedbacks pe kaam hota hai
          aur email pe update milta hai.
        </p>

        {/* Progress Indicator */}
        <div className="fp-progress">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`fp-progress-step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
              {step > s ? <CheckCircle2 size={16} /> : <span>{s}</span>}
            </div>
          ))}
          <div className="fp-progress-line">
            <div className="fp-progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          </div>
        </div>
      </motion.div>

      {/* Steps */}
      <div className="fp-content">
        <AnimatePresence mode="wait" custom={step}>
          {step === 1 && (
            <motion.div
              key="step1"
              className="fp-step"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="fp-step-title">Kis cheez ke baare mein batana hai?</h2>
              <div className="fp-category-grid">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <motion.button
                      key={cat.id}
                      className={`fp-category-card ${category === cat.id ? 'selected' : ''}`}
                      onClick={() => setCategory(cat.id)}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        '--cat-color': cat.color,
                      }}
                    >
                      <div className="fp-cat-icon-wrap">
                        <Icon size={24} />
                      </div>
                      <h3>{cat.label}</h3>
                      <p>{cat.desc}</p>
                      {category === cat.id && (
                        <motion.div
                          className="fp-cat-check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle2 size={20} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="fp-actions">
                <div />
                <motion.button
                  className="fp-next-btn"
                  disabled={!category}
                  onClick={() => setStep(2)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Aage badho</span>
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              className="fp-step"
              variants={slideVariants}
              custom={2}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
            >
              <h2 className="fp-step-title">Apni baat detail mein batao</h2>

              <div className="fp-form-group">
                <label className="fp-label">
                  Ek line mein batao <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="fp-input"
                  placeholder="e.g. Video player mein buffer ho raha hai"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={120}
                  required
                />
                <span className="fp-char-count">{headline.length}/120</span>
              </div>

              <div className="fp-form-group">
                <label className="fp-label">
                  Poori detail <span className="required">*</span>
                </label>
                <textarea
                  className="fp-textarea"
                  placeholder="Detail mein batao ki kya problem hai, kab hoti hai, kaunsa page/feature affected hai..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="fp-attachment-area">
                <Paperclip size={18} />
                <div>
                  <p>Screenshot ya recording attach karo</p>
                  <span>Max 5MB (PNG, JPG, MP4)</span>
                </div>
              </div>

              <div className="fp-actions">
                <button
                  type="button"
                  className="fp-back-btn"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <motion.button
                  type="submit"
                  className="fp-next-btn submit"
                  disabled={isSubmitting || !headline.trim() || !description.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="fp-spinner" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className="fp-step fp-success"
              variants={slideVariants}
              custom={3}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="fp-success-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h2>Shukriya!</h2>
              <p>
                Aapka feedback hume mil gaya hai. Humari team 48 ghante ke andar isko review karegi.
                Top feedbacks pe har mahine action liya jaata hai.
              </p>
              <motion.button
                className="fp-next-btn"
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Naya Feedback Do</span>
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedbackPage;
