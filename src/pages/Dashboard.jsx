import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Loader2, X, Play, ChevronRight, Target, Zap,
  Flame, Clock, Brain, BookOpen, TrendingUp, CheckCircle,
  Circle, Calendar, Star, ArrowRight, SkipForward, ArrowLeft, ArrowUp
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import BadgeCard from '../components/features/BadgeCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';

import { fetchBatchesPaginated } from '../services/api';
import { useOptimisticLike } from '../hooks/useOptimisticLike';
import { useDebounce } from '../hooks/useDebounce';
import TelegramPopup from '../components/ui/TelegramPopup';
import { useAuthStore } from '../store/useAuthStore';
import EduraLogo from '../components/ui/EduraLogo';
import './Dashboard.css';

const ITEMS_PER_PAGE = 9;
const FILTER_PILLS = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
  { id: 'favorites', label: 'Favorites ❤️' },
];

/* ── Badge Item wrapper ── */
const BadgeItem = React.memo(({ batch, onToggle }) => {
  const { isLiked, toggleLike } = useOptimisticLike(batch._id);
  const handleLikeToggle = async (id) => {
    await toggleLike();
    if (onToggle) onToggle(id);
  };
  const badgeData = {
    id: batch._id, 
    name: batch.name, 
    description: batch.byName,
    image: batch.previewImage || batch.photo || `${import.meta.env.BASE_URL || '/'}images/hero-2.png`, 
    feeTotal: 0, 
    amount: 0,
    byName: batch.byName, 
    subjects: batch.subjects, 
    subjectCount: batch.subjectCount,
  };
  return <BadgeCard badge={badgeData} isLiked={isLiked} onLike={handleLikeToggle} />;
});



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





/* ── Main Dashboard ── */
const Dashboard = ({ showFavoritesOnly = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBatchesPage = location.pathname.endsWith('/batches');

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

  // Sticky UI Helpers
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [pullRefreshing, setPullRefreshing] = useState(false);

  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const abortRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 400);

  // Monitor Scroll for Scroll-to-Top Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setBatches([]); setPage(1); setHasMore(true); setLoading(true); setInitialLoad(true);
  }, [activeFilter, debouncedQuery, showFavoritesOnly]);

  const fetchData = useCallback(async (pageNum) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    try {
      const result = await fetchBatchesPaginated(pageNum, ITEMS_PER_PAGE, debouncedQuery, abortRef.current.signal);
      let filtered = result.data;
      if (activeFilter === 'free') {
        filtered = filtered.filter(b => !b.feeTotal || b.feeTotal === 0);
      } else if (activeFilter === 'paid') {
        filtered = filtered.filter(b => b.feeTotal && b.feeTotal > 0);
      } else if (activeFilter === 'favorites') {
        const likes = JSON.parse(localStorage.getItem('edura_likes')) || {};
        filtered = filtered.filter(b => likes[b._id]);
      }
      if (showFavoritesOnly) {
        const likes = JSON.parse(localStorage.getItem('edura_likes')) || {};
        filtered = filtered.filter(b => likes[b._id]);
      }
      if (pageNum === 1) setBatches(filtered);
      else setBatches(prev => [...prev, ...filtered]);
      setHasMore(result.hasMore);
      setTotal(filtered.length);
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

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].pageY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPullingRef.current || window.scrollY > 0) return;
    const currentY = e.touches[0].pageY;
    const deltaY = currentY - startYRef.current;
    if (deltaY > 0) {
      setPullDistance(Math.min(deltaY * 0.45, 80));
    }
  };

  const handleTouchEnd = async () => {
    isPullingRef.current = false;
    if (pullDistance > 60 && !loading && !loadingMore && !pullRefreshing) {
      setPullRefreshing(true);
      setPullDistance(50);
      try {
        await fetchData(1);
      } catch (err) {
        console.error(err);
      }
      setPullRefreshing(false);
    }
    setPullDistance(0);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (initialLoad) return (
    <div className="dashboard-layout" style={{ padding: '2rem' }}>
      <div className="db-greeting">
        <div className="skel-bone" style={{ height: '28px', width: '280px', borderRadius: '8px', marginBottom: '8px' }} />
        <div className="skel-bone" style={{ height: '14px', width: '400px', borderRadius: '6px' }} />
      </div>
      <div className="db-widgets-row" style={{ marginTop: '1.5rem' }}>
        {[1, 2, 3].map(i => <div key={i} className="skel-bone" style={{ height: '140px', flex: 1, borderRadius: '18px' }} />)}
      </div>
      <div style={{ marginTop: '2rem' }}>
        <div className="skel-bone" style={{ height: '20px', width: '160px', borderRadius: '6px', marginBottom: '1.2rem' }} />
      </div>
      <section className="bento-grid dashboard-grid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)}
      </section>
    </div>
  );

  return (
    <div 
      className="dashboard-layout"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <TelegramPopup />

      {isBatchesPage && (
        <div className="batches-sticky-header">
          <button className="batches-back-btn" onClick={() => navigate('/dashboard')} aria-label="Back to Dashboard">
            <ArrowLeft size={18} />
          </button>
          <div className="batches-header-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <EduraLogo size={28} showText={true} />
            <span className="batches-breadcrumbs">Dashboard &gt; My Batches</span>
          </div>
        </div>
      )}

      {/* Pull to Refresh Indicator */}
      <div className="pull-refresh-indicator" style={{ height: pullDistance > 0 ? `${pullDistance}px` : '0px' }}>
        <Loader2 size={24} className="spinner" style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
      </div>

      {!isBatchesPage && (
        <>
          {/* Greeting */}
          <div className="db-greeting">
            <h1 className="db-greeting-text">
              {greeting()}, <span className="db-greeting-name">{user?.username || 'Student'}</span> 👋
            </h1>
            <p className="db-greeting-sub">Next-Gen Educational Console. Your learning journey continues here.</p>
          </div>

          {/* Widgets Row */}
          <div className="db-widgets-row">
            <TodayGoalCard />
            <StreakWidget />
            <ExamCountdown />
          </div>

          {/* Section Header for Batches */}
          <div className="db-section-header">
            <h2 className="db-section-title flowing-underline">
              {showFavoritesOnly ? '❤️ My Saved Batches' : '🎓 All Batches'}
            </h2>
            <span className="db-section-count">{total} available</span>
          </div>
        </>
      )}

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
                  <BadgeItem batch={batch} onToggle={(id) => {
                    if (activeFilter === 'favorites' || showFavoritesOnly) {
                      setBatches(prev => prev.filter(b => b._id !== id));
                    }
                  }} />
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

      {/* Floating Scroll-to-Top Button */}
      <button 
        className={`scroll-to-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

    </div>
  );
};

export default Dashboard;
