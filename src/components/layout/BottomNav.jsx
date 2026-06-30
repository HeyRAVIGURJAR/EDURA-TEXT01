import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, Clapperboard, Bot, MessageSquare } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <ul className="bottom-nav-list">
        <li className="bottom-nav-item">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="bnav-icon"><LayoutDashboard size={20} /></span>
            Home
          </NavLink>
        </li>
        <li className="bottom-nav-item">
          <NavLink to="/dashboard/batches" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="bnav-icon"><Library size={20} /></span>
            Batches
          </NavLink>
        </li>
        <li className="bottom-nav-item">
          <NavLink to="/dashboard/ott" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="bnav-icon"><Clapperboard size={20} /></span>
            OTT
          </NavLink>
        </li>
        <li className="bottom-nav-item">
          <NavLink to="/dashboard/ai-buddy" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="bnav-icon"><Bot size={20} /></span>
            AI
          </NavLink>
        </li>
        <li className="bottom-nav-item">
          <NavLink to="/dashboard/community" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="bnav-icon"><MessageSquare size={20} /></span>
            Social
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;
