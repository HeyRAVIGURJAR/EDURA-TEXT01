import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, FileText, Download, ArrowLeft, Video,
  HelpCircle, Lock, Clock, Users, BookOpen,
  Zap, CheckCircle, ChevronRight, X, Star,
  Compass, Award, BrainCircuit, Target, Sparkles,
  Bookmark, Share2, Eye, Flame, Trash2, Edit2, Plus, Volume2
} from 'lucide-react';
import { fetchBatches, fetchDppQuiz, fetchDppSolutionVideo } from '../services/api';
import EduraPreloader from '../components/ui/EduraPreloader';
import { useNotificationStore } from '../store/useNotificationStore';
import PdfViewer from '../components/features/PdfViewer';
import './BatchDetail.css';

/* ── Static Mock Data (Cleaned and Extended) ── */
const MOCK_CHAPTERS = [
  { id: 'ch1', title: 'Chapter 1: Electrostatics', status: 'completed', lecturesCount: 8 },
  { id: 'ch2', title: 'Chapter 2: Current Electricity', status: 'completed', lecturesCount: 6 },
  { id: 'ch3', title: 'Chapter 3: Magnetic Effects of Current', status: 'current', lecturesCount: 10 },
  { id: 'ch4', title: 'Chapter 4: Electromagnetic Induction', status: 'locked', lecturesCount: 7 },
  { id: 'ch5', title: 'Chapter 5: Alternating Current', status: 'upcoming', lecturesCount: 5 },
];

const MOCK_LECTURES = [
  { id: 'vid1', num: '01', title: 'Ray Optics 01 : Introduction & Reflection', duration: '1h 45m', tutor: 'Alakh Sir', locked: false, url: 'https://www.w3schools.com/html/mov_bbb.mp4', views: '2.4L', difficulty: 'Easy', watchProgress: 100, completed: true, badge: '⭐ Important' },
  { id: 'vid2', num: '02', title: 'Ray Optics 02 : Spherical Mirrors & Mirror Formula', duration: '2h 10m', tutor: 'Alakh Sir', locked: false, url: 'https://www.w3schools.com/html/mov_bbb.mp4', views: '1.9L', difficulty: 'Medium', watchProgress: 72, completed: false, badge: '🔥 Most Asked' },
  { id: 'vid3', num: '03', title: 'Ray Optics 03 : Refraction & Snell\'s Law', duration: '1h 55m', tutor: 'Alakh Sir', locked: false, url: 'https://www.w3schools.com/html/mov_bbb.mp4', views: '1.6L', difficulty: 'Medium', watchProgress: 0, completed: false },
  { id: 'vid4', num: '04', title: 'Ray Optics 04 : Total Internal Reflection (TIR)', duration: '2h 15m', tutor: 'Alakh Sir', locked: true, url: null, views: '1.1L', difficulty: 'Hard', watchProgress: 0, completed: false },
  { id: 'vid5', num: '05', title: 'Ray Optics 05 : Refraction at Spherical Surfaces', duration: '1h 30m', tutor: 'Alakh Sir', locked: true, url: null, views: '98K', difficulty: 'Hard', watchProgress: 0, completed: false },
];

const MOCK_DPPS = [
  { id: 'dpp1', num: '01', title: 'DPP 01 — Ray Optics Fundamentals MCQ', questions: 15, difficulty: 'Easy', locked: false, solved: true },
  { id: 'dpp2', num: '02', title: 'DPP 02 — Mirror Formula & Spherical Mirrors', questions: 10, difficulty: 'Medium', locked: false, solved: false },
  { id: 'dpp3', num: '03', title: 'DPP 03 — Snell\'s Law and Apparent Depth', questions: 20, difficulty: 'Hard', locked: true, solved: false },
  { id: 'dpp4', num: '04', title: 'DPP 04 — TIR & Critical Angle Numericals', questions: 12, difficulty: 'Medium', locked: true, solved: false },
];

const MOCK_NOTES = [
  { id: 'note1', title: 'Class Notes — Ray Optics Lecture 01 (Handwritten)', size: '4.8 MB', pages: 12, locked: false, type: 'teacher' },
  { id: 'note2', title: 'Class Notes — Ray Optics Lecture 02 (Handwritten)', size: '5.2 MB', pages: 15, locked: false, type: 'teacher' },
  { id: 'note3', title: 'Short Notes — Mirror Formula Cheat Sheet', size: '1.5 MB', pages: 2, locked: false, type: 'revision' },
  { id: 'note4', title: 'Class Notes — Ray Optics Lecture 03 (Handwritten)', size: '3.7 MB', pages: 8, locked: true, type: 'teacher' },
];

