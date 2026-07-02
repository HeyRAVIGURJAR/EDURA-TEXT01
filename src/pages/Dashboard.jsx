import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Loader2, X, Play, ChevronRight, Target, Zap,
  Flame, Clock, Brain, BookOpen, TrendingUp, CheckCircle,
  Circle, Calendar, Star, ArrowRight, SkipForward
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BadgeCard from '../components/features/BadgeCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EduraPreloader from '../components/ui/EduraPreloader';
import { fetchBatchesPaginated } from '../services/api';
import { useOptimisticLike } from '../hooks/useOptimisticLike';
import { useDebounce } from '../hooks/useDebounce';
import TelegramPopup from '../components/ui/TelegramPopup';
import { useAuthStore } from '../store/useAuthStore';
import './Dashboard.css';

const ITEMS_PER_PAGE = 9;
const FILTER_PILLS = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
];

/* ── Badge Item wrapper ── */
const BadgeItem = React.memo(({ batch }) => {
  const { isLiked, toggleLike } = useOptimisticLike(batch._id);
  const badgeData = {
    id: batch._id, 
    name: batch.name, 
    description: batch.byName,
    image: batch.previewImage || batch.photo || "/images/hero-1.png", 
    feeTotal: 0, 
    amount: 0,
    byName: batch.byName, 
    subjects: batch.subjects, 
    subjectCount: batch.subjectCount,
  };
  return <BadgeCard badge={badgeData} isLiked={isLiked} onLike={toggleLike} />;
});

/* ── Continue Learning Widget ── */
const ContinueLearningCard = () => {
  const [lecture, setLecture] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const s = localStorage.getItem('edura_last_lecture');
      if (s) setLecture(JSON.parse(s));
    } catch (_) {}
  }, []);
  if (!lecture) return null;
  return (
    <motion.div
      className="db-widget continue-widget"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      onClick={() => lecture.batchId && navigate(`/dashboard/batch/${lecture.batchId}`)}
    >
      <div className="continue-left">
        <div className="continue-play-wrap">
          <Play size={18} fill="white" color="white" />
        </div>
        <div className="continue-info">
          <span className="continue-eyebrow">Continue Watching</span>
          <h4 className="continue-title">{lecture.title}</h4>
          <div className="continue-meta">
            {lecture.batchName && <span>{lecture.batchName}</span>}
            <span className="dot">·</span>
            <Clock size={11} /> <span>Resume</span>
          </div>
          <div className="continue-bar-track">
            <div className="continue-bar-fill" style={{ width: '55%' }} />
          </div>
        </div>
      </div>
      <button className="continue-resume-btn">
        Resume <ChevronRight size={14} />
      </button>
    </motion.div>
  );
};

/* ── Today's Goal Widget ── */
const TodayGoalCard = () => {
  const goals = [
    { id: 'lec', label: '2 Lectures', done: false },
    { id: 'q', label: '100 Questions', done: false },
    { id: 'rev', label: '1 Revision', done: false },
  ];
  const completed = 42;
  const total = 100;
  const pct = Math.round((completed / total) * 100);
  return (
    <motion.div className="db-widget goal-widget" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <div className="widget-header">
        <Target size={16} className="widget-icon-target" />
        <span>Today's Goal</span>
      </div>
      <div className="goal-goals">
        {goals.map(g => (
          <div key={g.id} className={`goal-item ${g.done ? 'done' : ''}`}>
            {g.done ? <CheckCircle size={13} /> : <Circle size={13} />}
            <span>{g.label}</span>
          </div>
        ))}
      </div>
      <div className="goal-progress-section">
        <div className="goal-progress-label">
          <span className="goal-num">{completed}/{total}</span>
          <span className="goal-label-text">Questions Done</span>
        </div>
        <div className="goal-bar-track">
          <motion.div className="goal-bar-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }} />
        </div>
        <span className="goal-pct">{pct}%</span>
      </div>
    </motion.div>
  );
};

