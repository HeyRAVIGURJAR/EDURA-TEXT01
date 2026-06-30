import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, ChevronDown, ChevronUp } from 'lucide-react';

/* ─────────────────────────────────────────────────────
   EDURA Music Player — Persistent Floating Widget
   Plays across all pages during study sessions.
   ───────────────────────────────────────────────────── */

const TRACKS = [
  {
    title: 'Saiyyaara',
    artist: 'Ek Tha Tiger',
    genre: 'Bollywood',
    emoji: '🌙',
    color: '#8B5CF6',
    url: 'https://pagalfree.com/musics/128-Saiyyaara - Ek Tha Tiger 128 Kbps.mp3',
  },
  {
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    genre: 'Romantic',
    emoji: '🎤',
    color: '#06B6D4',
    url: 'https://pagalfree.com/musics/128-Tum Hi Ho - Aashiqui 2 128 Kbps.mp3',
  },
  {
    title: 'Radhe Radhe',
    artist: 'Dream Girl',
    genre: 'Bollywood',
    emoji: '🦚',
    color: '#F59E0B',
    url: 'https://pagalfree.com/musics/128-Radhe Radhe - Dream Girl 128 Kbps.mp3',
  },
  {
    title: 'Gori Gori',
    artist: 'Main Hoon Na',
    genre: 'Bollywood',
    emoji: '💃',
    color: '#10B981',
    url: 'https://pagalfree.com/musics/128-Gori Gori - Main Hoon Na 128 Kbps.mp3',
  },
  {
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    genre: 'Bollywood',
    emoji: '💔',
    color: '#EC4899',
    url: 'https://pagalfree.com/musics/128-Channa Mereya - Ae Dil Hai Mushkil 128 Kbps.mp3',
  },
];