const MOCK_QUIZ = [
  {
    id: 'q1',
    question: 'The critical angle for a medium is 30 degrees. The velocity of light in the medium is:',
    options: ['1.5 × 10^8 m/s', '3 × 10^8 m/s', '2 × 10^8 m/s', '1 × 10^8 m/s'],
    correct: 0,
    explanation: 'sin C = 1/n. sin 30° = 0.5 => n = 2. Velocity v = c/n = 3 × 10^8 / 2 = 1.5 × 10^8 m/s.'
  },
  {
    id: 'q2',
    question: 'For a total internal reflection, which of the following is correct?',
    options: ['Light travels from rarer to denser', 'Light travels from denser to rarer', 'Angle of incidence is less than critical angle', 'Angle of refraction is 0'],
    correct: 1,
    explanation: 'Total internal reflection occurs only when light travels from a denser medium to a rarer medium, and the angle of incidence is greater than the critical angle.'
  },
  {
    id: 'q3',
    question: 'Power of a convex lens of focal length 50 cm is:',
    options: ['+2 D', '-2 D', '+0.5 D', '-0.5 D'],
    correct: 0,
    explanation: 'Power P = 1/f (in meters). f = 50 cm = 0.5 m. P = 1/0.5 = +2 D.'
  },
];

const SUBJECT_CHIPS = [
  { id: 'physics', label: 'Physics' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'maths', label: 'Mathematics' },
];

const BATCH_TABS = [
  { id: 'lectures', label: 'Lectures', count: MOCK_LECTURES.length },
  { id: 'notes', label: 'Class Notes', count: MOCK_NOTES.length },
  { id: 'dpp', label: 'DPPs & Solutions', count: MOCK_DPPS.length },
  { id: 'quiz', label: 'Live Test Series', count: MOCK_QUIZ.length },
  { id: 'roadmap', label: 'Syllabus', count: MOCK_CHAPTERS.length },
  { id: 'revision', label: 'Revision Hub', count: 1 },
];

