import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, 
  Settings, ArrowLeft, Search, Clock, List, FileText, 
  Sparkles, CheckCircle2, ChevronRight, Minimize2, Info, Check, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import './OttPage.css';

const LECTURES = [
  {
    id: 'ott-1',
    title: 'Electrostatics 01: Electric Charge & Coulomb\'s Law',
    instructor: 'Alakh Pandey Sir',
    subject: 'Physics',
    duration: '02:30:15',
    match: '99% Match',
    year: '2027',
    rating: 'Aspirant Preferred',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop',
    chapters: [
      { name: 'Introduction', time: 0 },
      { name: 'Concept of Charge', time: 15 },
      { name: 'Coulomb\'s Law Theory', time: 45 },
      { name: 'Numerical 01 & 02', time: 80 }
    ]
  },
  {
    id: 'ott-2',
    title: 'Organic Chemistry: IUPAC Nomenclature One-Shot',
    instructor: 'Chemistry Squad Expert',
    subject: 'Chemistry',
    duration: '01:45:00',
    match: '96% Match',
    year: '2027',
    rating: 'Top Rated',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600&auto=format&fit=crop',
    chapters: [
      { name: 'Alkane IUPAC Rules', time: 0 },
      { name: 'Functional Group Priority', time: 30 },
      { name: 'Aromatic Naming Rules', time: 65 }
    ]
  },
  {
    id: 'ott-3',
    title: 'Definite Integration: High-yield Score Boosters',
    instructor: 'Mathematics HOD',
    subject: 'Mathematics',
    duration: '03:15:30',
    match: '98% Match',
    year: '2027',
    rating: 'Must Watch',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop',
    chapters: [
      { name: 'King\'s Property Refresher', time: 0 },
      { name: 'Integration Limits Hack', time: 20 },
      { name: 'IIT JEE Past Questions', time: 50 }
    ]
  },
  {
    id: 'ott-4',
    title: 'JEE/NEET Main Hack: How to Avoid Negative Marks',
    instructor: 'Founder Alakh Sir',
    subject: 'Strategy',
    duration: '45:12',
    match: '95% Match',
    year: '2026',
    rating: 'Highly Recommended',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
    chapters: [
      { name: 'Understanding Probability', time: 0 },
      { name: 'Option Elimination Strategy', time: 10 },
      { name: 'Final Week Hack', time: 25 }
    ]
  }
];