const GlobalAudioPlayer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const handleToggle = () => setIsVisible(v => !v);
    window.addEventListener('toggle-music', handleToggle);
    return () => window.removeEventListener('toggle-music', handleToggle);
  }, []);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const currentTrack = TRACKS[trackIndex];

  /* ── Sync audio state ── */
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.url;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [trackIndex]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  }, []);

  const handleNext = useCallback(() => setTrackIndex(i => (i + 1) % TRACKS.length), []);
  const handlePrev = useCallback(() => setTrackIndex(i => (i - 1 + TRACKS.length) % TRACKS.length), []);
  const handleTrackEnd = useCallback(() => handleNext(), [handleNext]);

  const seekTo = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = ratio * duration;
    }
  }, [duration]);

  const fmtTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isMinimized && isVisible) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 cursor-pointer"
        style={{
          background: isPlaying ? 'linear-gradient(135deg, #1DB954, #1ed760)' : '#18181b',
          border: isPlaying ? 'none' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: isPlaying ? '0 8px 30px rgba(29, 185, 84, 0.5)' : '0 4px 15px rgba(0,0,0,0.5)',
          color: isPlaying ? '#fff' : '#1DB954'
        }}
      >
        <Music size={24} strokeWidth={2.5} />
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: '2px solid #1DB954',
              pointerEvents: 'none'
            }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop={false}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        onLoadedMetadata={handleTimeUpdate}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{
              position: 'fixed',
              bottom: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 900,
          width: isExpanded ? 420 : 320,
          background: 'linear-gradient(145deg, rgba(18,18,27,0.8), rgba(9,9,18,0.95))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: `1px solid rgba(255,255,255,0.1)`,
          borderTop: `1px solid ${currentTrack.color}55`,
          borderRadius: 24,
          boxShadow: `0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px ${currentTrack.color}15`,
          overflow: 'hidden',
          transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Animated Background Glow */}
        <motion.div
          animate={isPlaying ? { opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] } : { opacity: 0 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-50%', left: '-50%', width: '200%', height: '200%',
            background: `radial-gradient(circle at 50% 50%, ${currentTrack.color}44 0%, transparent 60%)`,
            pointerEvents: 'none', zIndex: 0
          }}
        />

        <div style={{ padding: '16px 20px', position: 'relative', zIndex: 1 }}>
          {/* Main Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Vinyl Record Album Art */}
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
                transition={isPlaying ? { repeat: Infinity, duration: 4, ease: 'linear' } : {}}
                style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, #111, #333)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 15px rgba(0,0,0,0.5), inset 0 0 0 3px #1a1a1a, inset 0 0 0 12px ${currentTrack.color}`,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ 
                  width: 12, height: 12, borderRadius: '50%', background: '#090912',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)'
                }} />
              </motion.div>
              {/* Floating Emoji */}
              <div style={{ position: 'absolute', bottom: -4, right: -4, fontSize: 16, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                {currentTrack.emoji}
              </div>
            </div>

            {/* Track Info */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ 
                color: '#fff', fontWeight: 800, fontSize: 15, lineHeight: 1.3, 
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {currentTrack.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ color: currentTrack.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {currentTrack.genre}
                </span>
                <span style={{ color: '#64748B', fontSize: 11 }}>• {currentTrack.artist}</span>
              </div>
            </div>

            {/* Premium Waveform */}
            {isPlaying && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, height: 24 }}>
                {[0.4, 0.8, 1, 0.6, 0.9].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [h, 1.2, h * 0.5, 1, h] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1, ease: 'easeInOut' }}
                    style={{
                      width: 4, height: 20, borderRadius: 2, transformOrigin: 'bottom',
                      background: `linear-gradient(to top, ${currentTrack.color}, #fff)`,
                      boxShadow: `0 0 8px ${currentTrack.color}88`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Expand / Minimize */}
            <button
              onClick={() => setIsMinimized(true)}
              style={{ color: '#94A3B8', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: 28, height: 28, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Seek Bar Area */}
          <div style={{ marginTop: 16 }}>
            <div
              onClick={seekTo}
              style={{
                height: 6, background: 'rgba(255,255,255,0.08)',
                borderRadius: 3, cursor: 'pointer', position: 'relative', overflow: 'visible'
              }}
            >
              <div style={{
                height: '100%', borderRadius: 3, position: 'relative',
                width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                background: `linear-gradient(90deg, ${currentTrack.color}, #fff)`,
                boxShadow: `0 0 10px ${currentTrack.color}`,
                transition: 'width 0.1s linear',
              }}>
                <div style={{
                  position: 'absolute', right: -6, top: -3, width: 12, height: 12,
                  borderRadius: '50%', background: '#fff', boxShadow: `0 0 10px ${currentTrack.color}`,
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{fmtTime(currentTime)}</span>
              <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{fmtTime(duration)}</span>
            </div>
          </div>

          {/* Controls & Tools Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            
            {/* Track Selector Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {TRACKS.map((track, i) => (
                <button
                  key={i}
                  onClick={() => { setTrackIndex(i); setIsPlaying(true); }}
                  title={track.title}
                  style={{
                    width: trackIndex === i ? 24 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
                    background: trackIndex === i ? track.color : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: trackIndex === i ? `0 0 12px ${track.color}` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Playback Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={handlePrev} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0.7}>
                <SkipBack size={20} fill="currentColor" />
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(p => !p)}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${currentTrack.color}, #fff)`,
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isPlaying ? `0 0 25px ${currentTrack.color}88, inset 0 2px 4px rgba(255,255,255,0.5)` : `0 10px 20px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5)`,
                  color: '#111'
                }}
              >
                {isPlaying
                  ? <Pause size={22} fill="currentColor" />
                  : <Play size={22} fill="currentColor" style={{ marginLeft: 3 }} />
                }
              </motion.button>

              <button onClick={handleNext} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0.7}>
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            {/* Volume Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setIsMuted(m => !m)} style={{ color: isMuted ? '#EF4444' : '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color=isMuted?'#EF4444':'#94A3B8'}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume}
                onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                style={{ width: 64, height: 4, borderRadius: 2, appearance: 'none', background: `linear-gradient(90deg, ${currentTrack.color} ${volume*100}%, rgba(255,255,255,0.1) ${volume*100}%)`, cursor: 'pointer', outline: 'none' }}
                className="volume-slider"
              />
            </div>
          </div>
        </div>
      </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(GlobalAudioPlayer);
