import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Heart } from 'lucide-react';
import ImageOptimizer from '../ui/ImageOptimizer';
import GhostGlowCard from '../ui/GhostGlowCard';
import './BadgeCard.css';

const BadgeCard = ({ 
  badge, 
  onLike, 
  isLiked = false 
}) => {
  const navigate = useNavigate();

  // Handle study navigation
  const handleStudyClick = () => {
    navigate(`/dashboard/batch/${badge.id}`);
  };

  // Mock target details if not provided
  const targetDesc = badge.description || "Targeted Batch for JEE/NEET & CBSE Boards Aspirants";
  const startEndDates = "Starts on 10 Jul 2026 | Ends on 15 Mar 2027";

  return (
    <GhostGlowCard 
      className="stitch-border pw-batch-card glass-panel h-full"
      style={{ '--stitch-bg': '#0f172a' }}
      whileHover={{ 
        scale: 1.02, 
        rotateX: 2, 
        rotateY: 2, 
        boxShadow: "0px 10px 30px rgba(138, 43, 226, 0.4)" 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Thumbnail Area */}
      <div className="pw-image-wrap">
        <ImageOptimizer 
          src={badge.image || "/images/hero-1.png"} 
          alt={badge.name} 
          className="pw-thumbnail w-full"
        />
        {/* Pink Hinglish Tag */}
        <span className="pw-language-tag">Hinglish</span>

        {/* Like Button (Top Right) */}
        <button 
          className={`pw-like-btn ${isLiked ? 'liked' : ''}`}
          style={{ zIndex: 10 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onLike) onLike(badge.id);
          }}
          aria-label="Add to favorites"
        >
          <Heart size={16} fill={isLiked ? "var(--color-primary)" : "none"} />
        </button>
      </div>

      {/* Card Info Content */}
      <div className="pw-info-wrap">
        <div className="pw-title-row">
          <h3 className="pw-title">{badge.name}</h3>
          <span className="pw-badge-new">New</span>
        </div>

        {/* Gray Info Rows */}
        <div className="pw-details-list">
          <div className="pw-detail-row">
            <BookOpen size={14} className="pw-detail-icon" />
            <span className="pw-detail-text">{targetDesc}</span>
          </div>
          <div className="pw-detail-row">
            <Calendar size={14} className="pw-detail-icon" />
            <span className="pw-detail-text">{startEndDates}</span>
          </div>
        </div>

        {/* Pricing Row */}
        <div className="pw-pricing-row">
          <span className="pw-price-free">₹ FREE</span>
          <span className="pw-free-badge">100% Free For Students</span>
        </div>
      </div>

      {/* Action Buttons 50/50 Split */}
      <div className="pw-buttons-row">
        <button 
          className="pw-btn pw-btn-study"
          onClick={handleStudyClick}
        >
          Study Now
        </button>
        <button 
          className="pw-btn pw-btn-unenroll"
          onClick={() => {
            alert(`Enrolled in ${badge.name}`);
          }}
        >
          Enroll Now
        </button>
      </div>
    </GhostGlowCard>
  );
};

export default React.memo(BadgeCard);
