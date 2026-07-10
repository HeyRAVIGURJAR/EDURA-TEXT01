import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Heart, Users, Zap, Lock } from 'lucide-react';
import ImageOptimizer from '../ui/ImageOptimizer';
import GhostGlowCard from '../ui/GhostGlowCard';
import './BadgeCard.css';

const BadgeCard = ({ 
  badge, 
  onLike, 
  isLiked = false 
}) => {
  const navigate = useNavigate();

  // Force all batches to be free
  const price = 0;
  const isFree = true;
  const priceDisplay = '₹ FREE';

  // Derive subjects/content count
  const subjectCount = badge.subjects?.length || badge.subjectCount || null;

  // Handle study navigation — Coming Soon
  const handleStudyClick = () => {
    alert('Coming Soon! 🚀 Our educators are preparing premium content for this batch. Stay tuned!');
  };

  const targetDesc = badge.description || "Targeted Batch for JEE/NEET & CBSE Boards Aspirants";

  return (
    <GhostGlowCard 
      className="stitch-border pw-batch-card glass-panel h-full"
      style={{ '--stitch-bg': '#0f172a' }}
      whileHover={{ 
        scale: 1.015, 
        boxShadow: "0px 12px 32px rgba(138, 43, 226, 0.35)" 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* Thumbnail Area */}
      <div className="pw-image-wrap">
        <ImageOptimizer 
          src={badge.image || "/images/hero-2.png"} 
          alt={badge.name} 
          className="pw-thumbnail w-full"
        />
        {/* Pink Hinglish Tag */}
        <span className="pw-language-tag">Hinglish</span>

        {/* Like Button (Top Right) */}
        <motion.button 
          className={`pw-like-btn ${isLiked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onLike) onLike(badge.id);
          }}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          whileTap={{ scale: 0.85 }}
          style={{ zIndex: 99 }}
        >
          <Heart size={16} fill={isLiked ? "#ef4444" : "rgba(0,0,0,0.3)"} color={isLiked ? "#ef4444" : "#cbd5e1"} />
        </motion.button>
      </div>

      {/* Card Info Content */}
      <div className="pw-info-wrap">
        <div className="pw-title-row">
          <h3 className="pw-title">{badge.name}</h3>
          {badge.name?.includes('2027') && <span className="pw-badge-new">New</span>}
        </div>

        {/* Detail Rows */}
        <div className="pw-details-list">
          <div className="pw-detail-row">
            <BookOpen size={13} className="pw-detail-icon" />
            <span className="pw-detail-text">{targetDesc}</span>
          </div>
          {subjectCount && (
            <div className="pw-detail-row">
              <Zap size={13} className="pw-detail-icon" />
              <span className="pw-detail-text">{subjectCount} Subjects Covered</span>
            </div>
          )}
          <div className="pw-detail-row">
            <Users size={13} className="pw-detail-icon" />
            <span className="pw-detail-text">
              {badge.byName ? `By ${badge.byName}` : "By Top Educators"}
            </span>
          </div>
        </div>

        {/* Pricing Row */}
        <div className="pw-pricing-row">
          <span className="pw-price-free">
            {priceDisplay}
          </span>
          <span className="pw-free-badge">100% Free</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pw-buttons-row">
        <button 
          className="pw-btn pw-btn-study"
          onClick={handleStudyClick}
        >
          Study Now
        </button>
        <button 
          className={`pw-btn ${isLiked ? 'pw-btn-enrolled' : 'pw-btn-enroll'}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onLike) onLike(badge.id);
          }}
        >
          {isLiked ? '✓ Saved' : 'Enroll'}
        </button>
      </div>
    </GhostGlowCard>
  );
};

export default React.memo(BadgeCard);
