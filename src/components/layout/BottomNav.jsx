import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, Clapperboard, Heart, MoreHorizontal } from 'lucide-react';
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
          <NavLink to="/dashboard/favorites" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="bnav-icon"><Heart size={20} /></span>
            Saved
          </NavLink>
        </li>
        <li className="bottom-nav-item">
          <NavLink to="/dashboard/more" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="bnav-icon"><MoreHorizontal size={20} /></span>
            More
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;
