import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
  return (
    <motion.nav 
      className="sticky top-0 w-full z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10 flex items-center px-6 h-16 transition-colors duration-500"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/dashboard/profile" className="header-logo-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <div className="pw-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pw-logo-circle" style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '950',
            fontFamily: 'Outfit, sans-serif',
            border: '2px solid #5B56E6',
            boxShadow: '0 0 10px rgba(91, 86, 230, 0.4)',
            fontSize: '14px',
            letterSpacing: '-0.5px'
          }}>
            EW
          </div>
          <span className="pw-logo-text" style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: '800',
            fontSize: '18px',
            letterSpacing: '0.5px',
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            EDURA<span style={{ color: '#5B56E6', marginLeft: '2px' }}>WALLAH</span>
          </span>
        </div>
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
      
      <div className="header-actions">
        {/* Placeholder for future actions like profile dropdown or notifications */}
      </div>
    </motion.nav>
  );
};

export default Header;
