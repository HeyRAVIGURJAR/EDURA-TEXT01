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
        <div className="header-logo">
          <img 
            src="/images/edura-logo-new.png" 
            alt="Edura Logo" 
            className="logo-image" 
            onError={(e) => { 
              e.target.src = '/images/logo-alt.jpg'; 
              e.target.onerror = () => { 
                e.target.style.display = 'none'; 
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline'; 
              } 
            }} 
          />
          <span className="logo-text" style={{display: 'none'}}>edu'ra</span>
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