/* ── Streak Widget ── */
const StreakWidget = () => {
  const streak = parseInt(localStorage.getItem('edura_streak') || '7');
  const xp = parseInt(localStorage.getItem('edura_xp') || '4280');
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const active = [true, true, true, true, false, false, false]; // last 7 days
  return (
    <motion.div className="db-widget streak-widget" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
      <div className="streak-top">
        <div className="streak-flame">
          <Flame size={20} />
          <span className="streak-num">{streak}</span>
        </div>
        <div className="streak-label-col">
          <span className="streak-title">Day Streak</span>
          <span className="streak-sub">Keep it going!</span>
        </div>
        <div className="xp-badge">
          <Zap size={13} />
          <span>{xp.toLocaleString('en-IN')} XP</span>
        </div>
      </div>
      <div className="streak-days">
        {days.map((d, i) => (
          <div key={i} className="streak-day-col">
            <div className={`streak-dot ${active[i] ? 'active' : ''}`} />
            <span className="streak-day-label">{d}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ── Exam Countdown Widget ── */
const ExamCountdown = () => {
  const [days, setDays] = useState(198);
  useEffect(() => {
    const target = new Date('2027-01-20');
    const diff = Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24));
    setDays(Math.max(0, diff));
  }, []);
  const prep = Math.round(((365 - days) / 365) * 100);
  return (
    <motion.div className="db-widget countdown-widget" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="countdown-header">
        <Calendar size={14} />
        <span>JEE Mains 2027</span>
      </div>
      <div className="countdown-days">
        <span className="countdown-num">{days}</span>
        <span className="countdown-unit">days left</span>
      </div>
      <div className="countdown-bar-track">
        <motion.div className="countdown-bar-fill" initial={{ width: 0 }} animate={{ width: `${prep}%` }} transition={{ duration: 1.2, delay: 0.4 }} />
      </div>
      <span className="countdown-hint">{prep}% prep time elapsed</span>
    </motion.div>
  );
};

/* ── AI Tip Widget ── */
const AITipWidget = () => {
  const navigate = useNavigate();
  const tips = [
    "Focus on Electrostatics today — you've been skipping it for 3 days.",
    "Your accuracy in Organic Chemistry dropped 12% this week. Revise reactions.",
    "You're 2 lectures away from completing Chapter 3. Finish it today!",
    "Top performers solve 20 DPPs per day. You solved 4 yesterday.",
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return (
    <motion.div className="db-widget ai-tip-widget" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
      <div className="ai-tip-header">
        <div className="ai-tip-icon"><Brain size={15} /></div>
        <span>StudyBuddy AI</span>
      </div>
      <p className="ai-tip-text">"{tip}"</p>
      <button className="ai-tip-btn" onClick={() => navigate('/dashboard/ai-buddy')}>
        Ask AI <ArrowRight size={13} />
      </button>
    </motion.div>
  );
};

/* ── Bottom Continue Player ── */
const BottomPlayer = () => {
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem('edura_last_lecture');
      if (s) { const d = JSON.parse(s); if (d?.title) { setLecture(d); setVisible(true); } }
    } catch (_) {}
  }, []);
  const handleDismiss = (e) => { e.stopPropagation(); setVisible(false); localStorage.removeItem('edura_last_lecture'); };
  return (
    <AnimatePresence>
      {visible && lecture && (
        <motion.div className="bottom-player glass-panel" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} onClick={() => lecture.batchId && navigate(`/dashboard/batch/${lecture.batchId}`)}>
          <button className="play-btn" onClick={(e) => { e.stopPropagation(); lecture.batchId && navigate(`/dashboard/batch/${lecture.batchId}`); }}>
            <Play size={20} fill="currentColor" />
          </button>
          <div className="player-info">
            <span className="player-status">CONTINUE WATCHING</span>
            <h4>{lecture.title}</h4>
            <div className="player-progress">
              {lecture.batchName && <span>{lecture.batchName}</span>}
              <span className="dot">·</span><span>Resume</span><ChevronRight size={12} />
            </div>
          </div>
          <button className="player-close" onClick={handleDismiss} aria-label="Close player"><X size={18} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── Main Dashboard ── */
const Dashboard = ({ showFavoritesOnly = false }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [total, setTotal] = useState(0);
  const user = useAuthStore((s) => s.user);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const abortRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    setBatches([]); setPage(1); setHasMore(true); setLoading(true); setInitialLoad(true);
  }, [activeFilter, debouncedQuery, showFavoritesOnly]);

  const fetchData = useCallback(async (pageNum) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    try {
      const result = await fetchBatchesPaginated(pageNum, ITEMS_PER_PAGE, debouncedQuery, abortRef.current.signal);
      let filtered = result.data;
      if (activeFilter === 'free') filtered = filtered.filter(b => !b.feeTotal || b.feeTotal === 0);
      else if (activeFilter === 'paid') filtered = filtered.filter(b => b.feeTotal && b.feeTotal > 0);
      if (showFavoritesOnly) {
        const likes = JSON.parse(localStorage.getItem('edura_likes')) || {};
        filtered = filtered.filter(b => likes[b._id]);
      }
      if (pageNum === 1) setBatches(filtered);
      else setBatches(prev => [...prev, ...filtered]);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      setLoading(false); setLoadingMore(false); setInitialLoad(false);
    }
  }, [activeFilter, debouncedQuery, showFavoritesOnly]);

  useEffect(() => { fetchData(page); }, [page, fetchData]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
        setLoadingMore(true); setPage(prev => prev + 1);
      }
    }, { threshold: 0.1, rootMargin: '300px' });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, loadingMore]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (initialLoad) return <EduraPreloader message="Loading your dashboard..." />;

  return (
    <div className="dashboard-layout">
      <TelegramPopup />

      {/* Greeting */}
      <div className="db-greeting">
        <h1 className="db-greeting-text">
          {greeting()}, <span className="db-greeting-name">{user?.username || 'Student'}</span> 👋
        </h1>
        <p className="db-greeting-sub">Your learning journey continues here.</p>
      </div>

      {/* Widgets Row */}
      <div className="db-widgets-row">
        <ContinueLearningCard />
        <TodayGoalCard />
        <StreakWidget />
        <ExamCountdown />
        <AITipWidget />
      </div>

      {/* Section Header for Batches */}
      <div className="db-section-header">
        <h2 className="db-section-title">
          {showFavoritesOnly ? '❤️ My Saved Batches' : '🎓 All Batches'}
        </h2>
        <span className="db-section-count">{total} available</span>
      </div>

      {/* Search Bar */}
      <div className="dashboard-search">
        <Search size={18} />
        <input type="text" placeholder="Search batches, subjects, educators..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={16} /></button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="dashboard-filter-pills">
        {FILTER_PILLS.map(pill => (
          <button key={pill.id} className={`filter-pill ${activeFilter === pill.id ? 'active' : ''}`} onClick={() => setActiveFilter(pill.id)}>
            {pill.label}
            {activeFilter === pill.id && <motion.div className="pill-active-bg" layoutId="filterPill" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />}
          </button>
        ))}
        <span className="filter-count">{total} batches</span>
      </div>

      {/* Batch Grid */}
      <section className="bento-grid dashboard-grid">
        <AnimatePresence>
          {loading && batches.length === 0
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)
            : batches.length > 0
              ? batches.map((batch, i) => (
                <motion.div key={batch._id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.25), duration: 0.28 }}>
                  <BadgeItem batch={batch} />
                </motion.div>
              ))
              : (
                <div className="bento-item glass-panel no-results">
                  <BookOpen size={36} style={{ color: '#475569', marginBottom: 12 }} />
                  <h2>No batches found</h2>
                  <p>Try a different search or filter</p>
                </div>
              )
          }
        </AnimatePresence>
      </section>

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="scroll-sentinel">
          {loadingMore && (
            <div className="loading-more">
              <Loader2 size={22} className="spinner" />
              <span>Loading more batches...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && batches.length > 0 && (
        <div className="end-of-list"><span>You've seen all {total} batches 🎉</span></div>
      )}

      <BottomPlayer />
    </div>
  );
};

export default Dashboard;
