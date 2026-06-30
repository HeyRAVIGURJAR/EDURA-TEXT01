import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react';
import BadgeCard from '../components/features/BadgeCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EduraPreloader from '../components/ui/EduraPreloader';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { fetchBatchesPaginated, askStudyBuddy } from '../services/api';
import { useOptimisticLike } from '../hooks/useOptimisticLike';
import { useDebounce } from '../hooks/useDebounce';
import TelegramPopup from '../components/ui/TelegramPopup';
import './Dashboard.css';

const ITEMS_PER_PAGE = 6;

const FILTER_PILLS = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
];

const BadgeItem = React.memo(({ batch }) => {
  const { isLiked, toggleLike } = useOptimisticLike(batch._id);

  const badgeData = {
    id: batch._id,
    name: batch.name,
    description: batch.byName,
    image: batch.previewImage,
    rarity: batch.feeTotal > 4000 ? 'legendary' : (batch.feeTotal > 2000 ? 'epic' : 'rare'),
    progress: Math.floor(Math.random() * 100),
    date: new Date().toLocaleDateString()
  };

  return <BadgeCard badge={badgeData} isLiked={isLiked} onLike={toggleLike} />;
});

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

  // AI Prompt State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const abortRef = useRef(null);

  // Debounced search
  const debouncedQuery = useDebounce(searchQuery, 400);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const handleAiSearch = async (queryToUse = aiQuery) => {
    if (!queryToUse.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const response = await askStudyBuddy(queryToUse);
      setAiResponse(response);
    } catch (err) {
      console.error(err);
      setAiResponse('Sorry, failed to get response from StudyBuddy. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Reset when filter, search or favorites mode changes
  useEffect(() => {
    setBatches([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setInitialLoad(true);
  }, [activeFilter, debouncedQuery, showFavoritesOnly]);

  // Fetch batches
  const fetchData = useCallback(async (pageNum) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const result = await fetchBatchesPaginated(
        pageNum,
        ITEMS_PER_PAGE,
        debouncedQuery,
        abortRef.current.signal
      );

      let filtered = result.data;

      // Client-side filter for free/paid
      if (activeFilter === 'free') {
        filtered = filtered.filter((b) => !b.feeTotal || b.feeTotal === 0);
      } else if (activeFilter === 'paid') {
        filtered = filtered.filter((b) => b.feeTotal && b.feeTotal > 0);
      }
      
      // Filter for Favorites Page
      if (showFavoritesOnly) {
        const savedLikes = JSON.parse(localStorage.getItem('edura_likes')) || {};
        filtered = filtered.filter((b) => savedLikes[b._id]);
      }

      if (pageNum === 1) {
        setBatches(filtered);
      } else {
        setBatches((prev) => [...prev, ...filtered]);
      }

      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching batches:', error);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setInitialLoad(false);
    }
  }, [activeFilter, debouncedQuery]);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          setLoadingMore(true);
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, loadingMore]);

  if (initialLoad) {
    return <EduraPreloader message="Loading batches..." />;
  }

  return (
    <div className="dashboard-layout relative z-10 min-h-screen">
      {/* Animated Organic Particles Background */}
      <Particles
        id="dashboard-particles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "bubble" },
              resize: true,
            },
            modes: {
              bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8 },
            },
          },
          particles: {
            color: { value: ["#8b5cf6", "#06b6d4", "#ec4899"] },
            links: { enable: false },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: true,
              speed: 0.8,
              straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.5, random: true, animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false } },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 4 }, random: true, animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-[-1] pointer-events-none"
      />

      <TelegramPopup />

      {/* Search Bar */}
      <div className="dashboard-search">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Search batches..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="search-clear"
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Pills with sliding indicator */}
      <div className="dashboard-filter-pills">
        {FILTER_PILLS.map((pill) => (
          <button
            key={pill.id}
            className={`filter-pill ${activeFilter === pill.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(pill.id)}
          >
            {pill.label}
            {activeFilter === pill.id && (
              <motion.div
                className="pill-active-bg"
                layoutId="filterPill"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
        <span className="filter-count">{total} batches</span>
      </div>

      {/* Grid */}
      <section className="bento-grid dashboard-grid">
        <AnimatePresence>
          {loading && batches.length === 0 ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : batches.length > 0 ? (
            batches.map((batch, i) => (
              <motion.div
                key={batch._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.3 }}
              >
                <BadgeItem batch={batch} />
              </motion.div>
            ))
          ) : (
            <div className="bento-item glass-panel no-results">
              <h2>No batches found matching your criteria.</h2>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="scroll-sentinel">
          {loadingMore && (
            <div className="loading-more">
              <Loader2 size={24} className="spinner" />
              <span>Loading more batches...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && batches.length > 0 && (
        <div className="end-of-list">
          <span>You've seen all {total} batches</span>
        </div>
      )}

      {/* Persistent Bottom Player */}
      <div className="bottom-player glass-panel">
        <div className="player-controls">
          <button className="play-btn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
        <div className="player-info">
          <span className="player-status">CONTINUE WATCHING</span>
          <h4>Ray Optics 06 : TIR, Curved Refraction || Recorded</h4>
          <div className="player-progress">
            <span className="time">1:24:07 / 2:34:18</span>
            <span className="dot">•</span>
            <span className="percentage">55% complete</span>
          </div>
        </div>
        <button className="player-close">✕</button>
      </div>
    </div>
  );
};

export default Dashboard;