/* ── Difficulty Badge ── */
const DiffBadge = ({ level }) => {
  const colors = {
    Easy: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', border: 'rgba(16,185,129,0.25)' },
    Medium: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
    Hard: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' },
  };
  const s = colors[level] || colors.Medium;
  return (
    <span className="diff-badge" style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`
    }}>{level}</span>
  );
};

/* ── Focus Music player component ── */
const FocusMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState('none');
  const audioRef = useRef(null);

  const tracks = {
    rain: 'https://assets.mixkit.co/active_storage/sfx/2433/2433-84.wav',
    forest: 'https://assets.mixkit.co/active_storage/sfx/1244/1244-84.wav',
    noise: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', // brown noise simulate
  };

  const handleTrackChange = (trackKey) => {
    if (trackKey === 'none') {
      setIsPlaying(false);
      setActiveTrack('none');
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    setActiveTrack(trackKey);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = tracks[trackKey];
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
      }
    }, 50);
  };

  return (
    <div className="focus-music-box glass-panel">
      <div className="focus-header">
        <Volume2 size={16} className="focus-icon-pulse" />
        <span>Focus Music Dock</span>
      </div>
      <div className="focus-tracks">
        <button className={`focus-track-btn ${activeTrack === 'none' ? 'active' : ''}`} onClick={() => handleTrackChange('none')}>Off</button>
        <button className={`focus-track-btn ${activeTrack === 'rain' ? 'active' : ''}`} onClick={() => handleTrackChange('rain')}>🌧️ Rain</button>
        <button className={`focus-track-btn ${activeTrack === 'forest' ? 'active' : ''}`} onClick={() => handleTrackChange('forest')}>🌲 Forest</button>
        <button className={`focus-track-btn ${activeTrack === 'noise' ? 'active' : ''}`} onClick={() => handleTrackChange('noise')}>🎛️ Noise</button>
      </div>
      {activeTrack !== 'none' && (
        <audio ref={audioRef} style={{ display: 'none' }} />
      )}
    </div>
  );
};

/* ── Interactive Quiz panel ── */
const QuizPanel = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = MOCK_QUIZ[current];

  const handleSelect = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= MOCK_QUIZ.length) {
      setFinished(true);
      return;
    }
    setCurrent(c => c + 1);
    setSelected(null);
    setRevealed(false);
  };

  if (finished) {
    return (
      <div className="quiz-finished">
        <div className="quiz-score-ring">
          <span className="quiz-score-num">{score}/{MOCK_QUIZ.length}</span>
          <span className="quiz-score-label">Score</span>
        </div>
        <h3>{score === MOCK_QUIZ.length ? '🎉 Perfect Score!' : score > 1 ? '👍 Good Attempt!' : '📚 Keep Practicing!'}</h3>
        <p>You earned {score * 20} XP & {score * 5} Edura Coins!</p>
        <button className="quiz-restart-btn" onClick={() => { setCurrent(0); setSelected(null); setRevealed(false); setScore(0); setFinished(false); }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-progress-bar-track">
        <motion.div className="quiz-progress-bar-fill" animate={{ width: `${((current) / MOCK_QUIZ.length) * 100}%` }} />
      </div>
      <p className="quiz-counter">Question {current + 1} of {MOCK_QUIZ.length}</p>
      <div className="quiz-question-box">
        <h4 className="quiz-question">{q.question}</h4>
      </div>
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (revealed) {
            if (i === q.correct) cls += ' correct';
            else if (i === selected && i !== q.correct) cls += ' wrong';
          } else if (selected === i) {
            cls += ' selected';
          }
          return (
            <motion.button key={i} className={cls} onClick={() => handleSelect(i)} whileTap={{ scale: 0.98 }}>
              <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </motion.button>
          );
        })}
      </div>
      {revealed && (
        <motion.div className="quiz-explanation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <CheckCircle size={15} style={{ color: '#10B981', flexShrink: 0 }} />
          <span>{q.explanation}</span>
        </motion.div>
      )}
      {revealed && (
        <button className="quiz-next-btn" onClick={handleNext}>
          {current + 1 >= MOCK_QUIZ.length ? 'See Results' : 'Next Question'}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

/* ── Live DPP Quiz API Evaluator ── */
const LiveDppQuizPanel = () => {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [playingSolution, setPlayingSolution] = useState(null);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const addNotification = useNotificationStore ? useNotificationStore(s => s.addNotification) : () => {};

  const startQuiz = async () => {
    setLoading(true);
    const data = await fetchDppQuiz();
    if (data && data.questions) {
      setQuizData(data);
      setCurrent(0);
      setAnswers({});
      setSubmitted(false);
      setScore(null);
    }
    setLoading(false);
  };

  const handleSelectOption = (qIdx, optId) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optId }));
  };

  const submitQuiz = () => {
    if (!quizData) return;
    let computedScore = 0;
    quizData.questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected === q.correctOptionId) {
        computedScore += q.positiveMarks;
      } else if (selected !== undefined) {
        computedScore -= q.negativeMarks;
      }
    });
    setScore(computedScore);
    setSubmitted(true);
  };

  const handleWatchSolution = async (q) => {
    setSolutionLoading(true);
    const res = await fetchDppSolutionVideo();
    if (res && res.success) {
      const url = res.video_data?.url || res.original_video_url || "https://www.w3schools.com/html/mov_bbb.mp4";
      setPlayingSolution({
        title: `Question ${q.questionNumber} Video Solution`,
        url: url.endsWith('.mpd') ? "https://www.w3schools.com/html/mov_bbb.mp4" : url
      });
    } else {
      setPlayingSolution({
        title: `Question ${q.questionNumber} Video Solution`,
        url: "https://www.w3schools.com/html/mov_bbb.mp4"
      });
    }
    setSolutionLoading(false);
  };

  if (loading) return <div className="live-dpp-loading" style={{ color: '#cbd5e1', fontSize: '0.85rem', padding: '2rem 0', textAlign: 'center' }}>Connecting to BrainBox API...</div>;

  if (playingSolution) {
    return (
      <div className="live-dpp-player-card glass-panel" style={{ padding: '1.25rem', marginTop: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#fff', fontWeight: 800 }}>{playingSolution.title}</h4>
          <button 
            onClick={() => setPlayingSolution(null)}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem' }}
          >
            Close Video
          </button>
        </div>
        <div className="bd-video-wrap" style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
          <video controls autoPlay src={playingSolution.url} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
        </div>
      </div>
    );
  }

  if (quizData) {
    const q = quizData.questions[current];
    return (
      <div className="live-dpp-quiz-box glass-panel" style={{ padding: '1.4rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="quiz-progress-bar-track" style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <div className="quiz-progress-bar-fill" style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-primary), #0ea5e9)', width: `${((current + 1) / quizData.questions.length) * 100}%` }} />
        </div>
        
        <div className="live-quiz-hud-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
          <span>Question {current + 1} of {quizData.questions.length}</span>
          <span>Marks: +{q.positiveMarks} / -{q.negativeMarks}</span>
        </div>

        {q.questionImage && (
          <div className="live-quiz-img-container" style={{ margin: '1rem 0', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '0.8rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
            <img src={q.questionImage} alt="DPP Question" style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }} />
          </div>
        )}

        <div className="quiz-options" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
          {q.options.map((opt) => {
            const isSelected = answers[current] === opt.id;
            let cls = 'quiz-option';
            if (submitted) {
              if (opt.id === q.correctOptionId) cls += ' correct';
              else if (isSelected && opt.id !== q.correctOptionId) cls += ' wrong';
            } else if (isSelected) {
              cls += ' selected';
            }
            return (
              <button 
                key={opt.id} 
                className={cls}
                onClick={() => handleSelectOption(current, opt.id)}
                disabled={submitted}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: isSelected ? 'rgba(91,86,230,0.1)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                  color: isSelected ? '#fff' : '#cbd5e1',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <span className="quiz-option-letter" style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>{opt.text}</span>
                <span>Option {opt.text}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            {q.solutionImage && (
              <div style={{ marginBottom: '0.8rem', background: 'rgba(255,255,255,0.01)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginBottom: '0.3rem', textAlign: 'left' }}>Written Solution:</div>
                <img src={q.solutionImage} alt="Written Solution" style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }} />
              </div>
            )}
            <button 
              className="m-action-btn primary" 
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: 'var(--color-primary)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
                minHeight: '36px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => handleWatchSolution(q)}
              disabled={solutionLoading}
            >
              <Play size={12} fill="white" /> {solutionLoading ? 'Loading Video...' : 'Watch Video Solution'}
            </button>
          </div>
        )}

        <div className="quiz-navigation" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
          <button 
            className="quiz-restart-btn" 
            style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
            onClick={() => setCurrent(p => Math.max(0, p - 1))}
            disabled={current === 0}
          >
            Previous
          </button>
          
          {!submitted && current === quizData.questions.length - 1 ? (
            <button 
              className="quiz-restart-btn" 
              style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.75rem', background: '#10b981', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
              onClick={submitQuiz}
            >
              Submit Quiz
            </button>
          ) : current < quizData.questions.length - 1 ? (
            <button 
              className="quiz-restart-btn" 
              style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
              onClick={() => setCurrent(p => p + 1)}
            >
              Next
            </button>
          ) : null}
        </div>

        {submitted && score !== null && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1rem', background: 'rgba(16,185,129,0.06)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.15)' }}>
            <h4 style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 800 }}>Quiz Finished! Score: {score} / {quizData.totalMarks}</h4>
            <button 
              className="quiz-restart-btn" 
              style={{ marginTop: '0.8rem', padding: '0.45rem 1rem', fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
              onClick={startQuiz}
            >
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="test-banner-card glass-panel" style={{ background: 'linear-gradient(135deg, rgba(91, 86, 230, 0.08) 0%, rgba(6, 182, 212, 0.03) 100%)', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="banner-badge" style={{ background: 'var(--color-accent)', color: '#000', fontSize: '0.6rem', fontWeight: 800, width: 'max-content', padding: '2px 6px', borderRadius: '4px' }}>LIVE API EXAM</div>
      <h3 style={{ margin: '0.2rem 0 0.1rem 0', fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Official BrainBox DPP Live Quiz</h3>
      <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>Attempt the live objective quiz fetched directly from official PW endpoints with step solution videos.</p>
      <button className="start-test-btn" style={{
        marginTop: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'var(--gradient-primary)',
        border: 'none',
        color: '#fff',
        fontWeight: 800,
        fontSize: '0.78rem',
        padding: '0.6rem 1.2rem',
        borderRadius: '10px',
        cursor: 'pointer',
        width: 'max-content'
      }} onClick={startQuiz}>
        Start DPP Quiz Challenge <ChevronRight size={14} />
      </button>
    </div>
  );
};

/* ── Main BatchDetail Classroom Component ── */
const BatchDetail = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState('physics');
  const [activeTab, setActiveTab] = useState('lectures');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activePdf, setActivePdf] = useState(null);

  // Custom Video Player States
  const playerVideoRef = useRef(null);
  const [playerIsPlaying, setPlayerIsPlaying] = useState(false);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(0);
  const [playerVolume, setPlayerVolume] = useState(1);
  const [playerIsMuted, setPlayerIsMuted] = useState(false);
  const [playerPlaybackRate, setPlayerPlaybackRate] = useState(1);

  const togglePlayerPlay = () => {
    if (!playerVideoRef.current) return;
    if (playerIsPlaying) {
      playerVideoRef.current.pause();
      setPlayerIsPlaying(false);
    } else {
      playerVideoRef.current.play();
      setPlayerIsPlaying(true);
    }
  };

  const handlePlayerTimeUpdate = () => {
    if (!playerVideoRef.current) return;
    setPlayerCurrentTime(playerVideoRef.current.currentTime);
  };

  const handlePlayerLoadedMetadata = () => {
    if (!playerVideoRef.current) return;
    setPlayerDuration(playerVideoRef.current.duration);
  };

  const handlePlayerProgressBarChange = (e) => {
    const val = parseFloat(e.target.value);
    if (playerVideoRef.current) {
      playerVideoRef.current.currentTime = val;
      setPlayerCurrentTime(val);
    }
  };

  const handlePlayerVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setPlayerVolume(val);
    setPlayerIsMuted(val === 0);
    if (playerVideoRef.current) {
      playerVideoRef.current.volume = val;
      playerVideoRef.current.muted = val === 0;
    }
  };

  const togglePlayerMute = () => {
    const status = !playerIsMuted;
    setPlayerIsMuted(status);
    if (playerVideoRef.current) {
      playerVideoRef.current.muted = status;
      playerVideoRef.current.volume = status ? 0 : playerVolume;
    }
  };

  const handlePlayerSpeedChange = (rate) => {
    setPlayerPlaybackRate(rate);
    if (playerVideoRef.current) {
      playerVideoRef.current.playbackRate = rate;
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Keyboard Shortcuts inside Classroom Player
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedVideo) return;
      if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayerPlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (playerVideoRef.current) playerVideoRef.current.currentTime += 10;
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (playerVideoRef.current) playerVideoRef.current.currentTime -= 10;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo, playerIsPlaying]);

  useEffect(() => {
    if (selectedVideo) {
      setPlayerIsPlaying(true);
      setPlayerCurrentTime(0);
      setPlayerDuration(0);
      setPlayerPlaybackRate(1);
    } else {
      setPlayerIsPlaying(false);
    }
  }, [selectedVideo]);

  // Bottom Sheet for Lecture Options
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheetLecture, setBottomSheetLecture] = useState(null);

  // Handwritten Notes
  const [personalNotes, setPersonalNotes] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const batches = await fetchBatches();
      const matched = matchedBatch(batches, batchId);
      setBatch(matched || {
        _id: batchId,
        name: 'Lakshya JEE/NEET 2027 Ultimate',
        byName: 'Alakh Pandey Sir & team',
        previewImage: null,
        feeTotal: 2499,
      });
      
      const storedNotes = localStorage.getItem(`edura_notes_${batchId}`);
      if (storedNotes) setPersonalNotes(storedNotes);

      setLoading(false);
    };
    load();
  }, [batchId]);

  const matchedBatch = (list, id) => {
    return list.find(b => b._id === id || b.batch_id === id);
  };

  const handlePlayVideo = (lec) => {
    if (lec.locked) return;
    setSelectedVideo(lec);
    localStorage.setItem('edura_last_lecture', JSON.stringify({
      id: lec.id,
      title: lec.title,
      duration: lec.duration,
      tutor: lec.tutor,
      batchId,
      batchName: batch?.name || 'JEE Ultimate Batch',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowBottomSheet(false);
  };

  const openBottomSheet = (lec) => {
    if (lec.locked) return;
    setBottomSheetLecture(lec);
    setShowBottomSheet(true);
  };

  const savePersonalNotes = (val) => {
    setPersonalNotes(val);
    localStorage.setItem(`edura_notes_${batchId}`, val);
  };

  if (loading) return <EduraPreloader message="Opening your classroom..." />;

  const price = batch?.feeTotal ?? batch?.amount ?? 0;
  const isFree = !price || price === 0;

  return (
    <div className="bd-container">
      {/* Back Button */}
      <div className="bd-back-row">
        <button className="bd-back-btn" onClick={() => navigate('/dashboard/batches')}>
          <ArrowLeft size={15} />
          Back to Classroom
        </button>
      </div>

      {/* ── Cinematic Netflix Banner ── */}
      <div className="bd-hero glass-panel">
        <div className="bd-hero-img-wrap">
          <img src={batch?.previewImage || "/images/hero-1.png"} alt={batch?.name} className="bd-hero-img" />
          <div className="bd-hero-img-overlay" />
        </div>
        <div className="bd-hero-body">
          <div className="bd-hero-tags">
            <span className="bd-tag-hinglish">Hinglish</span>
            <span className="bd-tag-verified">✓ Verified Teachers</span>
            <span className={`bd-tag-price ${isFree ? 'free' : 'paid'}`}>
              {isFree ? '₹ FREE' : `₹ ${price.toLocaleString('en-IN')}`}
            </span>
          </div>
          <h1 className="bd-hero-title">{batch?.name}</h1>
          <p className="bd-hero-by">
            <Users size={14} />
            Led by {batch?.byName || "India's Best Educators"}
          </p>

          <div className="bd-hero-stats">
            <div className="bd-stat-col">
              <span className="bd-stat-val">4.9 ★</span>
              <span className="bd-stat-lbl">Rating</span>
            </div>
            <div className="bd-stat-col">
              <span className="bd-stat-val">2.4L</span>
              <span className="bd-stat-lbl">Enrolled</span>
            </div>
            <div className="bd-stat-col">
              <span className="bd-stat-val">68%</span>
              <span className="bd-stat-lbl">Completed</span>
            </div>
          </div>

          <div className="bd-hero-actions">
            <button className="bd-primary-btn" onClick={() => handlePlayVideo(MOCK_LECTURES[0])}>
              <Play size={16} fill="currentColor" />
              <span>Continue Learning</span>
            </button>
            <button className="bd-outline-btn">
              <Download size={15} />
              <span>Download Batch</span>
            </button>
          </div>
        </div>

        {/* Circular Progress Ring */}
        <div className="bd-progress-ring-box">
          <svg className="progress-ring-svg" width="90" height="90">
            <circle className="progress-ring-circle-bg" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="transparent" r="38" cx="45" cy="45" />
            <circle className="progress-ring-circle" stroke="var(--color-primary)" strokeWidth="6" fill="transparent" r="38" cx="45" cy="45" strokeDasharray="238.76" strokeDashoffset="76.4" />
          </svg>
          <div className="progress-ring-text">
            <span className="ring-pct">68%</span>
            <span className="ring-lbl">Done</span>
          </div>
        </div>
      </div>

      {/* ── AI Coach Prompt ── */}
      <div className="ai-coach-banner glass-panel">
        <div className="ai-coach-avatar">
          <BrainCircuit size={22} />
        </div>
        <div className="ai-coach-content">
          <h4>Good Evening, Ravi 👋</h4>
          <p>Today's study target: <strong>2 Lectures</strong>, <strong>50 DPP questions</strong>, and <strong>1 physics revision session</strong>. Estimated time: <strong>3h 20m</strong>.</p>
        </div>
        <button className="ai-coach-start-btn" onClick={() => handlePlayVideo(MOCK_LECTURES[1])}>
          Start Session <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Focus Music Player Widget ── */}
      <FocusMusicPlayer />

      {/* ── In-line Video Player ── */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div className="bd-player-box glass-panel" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <div className="bd-player-header">
              <div className="bd-player-title">
                <span className="bd-player-lec-num">Lec {selectedVideo.num}</span>
                <h4>{selectedVideo.title}</h4>
              </div>
              <div className="bd-player-controls-right">
                <button className="bd-player-ai-btn" onClick={() => navigate('/dashboard/ai-buddy')}>
                  <Sparkles size={13} />
                  <span>Ask AI</span>
                </button>
                <button className="bd-player-close-btn" onClick={() => setSelectedVideo(null)}><X size={16} /></button>
              </div>
            </div>
            <div className="bd-video-wrap-custom" style={{ position: 'relative', overflow: 'hidden', background: '#000', borderRadius: '12px' }} onClick={togglePlayerPlay}>
              <video 
                ref={playerVideoRef}
                src={selectedVideo.url} 
                autoPlay 
                onTimeUpdate={handlePlayerTimeUpdate}
                onLoadedMetadata={handlePlayerLoadedMetadata}
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
              
              {/* Custom Player HUD controls (translucent glass block) */}
              <div 
                className="custom-player-hud" 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(0deg, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.5) 60%, transparent 100%)',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  zIndex: 10
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress bar */}
                <input 
                  type="range" 
                  min="0" 
                  max={playerDuration || 100} 
                  value={playerCurrentTime} 
                  onChange={handlePlayerProgressBarChange}
                  className="hud-slider"
                  style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)', appearance: 'none', outline: 'none' }}
                />

                {/* Actions row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={togglePlayerPlay} className="hud-btn" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {playerIsPlaying ? <Pause size={15} fill="white" /> : <Play size={15} fill="white" />}
                    </button>
                    <button onClick={() => { if(playerVideoRef.current) playerVideoRef.current.currentTime -= 10 }} className="hud-btn" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                      <RotateCcw size={14} />
                    </button>

                    {/* Volume */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button onClick={togglePlayerMute} className="hud-btn" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        {playerIsMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={playerIsMuted ? 0 : playerVolume} 
                        onChange={handlePlayerVolumeChange}
                        style={{ width: '50px', accentColor: 'var(--color-primary)', cursor: 'pointer', height: '3px' }}
                      />
                    </div>
                    
                    <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700 }}>
                      {formatTime(playerCurrentTime)} / {formatTime(playerDuration)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Speed controllers */}
                    {['0.75x', '1x', '1.5x', '2x'].map((rateStr) => {
                      const r = parseFloat(rateStr);
                      return (
                        <button 
                          key={rateStr}
                          style={{
                            background: playerPlaybackRate === r ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                            border: 'none',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          onClick={() => handlePlayerSpeedChange(r)}
                        >
                          {rateStr}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Subject Chips (Apple Style) ── */}
      <div className="subject-chips-row">
        {SUBJECT_CHIPS.map(subj => (
          <button key={subj.id} className={`subject-chip-btn ${activeSubject === subj.id ? 'active' : ''}`} onClick={() => setActiveSubject(subj.id)}>
            {subj.label}
          </button>
        ))}
      </div>

      {/* ── Tab Navigation Strip ── */}
      <div className="bd-tabs-strip">
        {BATCH_TABS.map(tab => (
          <button key={tab.id} className={`bd-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span>{tab.label}</span>
            <span className="bd-tab-count">{tab.count}</span>
            {activeTab === tab.id && <motion.div className="bd-tab-active-pill" layoutId="bdTabActive" />}
          </button>
        ))}
      </div>

      {/* ── Tab Content Area ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'lectures' && (
          <motion.div key="lectures" className="bd-lectures-grid-custom" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {MOCK_LECTURES.map((lec) => (
              <div key={lec.id} className={`netflix-lec-card glass-panel ${lec.locked ? 'locked' : ''}`} onClick={() => !lec.locked && openBottomSheet(lec)}>
                <div className="netflix-thumb-wrap">
                  <img src="/images/hero-1.png" alt={lec.title} className="netflix-thumb" />
                  {lec.watchProgress > 0 && (
                    <div className="netflix-progress-bar-track">
                      <div className="netflix-progress-bar-fill" style={{ width: `${lec.watchProgress}%` }} />
                    </div>
                  )}
                  {lec.locked ? (
                    <div className="netflix-lock-overlay"><Lock size={20} /></div>
                  ) : (
                    <div className="netflix-play-hover"><Play size={24} fill="white" /></div>
                  )}
                  {lec.badge && <span className="netflix-badge">{lec.badge}</span>}
                </div>
                <div className="netflix-info">
                  <div className="netflix-title-row">
                    <h5>Lec {lec.num}: {lec.title}</h5>
                  </div>
                  <div className="netflix-meta">
                    <span>{lec.duration}</span>
                    <span className="dot">·</span>
                    <span>{lec.views} views</span>
                    <span className="dot">·</span>
                    <span className="tutor-lbl">By {lec.tutor}</span>
                  </div>
                  <div className="netflix-footer-row">
                    <DiffBadge level={lec.difficulty} />
                    {lec.watchProgress > 0 && <span className="netflix-progress-txt">{lec.watchProgress}% watched</span>}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div key="roadmap" className="bd-timeline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {MOCK_CHAPTERS.map((ch, idx) => (
              <div key={ch.id} className={`timeline-node ${ch.status}`}>
                <div className="timeline-left">
                  <div className={`timeline-circle ${ch.status === 'completed' ? 'active' : ch.status === 'current' ? 'pulse' : ''}`}>
                    {ch.status === 'completed' ? <CheckCircle size={14} /> : idx + 1}
                  </div>
                  {idx < MOCK_CHAPTERS.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-right">
                  <h5>{ch.title}</h5>
                  <div className="timeline-meta">
                    <span>{ch.lecturesCount} Lectures</span>
                    <span className="dot">·</span>
                    <span className={`timeline-status-badge ${ch.status}`}>{ch.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'dpp' && (
          <motion.div key="dpp" className="bd-list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <LiveDppQuizPanel />
            
            <div className="dpp-stats-row glass-panel" style={{ marginTop: '1.25rem' }}>
              <div className="dpp-stat">
                <span className="dpp-stat-val">1/4</span>
                <span className="dpp-stat-lbl">DPPs Solved</span>
              </div>
              <div className="dpp-stat">
                <span className="dpp-stat-val">91%</span>
                <span className="dpp-stat-lbl">Accuracy</span>
              </div>
              <div className="dpp-stat">
                <span className="dpp-stat-val">1m 22s</span>
                <span className="dpp-stat-lbl">Avg Time / Q</span>
              </div>
            </div>
            {MOCK_DPPS.map((dpp) => (
              <div key={dpp.id} className="bd-resource-row glass-panel">
                <div className="bd-resource-icon dpp">
                  <HelpCircle size={18} />
                </div>
                <div className="bd-resource-info">
                  <h5>{dpp.title}</h5>
                  <div className="bd-resource-meta">
                    <span>{dpp.questions} Questions</span>
                    <span className="dot">·</span>
                    <DiffBadge level={dpp.difficulty} />
                  </div>
                </div>
                <button className={`bd-dl-btn ${dpp.locked ? 'locked' : ''}`} onClick={() => dpp.locked ? alert('Enroll to unlock DPPs') : alert(`Downloading DPP ${dpp.num}`)}>
                  {dpp.locked ? <Lock size={13} /> : <Download size={13} />}
                  <span>{dpp.locked ? 'Locked' : 'Download'}</span>
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'notes' && (
          <motion.div key="notes" className="bd-list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Notes Section with Teacher notes and Handwritten notebook option */}
            <div className="notes-mode-split">
              <div className="notes-left">
                <h4 className="notes-sub-header">Teacher Notes & Formula Sheets</h4>
                {MOCK_NOTES.map((note) => (
                  <div key={note.id} className="bd-resource-row glass-panel">
                    <div className="bd-resource-icon notes">
                      <FileText size={18} />
                    </div>
                    <div className="bd-resource-info">
                      <h5>{note.title}</h5>
                      <div className="bd-resource-meta">
                        <span>{note.pages} Pages</span>
                        <span className="dot">·</span>
                        <span>{note.size}</span>
                      </div>
                    </div>
                    <button className={`bd-dl-btn notes ${note.locked ? 'locked' : ''}`} onClick={() => note.locked ? alert('Enroll to unlock notes') : setActivePdf(note)}>
                      {note.locked ? <Lock size={13} /> : <BookOpen size={13} />}
                      <span>{note.locked ? 'Locked' : 'Read'}</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="notes-right glass-panel">
                <h4 className="notes-sub-header"><Edit2 size={13} /> My Handwritten Notebook</h4>
                <textarea className="handwritten-notebook" placeholder="Type your personal class notes, key formulas, questions to ask etc. saved automatically." value={personalNotes} onChange={e => savePersonalNotes(e.target.value)} />
                <span className="notebook-saved-hint">Saved to Local Storage</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div key="quiz" className="bd-quiz-panel glass-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bd-quiz-header">
              <Zap size={18} style={{ color: 'var(--color-primary)' }} />
              <h3>Weekly Practice Quiz</h3>
              <span>{MOCK_QUIZ.length} Questions</span>
            </div>
            <QuizPanel />
          </motion.div>
        )}

        {activeTab === 'revision' && (
          <motion.div key="revision" className="bd-revision-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="revision-hero glass-panel">
              <Award size={36} className="rev-icon" />
              <h3>EW Revision Center</h3>
              <p>Generate instant mind maps, cheat sheets, or trigger flashcards for Ray Optics.</p>
              <div className="revision-actions">
                <button className="rev-action-btn" onClick={() => alert('Generating Mind Map...')}><BrainCircuit size={15} /> Formula Sheet</button>
                <button className="rev-action-btn" onClick={() => alert('Generating Flashcards...')}><Sparkles size={15} /> Flashcards</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Viewer Modal */}
      {activePdf && (
        <PdfViewer title={activePdf.title} fileUrl={activePdf.url} onClose={() => setActivePdf(null)} />
      )}

      {/* ── Android Native Style Bottom Sheet ── */}
      <AnimatePresence>
        {showBottomSheet && bottomSheetLecture && (
          <>
            <motion.div className="bottom-sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBottomSheet(false)} />
            <motion.div className="bottom-sheet glass-panel" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 250 }}>
              <div className="bottom-sheet-handle-bar" />
              <div className="bottom-sheet-header">
                <div className="bs-header-info">
                  <span className="bs-eyebrow">Lec {bottomSheetLecture.num} Options</span>
                  <h4>{bottomSheetLecture.title}</h4>
                </div>
                <button className="bs-close-btn" onClick={() => setShowBottomSheet(false)}><X size={18} /></button>
              </div>
              <div className="bottom-sheet-options-grid">
                <button className="bs-option-btn primary" onClick={() => handlePlayVideo(bottomSheetLecture)}>
                  <Play size={16} fill="white" />
                  <span>Resume Lecture</span>
                </button>
                <button className="bs-option-btn" onClick={() => { setShowBottomSheet(false); setActiveTab('notes'); }}>
                  <FileText size={16} />
                  <span>Read Class Notes</span>
                </button>
                <button className="bs-option-btn" onClick={() => alert('AI Summary generating...')}>
                  <BrainCircuit size={16} />
                  <span>AI Lecture Summary</span>
                </button>
                <button className="bs-option-btn" onClick={() => alert('Downloading to Offline Center...')}>
                  <Download size={16} />
                  <span>Download Video</span>
                </button>
                <button className="bs-option-btn" onClick={() => alert('Added to Bookmarks')}>
                  <Bookmark size={16} />
                  <span>Bookmark Timestamp</span>
                </button>
                <button className="bs-option-btn" onClick={() => alert('Link copied!')}>
                  <Share2 size={16} />
                  <span>Share Lecture</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BatchDetail;
