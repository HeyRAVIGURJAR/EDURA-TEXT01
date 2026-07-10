import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, FileText, Bookmark, Download, Bot, Lightbulb, Clock, 
  MessageSquare, Trophy, Star, Gift, Book, Send, LifeBuoy, Smartphone, Music, Heart, Radio, Clapperboard
} from 'lucide-react';
import './MorePage.css';

const FEATURE_CATEGORIES = [
  {
    title: "🎓 Academic & Study",
    items: [
      { id: 'practice', label: 'Practice & DPPs', icon: HelpCircle, path: '/dashboard/practice', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      { id: 'tests', label: 'Test Series', icon: FileText, path: '/dashboard/tests', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      { id: 'live', label: 'Live Classes', icon: Radio, path: '/dashboard/live', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
      { id: 'ott', label: 'EW OTT', icon: Clapperboard, path: '/dashboard/ott', color: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)', badge: 'NEW' },
    ]
  },
  {
    title: "📚 Revision & Downloads",
    items: [
      { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, path: '/dashboard/bookmarks', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
      { id: 'downloads', label: 'Offline Downloads', icon: Download, path: '/dashboard/downloads', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)' },
      { id: 'favorites', label: 'Favorites', icon: Heart, path: '/dashboard/favorites', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
      { id: 'library', label: 'Library & Books', icon: Book, path: '/dashboard/library', color: '#84cc16', bg: 'rgba(132, 204, 22, 0.1)' },
    ]
  },
  {
    title: "👥 Community & Social",
    items: [
      { id: 'community', label: 'Community Feed', icon: MessageSquare, path: '/dashboard/community', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
      { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/dashboard/leaderboard', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      { id: 'arena', label: 'Challenges Arena', icon: Star, path: '/dashboard/arena', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
    ]
  },
  {
    title: "⚙️ Extras & Support",
    items: [
      { id: 'refer', label: 'Refer & Earn Rewards', icon: Gift, path: '/dashboard/profile', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', query: 'tab=referral' },
      { id: 'feedback', label: 'Share Feedback', icon: Send, path: '/dashboard/feedback', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
      { id: 'support', label: 'Help & Support', icon: LifeBuoy, path: '/dashboard/support', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
      { id: 'apps', label: 'Download EW App', icon: Smartphone, path: '/dashboard/apps', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
    ]
  }
];

const MorePage = () => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item.id === 'refer') {
      navigate('/dashboard/profile');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('switch-profile-tab', { detail: 'referral' }));
      }, 100);
    } else {
      navigate(item.path);
    }
  };

  const triggerMusic = () => {
    window.dispatchEvent(new Event('toggle-music'));
  };

  return (
    <div className="more-page-container">
      <div className="more-page-header">
        <h1>More Features & Tools</h1>
        <p>Access all revision toolkits, practice engines, and AI helpers in one unified dashboard.</p>
      </div>

      {/* Quick Player Option */}
      <div className="more-page-hero-card glass-panel" onClick={triggerMusic}>
        <div className="hero-card-left">
          <div className="music-glow-icon">
            <Music size={24} />
          </div>
          <div>
            <h3>Edura Zen Music Player</h3>
            <p>Listen to Lo-Fi study beats and binaural focus audio tracks.</p>
          </div>
        </div>
        <button className="zen-play-btn">Launch Player</button>
      </div>

      <div className="more-page-categories">
        {FEATURE_CATEGORIES.map((cat, cIdx) => (
          <div key={cIdx} className="category-section">
            <h2 className="category-title">{cat.title}</h2>
            <div className="category-grid">
              {cat.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id} 
                    className="feature-item-card glass-panel" 
                    onClick={() => handleItemClick(item)}
                  >
                    <div 
                      className="feature-icon-wrapper" 
                      style={{ color: item.color, backgroundColor: item.bg }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="feature-label-group">
                      <span className="feature-label">{item.label}</span>
                      {item.badge && <span className="feature-item-badge">{item.badge}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MorePage;
