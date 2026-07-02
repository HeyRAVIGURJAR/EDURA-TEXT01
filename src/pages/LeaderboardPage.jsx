import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Search, Flame, ArrowLeft, Star, 
  CheckCircle, ArrowUpRight, TrendingUp, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import './LeaderboardPage.css';

const MOCK_LEADERS = [
  { id: 'l1', username: 'Rahul_AIR_1', xp: 9840, streak: 45, rank: 1, avatar: '🥇', class: 'JEE 2026' },
  { id: 'l2', username: 'Priya_NEET_Doc', xp: 8750, streak: 38, rank: 2, avatar: '🥈', class: 'NEET 2026' },
  { id: 'l3', username: 'Aarav_Math_Guru', xp: 7990, streak: 29, rank: 3, avatar: '🥉', class: 'JEE 2027' },
  { id: 'l4', username: 'Ananya_Chemistry', xp: 6890, streak: 18, rank: 4, avatar: '🧪', class: 'JEE 2026' },
  { id: 'l5', username: 'RaviGurjar_Fan', xp: 5400, streak: 12, rank: 5, avatar: '🔥', class: 'NEET 2027' },
  { id: 'l6', username: 'Aman_Scholars', xp: 4890, streak: 21, rank: 6, avatar: '⚡', class: 'Boards 12th' },
  { id: 'l7', username: 'Karan_Physicist', xp: 4210, streak: 7, rank: 7, avatar: '🌌', class: 'JEE 2027' }
];

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [timeframe, setTimeframe] = useState('weekly'); // weekly | monthly | alltime
  const [searchQuery, setSearchQuery] = useState('');

  const formatXP = (val) => val.toLocaleString('en-IN');

  const filteredLeaders = MOCK_LEADERS.filter(l => 
    l.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="lead-page-container">
      {/* Header Back Link */}
      <div className="lead-back-row">
        <button className="lead-back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div className="lead-header-row">
        <div>
          <h1 className="lead-title">
            <Trophy className="lead-title-icon" /> Aspirants Leaderboard
          </h1>
          <p className="lead-subtitle">Compete globally with India's top JEE/NEET scholars.</p>
        </div>
        
        {/* Toggle timeframe */}
        <div className="lead-timeframe-selector">
          {['weekly', 'monthly', 'alltime'].map((t) => (
            <button 
              key={t} 
              className={`time-btn ${timeframe === t ? 'active' : ''}`}
              onClick={() => setTimeframe(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="lead-split-layout">
        {/* Left: Leaderboard Ranks list */}
        <div className="lead-main-col">
          <div className="lead-card glass-panel search-panel">
            <Search size={18} className="lead-search-icon" />
            <input 
              type="text" 
              placeholder="Search scholar username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="lead-ranks-card glass-panel">
            {/* Table Header */}
            <div className="ranks-table-header">
              <span className="col-rank">Rank</span>
              <span className="col-name">Scholar</span>
              <span className="col-streak">Streak</span>
              <span className="col-xp">XP Scored</span>
            </div>

            <div className="ranks-list">
              {filteredLeaders.map((leader, index) => {
                const isTopThree = leader.rank <= 3;
                return (
                  <motion.div 
                    key={leader.id}
                    className={`rank-item-row ${leader.username === user?.username ? 'is-self' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className={`col-rank ${isTopThree ? 'top-three' : ''}`}>
                      {leader.rank === 1 && <Medal size={20} className="rank-gold" />}
                      {leader.rank === 2 && <Medal size={20} className="rank-silver" />}
                      {leader.rank === 3 && <Medal size={20} className="rank-bronze" />}
                      {leader.rank > 3 && `#${leader.rank}`}
                    </span>

                    <div className="col-name name-cell">
                      <span className="scholar-avatar">{leader.avatar}</span>
                      <div className="scholar-meta">
                        <span className="scholar-username">
                          {leader.username}
                          {leader.rank === 1 && <span className="verified-tag">AIR 1</span>}
                        </span>
                        <span className="scholar-class">{leader.class}</span>
                      </div>
                    </div>

                    <span className="col-streak font-medium flex items-center gap-1">
                      <Flame size={14} className="text-orange-500 fill-orange-500 animate-pulse" />
                      {leader.streak} Days
                    </span>

                    <span className="col-xp font-bold text-purple-400">
                      {formatXP(leader.xp)} XP
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: User Stats & Milestones */}
        <div className="lead-sidebar-col">
          {/* User's Current Standing Card */}
          <div className="lead-card glass-panel profile-standing-card">
            <h3 className="profile-standing-title">Your Current Position</h3>
            
            <div className="profile-standing-badge">
              <span className="standing-emoji">⚡</span>
              <div>
                <span className="standing-rank-lbl">Current Rank</span>
                <span className="standing-rank-value">#12,482</span>
              </div>
            </div>

            <div className="standing-stats-grid">
              <div className="st-stat">
                <span className="st-lbl">Streak</span>
                <span className="st-val text-orange-500 flex items-center gap-1 justify-center">
                  <Flame size={15} className="fill-orange-500" /> {localStorage.getItem('edura_streak') || 7} Days
                </span>
              </div>
              <div className="st-stat">
                <span className="st-lbl">Total XP</span>
                <span className="st-val text-purple-400 font-bold">
                  {formatXP(user?.xp || 4280)}
                </span>
              </div>
            </div>

            <div className="standing-next-rank">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Next Rank Rank-up</span>
                <span>610 XP Needed</span>
              </div>
              <div className="st-progress-track">
                <div className="st-progress-fill" style={{ width: '45%' }} />
              </div>
            </div>
          </div>

          {/* Gamified Weekly Milestones */}
          <div className="lead-card glass-panel milestones-card">
            <div className="card-header">
              <Sparkles size={16} className="text-yellow-500" />
              <h4>Weekly Arena Goals</h4>
            </div>

            <div className="milestones-list">
              <div className="milestone-item completed">
                <div className="milestone-check">✓</div>
                <div className="milestone-info">
                  <span className="m-title">Daily Quiz Streak</span>
                  <span className="m-desc">Complete daily mock checkpoints. (+50 XP)</span>
                </div>
              </div>
              <div className="milestone-item">
                <div className="milestone-check">○</div>
                <div className="milestone-info">
                  <span className="m-title">Beat Opponent in 1v1</span>
                  <span className="m-desc">Win a matchmaking battle in Challenge Arena. (+150 XP)</span>
                </div>
                <button className="m-action-btn" onClick={() => navigate('/dashboard/arena')}>
                  Fight <ArrowUpRight size={12} />
                </button>
              </div>
              <div className="milestone-item">
                <div className="milestone-check">○</div>
                <div className="milestone-info">
                  <span className="m-title">Chapter Mastery</span>
                  <span className="m-desc">Complete 3 full roadmap chapters. (+300 XP)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
