import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, ChevronDown, Star } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import EduraLogo from '../ui/EduraLogo';
import './Header.css';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user: userObj, logout } = useAuthStore();
  const profilePic = userObj?.profilePic;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <motion.nav 
      className="desktop-header sticky top-0 w-full z-50 flex items-center px-6 h-16 transition-all duration-500"
      style={{
        background: 'rgba(10, 10, 12, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        alignItems: 'center'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/dashboard/profile" className="header-logo-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <EduraLogo size={32} />
      </Link>

      <div className="header-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} end>
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/community" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Community
        </NavLink>
        <NavLink to="/dashboard/support" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Support Team
        </NavLink>
      </div>
      
      <div className="header-actions flex items-center gap-4 ml-auto" ref={dropdownRef} style={{ position: 'relative' }}>
        {/* Scholar XP Pill shifted to the right side */}
        <div className="header-xp-pill" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          padding: '5px 12px',
          borderRadius: '16px',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: '#FCD34D',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(245, 158, 11, 0.1)',
        }}
        onClick={() => navigate('/dashboard/profile')}
        title="Click to view progress & achievements"
        >
          <Star fill="#f59e0b" color="#f59e0b" size={14} className="animate-spin-slow" />
          <span>{userObj?.xp || 4280} XP</span>
        </div>

        <button 
          className="header-profile-trigger" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '20px',
            transition: 'background-color 0.2s',
          }}
        >
          {profilePic ? (
            <img src={profilePic} alt="Avatar" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
          ) : (
            <div className="header-profile-avatar" style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary, #8b5cf6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '13px',
            }}>
              {userObj?.username?.charAt(0).toUpperCase() || 'S'}
            </div>
          )}
          <ChevronDown size={13} style={{ color: 'var(--color-text-muted)', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {dropdownOpen && (
          <div className="header-profile-dropdown glass-panel" style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '220px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(15,15,20,0.95)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 1000,
            overflow: 'hidden',
            padding: '0.5rem 0',
          }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{userObj?.username || 'Student'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{userObj?.email || 'student@edura.in'}</div>
            </div>
            
            <button 
              onClick={() => { setDropdownOpen(false); navigate('/dashboard/profile'); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              className="dropdown-item-hover"
            >
              <User size={15} style={{ color: 'var(--color-accent)' }} />
              Profile Settings
            </button>

            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'left',
                borderTop: '1px solid rgba(255,255,255,0.04)'
              }}
              className="dropdown-item-hover-logout"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Header;