const OttPage = () => {
  const navigate = useNavigate();
  const addNotification = useNotificationStore(s => s.addNotification);

  const [activeSubject, setActiveSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLecture, setSelectedLecture] = useState(null);

  // Spotlight Header Trailer Play State
  const [heroMuted, setHeroMuted] = useState(true);
  const heroVideoRef = useRef(null);

  // Video Player States
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [playerTab, setPlayerTab] = useState('chapters'); // chapters | dpps | ai-buddy
  const [isFullscreen, setIsFullscreen] = useState(false);

  // My List
  const [myList, setMyList] = useState({});

  // AI prompt state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiHistory, setAiHistory] = useState([
    { role: 'assistant', text: 'Hey! Ask me any doubt related to this timestamp of the lecture.' }
  ]);

  const toggleMyList = (id, e) => {
    e.stopPropagation();
    setMyList(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
        addNotification({ message: 'Removed from My List', type: 'info' });
      } else {
        next[id] = true;
        addNotification({ message: 'Added to My List', type: 'success' });
      }
      return next;
    });
  };

  const filteredLectures = LECTURES.filter(lec => {
    const matchSub = activeSubject === 'all' || lec.subject.toLowerCase() === activeSubject.toLowerCase();
    const matchQuery = lec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       lec.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSub && matchQuery;
  });

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Keyboard Shortcuts inside Player
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedLecture) return;
      // Skip if typing in AI Chat input
      if (document.activeElement.tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (videoRef.current) videoRef.current.currentTime += 10;
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (videoRef.current) videoRef.current.currentTime -= 10;
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLecture, isPlaying, isMuted, volume]);

  // Time progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Progress Bar Seek
  const handleProgressBarChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Volume slider
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    const status = !isMuted;
    setIsMuted(status);
    if (videoRef.current) {
      videoRef.current.muted = status;
      videoRef.current.volume = status ? 0 : volume;
    }
  };

  // Playback Speed
  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Chapter seek
  const handleChapterSeek = (timeSeconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeSeconds;
      setCurrentTime(timeSeconds);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
      addNotification({
        message: `Jumped to chapter at ${formatTime(timeSeconds)}`,
        type: 'info'
      });
    }
  };

  // Fullscreen
  const handleFullscreenToggle = () => {
    const playerEl = document.getElementById('custom-player-wrapper');
    if (!playerEl) return;
    if (!document.fullscreenElement) {
      playerEl.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    setAiHistory(prev => [...prev, { role: 'user', text: userText }]);
    setAiPrompt('');

    setTimeout(() => {
      let reply = `Based on the lecture context at ${formatTime(currentTime)}: `;
      if (userText.toLowerCase().includes('charge') || userText.toLowerCase().includes('coulomb')) {
        reply += "Coulomb's Law states that force F = k * (q1 * q2) / r^2. Sir is explaining how permittivity (epsilon) alters this force in media.";
      } else {
        reply += "Excellent conceptual question. In this chapter, the instructor emphasizes writing step-by-step derivational proofs to score maximum marks in Board exams and speed tricks for JEE.";
      }
      setAiHistory(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 1000);
  };

  return (
    <div className="ott-page-container">
      {/* Back Button */}
      <div className="ott-back-row">
        <button className="ott-back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      {/* Netflix Hero Billboard Spotlight Banner */}
      <div className="netflix-billboard">
        <div className="billboard-video-wrap">
          <video 
            ref={heroVideoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" 
            autoPlay 
            loop 
            muted={heroMuted}
            playsInline
          />
          <div className="billboard-vignette" />
          <div className="billboard-left-shade" />
        </div>
        
        <div className="billboard-info">
          <div className="netflix-original-badge">
            <span className="n-logo-letter">E</span>
            <span className="n-logo-text">ORIGINAL</span>
          </div>
          <h1 className="billboard-title">Ray Optics & Wave Physics</h1>
          <p className="billboard-synopsis">
            Prepare to master the nature of light with visual ray derivations, spherical reflection, and Snell's Law hacks compiled by India's top ranking coaching mentors.
          </p>
          <div className="billboard-actions">
            <button className="billboard-btn play-btn" onClick={() => setSelectedLecture(LECTURES[0])}>
              <Play size={18} fill="black" /> Play Masterclass
            </button>
            <button className="billboard-btn mute-btn" onClick={() => setHeroMuted(!heroMuted)}>
              {heroMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Header and Search Strip */}
      <div className="ott-header-row">
        <div>
          <h2 className="ott-category-title">Browse Video Lectures</h2>
        </div>
        <div className="ott-search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search titles, teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Options */}
      <div className="ott-filters">
        {['all', 'physics', 'chemistry', 'mathematics', 'strategy'].map((sub) => (
          <button 
            key={sub} 
            className={`ott-filter-btn ${activeSubject === sub ? 'active' : ''}`}
            onClick={() => setActiveSubject(sub)}
          >
            {sub.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Horizontal Carousel Rows (Netflix Style) */}
      <div className="netflix-categories-wrap">
        
        {/* ROW 1: Trending Now */}
        <div className="category-row">
          <h3 className="row-header">Trending Now</h3>
          <div className="row-slider-container">
            {filteredLectures.map((lec) => (
              <div 
                key={lec.id} 
                className="netflix-slide-card"
                onClick={() => setSelectedLecture(lec)}
              >
                <div className="slide-img-wrap">
                  <img src={lec.thumbnail} alt={lec.title} />
                  <div className="slide-hover-hud">
                    <div className="hover-hud-icons">
                      <button className="hud-icon-circle play">
                        <Play size={14} fill="black" />
                      </button>
                      <button className="hud-icon-circle plus" onClick={(e) => toggleMyList(lec.id, e)}>
                        {myList[lec.id] ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    </div>
                    <div className="hover-hud-meta">
                      <span className="match-pct">{lec.match}</span>
                      <span className="year-val">{lec.year}</span>
                      <span className="rating-pill">{lec.rating}</span>
                    </div>
                    <h4 className="hover-title">{lec.title}</h4>
                    <p className="hover-instructor">{lec.instructor}</p>
                  </div>
                  <span className="slide-duration-badge">{lec.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Subject Specialities */}
        <div className="category-row">
          <h3 className="row-header">JEE & NEET Core Masterclass Row</h3>
          <div className="row-slider-container">
            {filteredLectures.reverse().map((lec) => (
              <div 
                key={`row2-${lec.id}`} 
                className="netflix-slide-card"
                onClick={() => setSelectedLecture(lec)}
              >
                <div className="slide-img-wrap">
                  <img src={lec.thumbnail} alt={lec.title} />
                  <div className="slide-hover-hud">
                    <div className="hover-hud-icons">
                      <button className="hud-icon-circle play">
                        <Play size={14} fill="black" />
                      </button>
                      <button className="hud-icon-circle plus" onClick={(e) => toggleMyList(lec.id, e)}>
                        {myList[lec.id] ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    </div>
                    <div className="hover-hud-meta">
                      <span className="match-pct">{lec.match}</span>
                      <span className="year-val">{lec.year}</span>
                      <span className="rating-pill">{lec.rating}</span>
                    </div>
                    <h4 className="hover-title">{lec.title}</h4>
                    <p className="hover-instructor">{lec.instructor}</p>
                  </div>
                  <span className="slide-duration-badge">{lec.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Cinematic Custom Video Player Modal */}
      <AnimatePresence>
        {selectedLecture && (
          <motion.div 
            className="ott-player-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="ott-player-container" id="custom-player-wrapper">
              
              {/* Left Column: Player Core */}
              <div className="player-column-left">
                {/* Close modal */}
                <button className="player-close-btn" onClick={() => setSelectedLecture(null)}>
                  <Minimize2 size={18} />
                </button>

                {/* Video HTML5 Canvas */}
                <div className="video-canvas-wrapper" onClick={togglePlay}>
                  <video 
                    ref={videoRef}
                    src={selectedLecture.videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    playsInline
                  />
                  {!isPlaying && (
                    <div className="canvas-play-tint">
                      <Play size={48} fill="white" color="white" />
                    </div>
                  )}
                </div>

                {/* Premium Custom Player HUD Controls */}
                <div className="player-hud-controls">
                  
                  {/* Progress bar */}
                  <div className="hud-progress-row">
                    <input 
                      type="range" 
                      min="0" 
                      max={duration || 100} 
                      value={currentTime} 
                      onChange={handleProgressBarChange}
                      className="hud-slider"
                    />
                  </div>

                  {/* Icon Actions row */}
                  <div className="hud-actions-row">
                    <div className="hud-actions-left">
                      <button onClick={togglePlay} className="hud-btn">
                        {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
                      </button>
                      <button onClick={() => { if(videoRef.current) videoRef.current.currentTime -= 10 }} className="hud-btn">
                        <RotateCcw size={16} />
                      </button>

                      {/* Volume */}
                      <div className="hud-volume-group">
                        <button onClick={toggleMute} className="hud-btn">
                          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          value={isMuted ? 0 : volume} 
                          onChange={handleVolumeChange}
                          className="hud-volume-slider"
                        />
                      </div>

                      <span className="hud-time">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="hud-actions-right">
                      {/* Playback speed selector */}
                      <div className="hud-speed-group">
                        {['0.75x', '1x', '1.5x', '2x'].map((rateStr) => {
                          const r = parseFloat(rateStr);
                          return (
                            <button 
                              key={rateStr}
                              className={`speed-rate-btn ${playbackRate === r ? 'active' : ''}`}
                              onClick={() => handleSpeedChange(r)}
                            >
                              {rateStr}
                            </button>
                          );
                        })}
                      </div>

                      {/* Quality */}
                      <select 
                        value={quality} 
                        onChange={(e) => {
                          setQuality(e.target.value);
                          addNotification({ message: `Quality switched to ${e.target.value}`, type: 'success' });
                        }}
                        className="hud-quality-select"
                      >
                        <option value="1080p">1080p HD</option>
                        <option value="720p">720p HD</option>
                        <option value="480p">480p SD</option>
                      </select>

                      <button onClick={handleFullscreenToggle} className="hud-btn">
                        <Maximize size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="player-under-meta">
                  <h2 className="player-meta-title">{selectedLecture.title}</h2>
                  <p className="player-meta-desc">Delivered by {selectedLecture.instructor} | Subject: {selectedLecture.subject}</p>
                </div>
              </div>

              {/* Right Column: Interactive Sidebar (Chapters, DPPs, doubt AI) */}
              <div className="player-column-right glass-panel">
                <div className="player-tab-headers">
                  <button 
                    className={`pt-tab ${playerTab === 'chapters' ? 'active' : ''}`}
                    onClick={() => setPlayerTab('chapters')}
                  >
                    <List size={14} /> Chapters
                  </button>
                  <button 
                    className={`pt-tab ${playerTab === 'dpps' ? 'active' : ''}`}
                    onClick={() => setPlayerTab('dpps')}
                  >
                    <FileText size={14} /> Materials
                  </button>
                  <button 
                    className={`pt-tab ${playerTab === 'ai-buddy' ? 'active' : ''}`}
                    onClick={() => setPlayerTab('ai-buddy')}
                  >
                    <Sparkles size={14} /> Doubt AI
                  </button>
                </div>

                <div className="player-tab-body">
                  {/* Chapters List */}
                  {playerTab === 'chapters' && (
                    <div className="pt-chapters-list">
                      {selectedLecture.chapters.map((chap, idx) => (
                        <div 
                          key={idx} 
                          className={`chap-item ${currentTime >= chap.time ? 'passed' : ''}`}
                          onClick={() => handleChapterSeek(chap.time)}
                        >
                          <ChevronRight size={14} className="chap-arrow" />
                          <span className="chap-name">{chap.name}</span>
                          <span className="chap-time-lbl">{formatTime(chap.time)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Materials */}
                  {playerTab === 'dpps' && (
                    <div className="pt-dpps-list">
                      <div className="dpp-item">
                        <FileText size={20} className="text-purple-400" />
                        <div className="dpp-meta">
                          <span className="dpp-title">Class Written Notebook PDF</span>
                          <span className="dpp-size">4.8 MB · Uploaded by Teacher</span>
                        </div>
                        <button className="dpp-dl-btn" onClick={() => addNotification({ message: 'Downloaded Notebook PDF', type: 'success' })}>
                          Get
                        </button>
                      </div>
                      <div className="dpp-item">
                        <FileText size={20} className="text-cyan-400" />
                        <div className="dpp-meta">
                          <span className="dpp-title">Daily Practice Problems (DPP) - 01</span>
                          <span className="dpp-size">1.2 MB · 10 Objective Questions</span>
                        </div>
                        <button className="dpp-dl-btn" onClick={() => addNotification({ message: 'Downloaded DPP Checkpoint PDF', type: 'success' })}>
                          Get
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Doubt AI */}
                  {playerTab === 'ai-buddy' && (
                    <div className="pt-ai-buddy">
                      <div className="ai-chat-history">
                        {aiHistory.map((msg, idx) => (
                          <div key={idx} className={`ai-bubble ${msg.role}`}>
                            <p>{msg.text}</p>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleAskAI} className="ai-chat-input-row">
                        <input 
                          type="text" 
                          placeholder="Ask doubt about this timestamp..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        <button type="submit" className="ai-send-btn">
                          <Sparkles size={13} /> Ask
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OttPage;
