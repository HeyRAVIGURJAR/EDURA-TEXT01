import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Library, FileText, Clapperboard, MessageSquare, 
  Trophy, Bot, Lightbulb, LifeBuoy, Bell, ChevronLeft, ChevronRight,
  Star, BookOpen, ShieldBan, Send, Book, Settings, User, Smartphone, Gift, Clock, Heart, Music, LogOut,
  Radio, Download, Bookmark, ClipboardList, HelpCircle, PenTool
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
  const logout = useAuthStore((s) => s.logout);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };
  
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
        
        {/* Sleek, frameless Logo Header */}
        <div className="sidebar-brand-box" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          margin: '8px 16px 24px 16px',
          padding: '0',
          position: 'relative'
        }}>
          {/* Logo Section */}
          <div className="sidebar-header" style={{ padding: '0 0 12px 0', margin: 0, background: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="sidebar-logo" style={{ width: collapsed ? 'auto' : '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
              {collapsed ? (
                <div className="pw-logo-circle" style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontFamily: 'Outfit, sans-serif',
                  border: '1.5px solid #5B56E6',
                  fontSize: '11px'
                }}>
                  EW
                </div>
              ) : (
                <div className="pw-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="pw-logo-circle" style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#000',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontFamily: 'Outfit, sans-serif',
                    border: '1.5px solid #5B56E6',
                    fontSize: '11px'
                  }}>
                    EW
                  </div>
                  <span className="pw-logo-text" style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: '800',
                    fontSize: '16px',
                    letterSpacing: '0.5px',
                    color: '#fff'
                  }}>
                    EDURA<span style={{ color: '#5B56E6', marginLeft: '2.5px' }}>WALLAH</span>
                  </span>
                </div>
              )}
            </div>
            <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              {collapsed ? <ChevronRight size={14} color="#5B56E6" /> : <ChevronLeft size={14} color="#5B56E6" />}
            </button>
          </div>

          {/* Time Element */}
          {!collapsed && (
            <div className="sidebar-time-element" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '2px 0',
              color: '#8b5cf6',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <Clock size={13} className="animate-pulse" />
              <span style={{ color: '#94a3b8', letterSpacing: '0.04em' }}>
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

        {/* LEARN SECTION */}
        <div className="sidebar-section-title">Learn</div>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose} end>
          <span className="sidebar-icon"><LayoutDashboard size={20} /></span>
          <span className="sidebar-label">Dashboard</span>
        </NavLink>
        <NavLink to="/dashboard/batches" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Library size={20} /></span>
          <span className="sidebar-label">My Batches</span>
        </NavLink>
        <NavLink to="/dashboard/live" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Radio size={20} /></span>
          <span className="sidebar-label">Live Classes</span>
        </NavLink>
        <NavLink to="/dashboard/ott" className={({ isActive }) => `sidebar-link ott-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Clapperboard size={20} /></span>
          <span className="sidebar-label">EW OTT</span>
          <span className="ott-badge">NEW</span>
        </NavLink>

        {/* PRACTICE SECTION */}
        <div className="sidebar-section-title">Practice</div>
        <NavLink to="/dashboard/dpp" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><HelpCircle size={20} /></span>
          <span className="sidebar-label">DPP / Practice</span>
        </NavLink>
        <NavLink to="/dashboard/tests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><FileText size={20} /></span>
          <span className="sidebar-label">Test Series</span>
        </NavLink>
        <NavLink to="/dashboard/pyqs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><ClipboardList size={20} /></span>
          <span className="sidebar-label">PYQs</span>
        </NavLink>
        <NavLink to="/dashboard/assignments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><PenTool size={20} /></span>
          <span className="sidebar-label">Assignments</span>
        </NavLink>

        {/* REVISION SECTION */}
        <div className="sidebar-section-title">Revision</div>
        <NavLink to="/dashboard/favorites" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Heart size={20} /></span>
          <span className="sidebar-label">Favorites</span>
        </NavLink>
        <NavLink to="/dashboard/bookmarks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Bookmark size={20} /></span>
          <span className="sidebar-label">Bookmarks</span>
        </NavLink>
        <NavLink to="/dashboard/downloads" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Download size={20} /></span>
          <span className="sidebar-label">Downloads</span>
        </NavLink>

        {/* AI TOOLS SECTION */}
        <div className="sidebar-section-title">AI Tools</div>
        <NavLink to="/dashboard/ai-buddy" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Bot size={20} /></span>
          <span className="sidebar-label">Saarthi AI Doubt Solver</span>
        </NavLink>
        <NavLink to="/dashboard/ai-quiz" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Lightbulb size={20} /></span>
          <span className="sidebar-label">AI Quiz</span>
        </NavLink>
        <NavLink to="/dashboard/ai-planner" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Clock size={20} /></span>
          <span className="sidebar-label">AI Planner</span>
        </NavLink>

        {/* COMMUNITY SECTION */}
        <div className="sidebar-section-title">Community</div>
        <NavLink to="/dashboard/community" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><MessageSquare size={20} /></span>
          <span className="sidebar-label">Community Feed</span>
        </NavLink>
        <NavLink to="/dashboard/leaderboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Trophy size={20} /></span>
          <span className="sidebar-label">Leaderboard</span>
        </NavLink>
        <NavLink to="/dashboard/arena" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Star size={20} /></span>
          <span className="sidebar-label">Challenges</span>
        </NavLink>

        {/* EXTRAS SECTION */}
        <div className="sidebar-section-title">Extras</div>
        <button 
          onClick={() => { setIsReferModalOpen(true); if (onMobileClose) onMobileClose(); }} 
          className="sidebar-link w-full text-left bg-transparent border-none font-inherit cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="sidebar-icon"><Gift size={20} className="text-purple-400 group-hover:animate-bounce" /></span>
          <span className="sidebar-label font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Refer & Earn</span>
        </button>
        <NavLink to="/dashboard/library" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Book size={20} /></span>
          <span className="sidebar-label">Library & Books</span>
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><User size={20} /></span>
          <span className="sidebar-label">Profile Settings</span>
        </NavLink>
        <NavLink to="/dashboard/feedback" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Send size={20} /></span>
          <span className="sidebar-label">Feedback</span>
        </NavLink>
        <NavLink to="/dashboard/support" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><LifeBuoy size={20} /></span>
          <span className="sidebar-label">Help & Support</span>
        </NavLink>
        <NavLink to="/dashboard/apps" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onMobileClose}>
          <span className="sidebar-icon"><Smartphone size={20} /></span>
          <span className="sidebar-label">Download EW App</span>
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
        <div className="sidebar-user-footer">
          <div 
            className="sidebar-user" 
            onClick={() => navigate('/dashboard/profile')} 
            style={{ cursor: 'pointer', flex: 1 }}
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
                  <div className="user-role" style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>Profile & Settings</div>
                </div>
              </div>
              {!collapsed && <Settings size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />}
            </div>
          </div>
          {/* Logout Button */}
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={17} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Referral Modal Overlay */}
      <ReferralModal isOpen={isReferModalOpen} onClose={() => setIsReferModalOpen(false)} />
    </>
  );
};

export default React.memo(Sidebar);
