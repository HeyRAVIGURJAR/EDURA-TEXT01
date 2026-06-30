import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Library, FileText, Clapperboard, MessageSquare, 
  Trophy, Bot, Lightbulb, LifeBuoy, Bell, ChevronLeft, ChevronRight,
  Star, BookOpen, ShieldBan, Send, Book, Settings, User, Smartphone, Gift, Clock, Heart, Music
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import MusicPlayer from './MusicPlayer';
import ReferralModal from '../features/ReferralModal';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const userObj = useAuthStore((s) => s.user);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  
  const profilePic = localStorage.getItem(`edura_profile_pic_${userObj?.id}`) || '';

  // Live Time state
  const [time, setTime] = useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };


  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={onMobileClose} />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        
        {/* Transparent Shadow Box for Logo & Time (Vertical Group) */}
        <div className="sidebar-brand-box" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          margin: '12px 12px 20px 12px',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Logo Section */}
          <div className="sidebar-header" style={{ padding: 0, margin: 0, background: 'none', border: 'none' }}>
            <div className="sidebar-logo" style={{ width: collapsed ? 'auto' : '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
              {collapsed ? (
                <div className="sidebar-logo-icon">E</div>
              ) : (
                <img 
                  src="/artifacts/media__1782815915641.png" 
                  alt="EDURA Logo" 
                  className="logo-img-alt" 
                  style={{ 
                    transition: 'transform 0.3s ease', 
                    cursor: 'pointer', 
                    filter: 'invert(1)', 
                    objectFit: 'contain',
                    height: '32px',
                    width: 'auto'
                  }} 
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} 
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'} 
                />
              )}
            </div>
            <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              {collapsed ? <ChevronRight size={18} color="#06B6D4" /> : <ChevronLeft size={18} color="#06B6D4" />}
            </button>
          </div>

          {/* Time Element */}
          {!collapsed && (
            <div className="sidebar-time-element" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <Clock size={16} color="#8B5CF6" className="animate-pulse" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.05em' }}>
                {formatTime(time)}
              </span>
            </div>
          )}
        </div>

        {/* XP Bar */}
        <div className="sidebar-xp" style={{ margin: '0 12px 20px 12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <span className="sidebar-xp-icon"><Star fill="#f59e0b" color="#f59e0b" size={18} className="animate-spin-slow" /></span>
          <div className="sidebar-xp-text">
            <span className="xp-value" style={{ color: '#FCD34D' }}>4,280 XP</span>
            <span className="xp-label">Scholar Rank</span>
          </div>
        </div>

        {/* Main Nav */}
        <div className="sidebar-section-title">Main</div>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose} end>
          <span className="sidebar-icon"><LayoutDashboard size={20} /></span>
          <span className="sidebar-label">Dashboard</span>
        </NavLink>
        <NavLink to="/dashboard/batches" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Library size={20} /></span>
          <span className="sidebar-label">My Batches</span>
        </NavLink>
        <NavLink to="/dashboard/tests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><FileText size={20} /></span>
          <span className="sidebar-label">Test Series</span>
        </NavLink>
        <NavLink to="/dashboard/favorites" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Heart size={20} /></span>
          <span className="sidebar-label">Favorites</span>
        </NavLink>

        {/* EDURA OTT */}
        <div className="sidebar-section-title">Entertainment</div>
        <NavLink to="/dashboard/ott" className={({ isActive }) => `sidebar-link ott-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Clapperboard size={20} /></span>
          <span className="sidebar-label">EDURA OTT</span>
          <span className="ott-badge">NEW</span>
        </NavLink>

        {/* Community */}
        <div className="sidebar-section-title">Community</div>
        <NavLink to="/dashboard/community" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><MessageSquare size={20} /></span>
          <span className="sidebar-label">Community</span>
        </NavLink>
        <NavLink to="/dashboard/leaderboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Trophy size={20} /></span>
          <span className="sidebar-label">Leaderboard</span>
        </NavLink>

        {/* Tools */}
        <div className="sidebar-section-title">Tools</div>
        <button 
          onClick={() => { setIsReferModalOpen(true); if (onMobileClose) onMobileClose(); }} 
          className="sidebar-link w-full text-left bg-transparent border-none font-inherit cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="sidebar-icon"><Gift size={20} className="text-purple-400 group-hover:animate-bounce" /></span>
          <span className="sidebar-label font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Refer & Earn</span>
        </button>
        <NavLink to="/dashboard/ai-buddy" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Bot size={20} /></span>
          <span className="sidebar-label">StudyBuddy AI</span>
        </NavLink>
        <NavLink to="/dashboard/feedback" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Send size={20} /></span>
          <span className="sidebar-label">Feedback</span>
        </NavLink>
        <NavLink to="/dashboard/support" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><LifeBuoy size={20} /></span>
          <span className="sidebar-label">Support</span>
        </NavLink>

        {/* Books & Library and Profile settings */}
        <NavLink to="/dashboard/library" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Book size={20} /></span>
          <span className="sidebar-label">Library & Books</span>
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><User size={20} /></span>
          <span className="sidebar-label">Profile Settings</span>
        </NavLink>
        <NavLink to="/dashboard/apps" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Smartphone size={20} /></span>
          <span className="sidebar-label">Get App</span>
        </NavLink>

        <button 
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new Event('toggle-music'));
            if (onMobileClose) onMobileClose();
          }} 
          className="sidebar-link"
        >
          <span className="sidebar-icon"><Music size={20} /></span>
          <span className="sidebar-label">Music Player</span>
        </button>

        {/* Notifications */}
        <NavLink to="/dashboard/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Bell size={20} /></span>
          <span className="sidebar-label">Notifications</span>
          <span className="sidebar-notif-dot" />
        </NavLink>

        {/* Admin Panel (visible only to admins) */}
        {isAdmin && (
          <>
            <div className="sidebar-section-title">Admin</div>
            <NavLink to="/admin-dashboard" className={({ isActive }) => `sidebar-link admin-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
              <span className="sidebar-icon"><ShieldBan size={20} /></span>
              <span className="sidebar-label">Admin Panel</span>
            </NavLink>
          </>
        )}

        {/* Global Mini Player has been removed to prevent overlap, GlobalAudioPlayer handles music now */}

        {/* User Profile Footer */}
        <div 
          className="sidebar-user" 
          onClick={() => navigate('/dashboard/profile')} 
          style={{ cursor: 'pointer' }}
        >
          <div className="sidebar-user-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.25rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {profilePic ? (
                <img src={profilePic} alt="Avatar" className="sidebar-user-avatar-img" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div className="sidebar-user-avatar">{userObj?.username?.charAt(0).toUpperCase() || 'S'}</div>
              )}
              <div className="sidebar-user-info" style={{ display: collapsed ? 'none' : 'block' }}>
                <div className="user-name" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{userObj?.username || 'Student'}</div>
                <div className="user-role" style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>Settings</div>
              </div>
            </div>
            {!collapsed && <Settings size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />}
          </div>
        </div>
      </aside>

      {/* Referral Modal Overlay */}
      <ReferralModal isOpen={isReferModalOpen} onClose={() => setIsReferModalOpen(false)} />
    </>
  );
};

export default React.memo(Sidebar);
