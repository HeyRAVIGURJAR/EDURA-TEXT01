import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Library, FileText, Clapperboard, MessageSquare, 
  Trophy, Bot, Lightbulb, LifeBuoy, ChevronLeft, ChevronRight,
  Star, BookOpen, Send, Book, Clock, Heart,
  Radio, Bookmark, HelpCircle, Gift, Smartphone, RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import ReferralModal from '../features/ReferralModal';
import EduraLogo from '../ui/EduraLogo';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userObj = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const handleManualRefresh = (e) => {
    e.preventDefault();
      document.body.classList.add('preloader-active');
      
      const direction = sessionStorage.getItem('eduraWaveDirection');
      const nextDirection = (!direction || direction === 'left-to-right') ? 'right-to-left' : 'left-to-right';
      sessionStorage.setItem('eduraWaveDirection', nextDirection);
      
      const waveLayer = document.createElement('div');
      waveLayer.className = 'hollywood-wave-layer wave-active-' + nextDirection;
      
      waveLayer.innerHTML = `
        <!-- Saturated Cinematic Multicolored Aurora Background Blobs sweeping with the wave -->
        <div class="wave-aurora-blob blob-cyan" style="position: absolute; width: 650px; height: 650px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 245, 255, 0.6) 0%, rgba(139, 92, 246, 0.4) 50%, transparent 75%); filter: blur(100px); pointer-events: none; z-index: 0; left: 150px; top: 10%; will-change: transform; transform: translate3d(0,0,0);"></div>
        <div class="wave-aurora-blob blob-purple" style="position: absolute; width: 750px; height: 750px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 0, 127, 0.5) 0%, rgba(139, 92, 246, 0.5) 50%, transparent 75%); filter: blur(120px); pointer-events: none; z-index: 0; left: 350px; top: 30%; will-change: transform; transform: translate3d(0,0,0);"></div>
        
        <!-- Glow Let's Continue Console Trigger -->
        <div class="wave-continue-text">LET'S CONTINUE...</div>
        
        <svg class="wave-fluid-container" viewBox="0 0 1000 800" preserveAspectRatio="none" style="width: 100%; height: 100%; position: absolute; overflow: visible;">
          <defs>
            <linearGradient id="manual-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00f5ff" stop-opacity="0"></stop>
              <stop offset="50%" stop-color="#00f5ff" stop-opacity="0.9"></stop>
              <stop offset="100%" stop-color="#00f5ff" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient id="manual-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff007f" stop-opacity="0"></stop>
              <stop offset="50%" stop-color="#ff007f" stop-opacity="0.9"></stop>
              <stop offset="100%" stop-color="#ff007f" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient id="manual-wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffea00" stop-opacity="0"></stop>
              <stop offset="50%" stop-color="#ffea00" stop-opacity="0.9"></stop>
              <stop offset="100%" stop-color="#ffea00" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient id="manual-wave-grad-4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#9b51e0" stop-opacity="0"></stop>
              <stop offset="50%" stop-color="#9b51e0" stop-opacity="0.9"></stop>
              <stop offset="100%" stop-color="#9b51e0" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient id="manual-wave-grad-5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffaa00" stop-opacity="0"></stop>
              <stop offset="50%" stop-color="#ffaa00" stop-opacity="0.9"></stop>
              <stop offset="100%" stop-color="#ffaa00" stop-opacity="0"></stop>
            </linearGradient>
            <filter id="manual-wave-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
            <filter id="manual-dot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <path id="p1" class="wave-path path-1" d="M -100,300 C 200,100 500,500 1100,300" fill="none" stroke="url(#manual-wave-grad-1)" stroke-width="4" stroke-linecap="round" filter="url(#manual-wave-glow)">
            <animate attributeName="d" values="M -100,300 C 200,100 500,500 1100,300; M -100,300 C 200,500 500,100 1100,300; M -100,300 C 200,100 500,500 1100,300" dur="3s" repeatCount="indefinite" />
          </path>
          <circle r="7" fill="#ffffff" filter="url(#manual-dot-glow)">
            <animateMotion dur="1.3s" repeatCount="indefinite"><mpath href="#p1"/></animateMotion>
          </circle>
          <path id="p2" class="wave-path path-2" d="M -100,450 C 300,600 600,200 1100,450" fill="none" stroke="url(#manual-wave-grad-2)" stroke-width="3" stroke-linecap="round" filter="url(#manual-wave-glow)">
            <animate attributeName="d" values="M -100,450 C 300,600 600,200 1100,450; M -100,450 C 300,200 600,600 1100,450; M -100,450 C 300,600 600,200 1100,450" dur="2.8s" repeatCount="indefinite" />
          </path>
          <circle r="6" fill="#ff007f" filter="url(#manual-dot-glow)">
            <animateMotion dur="1.2s" repeatCount="indefinite"><mpath href="#p2"/></animateMotion>
          </circle>
          <path id="p3" class="wave-path path-3" d="M -100,200 C 200,400 700,100 1100,200" fill="none" stroke="url(#manual-wave-grad-3)" stroke-width="2.5" stroke-linecap="round" filter="url(#manual-wave-glow)">
            <animate attributeName="d" values="M -100,200 C 200,400 700,100 1100,200; M -100,200 C 200,100 700,400 1100,200; M -100,200 C 200,400 700,100 1100,200" dur="3.2s" repeatCount="indefinite" />
          </path>
          <circle r="5.5" fill="#ffea00" filter="url(#manual-dot-glow)">
            <animateMotion dur="1.4s" repeatCount="indefinite"><mpath href="#p3"/></animateMotion>
          </circle>
          <path id="p4" class="wave-path path-4" d="M -100,550 C 400,300 600,700 1100,550" fill="none" stroke="url(#manual-wave-grad-4)" stroke-width="3" stroke-linecap="round" filter="url(#manual-wave-glow)">
            <animate attributeName="d" values="M -100,550 C 400,300 600,700 1100,550; M -100,550 C 400,700 600,300 1100,550; M -100,550 C 400,300 600,700 1100,550" dur="2.6s" repeatCount="indefinite" />
          </path>
          <circle r="6" fill="#a78bfa" filter="url(#manual-dot-glow)">
            <animateMotion dur="1.1s" repeatCount="indefinite"><mpath href="#p4"/></animateMotion>
          </circle>
          <path id="p5" class="wave-path path-5" d="M -100,350 C 300,200 700,500 1100,350" fill="none" stroke="url(#manual-wave-grad-5)" stroke-width="3.5" stroke-linecap="round" filter="url(#manual-wave-glow)">
            <animate attributeName="d" values="M -100,350 C 300,200 700,500 1100,350; M -100,350 C 300,500 700,200 1100,350; M -100,350 C 300,200 700,500 1100,350" dur="2.9s" repeatCount="indefinite" />
          </path>
          <circle r="6.5" fill="#ffa500" filter="url(#manual-dot-glow)">
            <animateMotion dur="1.3s" repeatCount="indefinite"><mpath href="#p5"/></animateMotion>
          </circle>
          <path id="p6" class="wave-path path-6" d="M -100,400 C 350,300 650,500 1100,400" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" filter="url(#manual-wave-glow)">
            <animate attributeName="d" values="M -100,400 C 350,300 650,500 1100,400; M -100,400 C 350,500 650,300 1100,400; M -100,400 C 350,300 650,500 1100,400" dur="2.4s" repeatCount="indefinite" />
          </path>
          <circle r="5" fill="#ffffff" filter="url(#manual-dot-glow)">
            <animateMotion dur="1.25s" repeatCount="indefinite"><mpath href="#p6"/></animateMotion>
          </circle>
        </svg>
      `;
      
      document.body.appendChild(waveLayer);
      
      setTimeout(() => {
        document.body.classList.remove('preloader-active');
      }, 1100);

      setTimeout(() => {
        waveLayer.remove();
      }, 1700);
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

  // Tooltip wrapper for collapsed sidebar
  const SidebarLink = ({ to, icon, label, onClick, className = '', end = false }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${className}`} 
      onClick={onClick || onMobileClose} 
      end={end}
      title={collapsed ? label : undefined}
    >
      <span className="sidebar-icon">{icon}</span>
      <span className="sidebar-label">{label}</span>
    </NavLink>
  );

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={onMobileClose} />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        
        {/* Logo Header */}
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
            <div className="sidebar-logo" style={{ width: collapsed ? 'auto' : '100%', justifyContent: collapsed ? 'center' : 'flex-start', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              <EduraLogo size={32} showText={false} />
            </div>
            <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              {collapsed ? <ChevronRight size={14} color="#8b5cf6" /> : <ChevronLeft size={14} color="#8b5cf6" />}
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

        {/* LEARN SECTION */}
        <div className="sidebar-section-title">Learn</div>
        <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" end />
        <SidebarLink to="/dashboard/batches" icon={<Library size={20} />} label="My Batches" />
        <SidebarLink to="/dashboard/favorites" icon={<Heart size={20} />} label="Favorites" />
        <NavLink to="/dashboard/ott" className={({ isActive }) => `sidebar-link ott-link ${isActive ? 'active' : ''}`} onClick={onMobileClose} title={collapsed ? 'EDURA OTT' : undefined}>
          <span className="sidebar-icon"><Clapperboard size={20} /></span>
          <span className="sidebar-label">EDURA OTT</span>
          <span className="ott-badge">NEW</span>
        </NavLink>

        {/* PRACTICE SECTION */}
        <div className="sidebar-section-title">Practice</div>
        <SidebarLink to="/dashboard/practice" icon={<HelpCircle size={20} />} label="Practice" />
        <SidebarLink to="/dashboard/tests" icon={<FileText size={20} />} label="Test Series" />

        {/* REVISION SECTION */}
        <div className="sidebar-section-title">Revision</div>
        <SidebarLink to="/dashboard/bookmarks" icon={<Bookmark size={20} />} label="Bookmarks" />



        {/* COMMUNITY SECTION */}
        <div className="sidebar-section-title">Community</div>
        <SidebarLink to="/dashboard/community" icon={<MessageSquare size={20} />} label="Community Feed" />
        <SidebarLink to="/dashboard/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" />
        <SidebarLink to="/dashboard/arena" icon={<Star size={20} />} label="Challenges" />

        {/* EXTRAS SECTION */}
        <div className="sidebar-section-title">Extras</div>
        <button 
          onClick={() => { setIsReferModalOpen(true); if (onMobileClose) onMobileClose(); }} 
          className="sidebar-link w-full text-left bg-transparent border-none font-inherit cursor-pointer relative overflow-hidden group"
          title={collapsed ? 'Refer & Earn' : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="sidebar-icon"><Gift size={20} className="text-purple-400 group-hover:animate-bounce" /></span>
          <span className="sidebar-label font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Refer & Earn</span>
        </button>
        <SidebarLink to="/dashboard/library" icon={<Book size={20} />} label="Library & Books" />
        <SidebarLink to="/dashboard/feedback" icon={<Send size={20} />} label="Feedback" />
        <SidebarLink to="/dashboard/support" icon={<LifeBuoy size={20} />} label="Help & Support" />
        
        {/* Manual Preloader Trigger */}
        <button 
          onClick={handleManualRefresh} 
          className="sidebar-link w-full text-left bg-transparent border-none cursor-pointer relative overflow-hidden group"
          style={{ 
            marginTop: '4px',
            marginBottom: '16px',
            fontSize: '0.95rem',
            padding: '0.75rem 1rem',
            fontWeight: 500
          }}
          title={collapsed ? 'Re-Sync Console' : undefined}
        >
          <span className="sidebar-icon"><RefreshCw size={20} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-500" /></span>
          <span className="sidebar-label text-cyan-400" style={{ fontWeight: 500 }}>Re-Sync Console</span>
        </button>

        {/* User Profile Footer */}
        <div className="sidebar-user-footer" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
          <div className="sidebar-user" style={{ flex: 1 }}>
            <div className="sidebar-user-card" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {profilePic ? (
                <img src={profilePic} alt="Avatar" className="sidebar-user-avatar-img" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div className="sidebar-user-avatar">{userObj?.username?.charAt(0).toUpperCase() || 'S'}</div>
              )}
              <div className="sidebar-user-info" style={{ display: collapsed ? 'none' : 'block' }}>
                <div className="user-name" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{userObj?.username || 'Student'}</div>
                <div className="user-role" style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>Learner Account</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Referral Modal Overlay */}
      <ReferralModal isOpen={isReferModalOpen} onClose={() => setIsReferModalOpen(false)} />
    </>
  );
};

export default React.memo(Sidebar);
