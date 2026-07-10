import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Smile, Layers, Palette, Shield, 
  HelpCircle, Save, Camera, CheckCircle, Play, Eye, EyeOff,
  BookOpen, TrendingUp, Award, Trophy, Download, Bookmark, FileText,
  Heart, CreditCard, Bell, Gift, BookOpenCheck, Settings, LogOut, X,
  Copy, Check, Share2, QrCode, Plus, Trash2, Edit3, ExternalLink, ShieldAlert, Search, Zap, Clock
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import { ProfileTabSkeleton } from '../components/ui/SkeletonLoader';
import './ProfilePage.css';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'progress', label: 'Study Progress', icon: TrendingUp },
  { id: 'achievements', label: 'Awards & Badges', icon: Trophy },
  { id: 'saved', label: 'Saved & Downloads', icon: Bookmark },
  { id: 'notes', label: 'Study Notes', icon: FileText },
  { id: 'referral', label: 'Premium & Referral', icon: Gift },
  { id: 'settings', label: 'Settings & Support', icon: Settings }
];

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const addNotification = useNotificationStore(s => s.addNotification);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoadingTab, setIsLoadingTab] = useState(false);

  const handleTabChange = (tabId) => {
    setIsLoadingTab(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setIsLoadingTab(false);
    }, 400);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Profile picture
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem(`edura_profile_pic_${user?.id}`) || '';
  });

  // User details state
  const [userDetails, setUserDetails] = useState({
    name: user?.username || 'Student Name',
    email: user?.email || 'student@edura.in',
    mobile: '9876543210',
    dob: '2005-08-15',
    targetExam: 'JEE Main & Advanced 2026',
    classLevel: 'Class 12th Dropper',
    joiningDate: 'June 12, 2026',
    membership: 'Pro Scholar',
    level: 14,
    streak: 7,
    rank: 'Rank 120 / 10,450',
    board: 'CBSE Board',
    lang: 'English (Hinglish)',
    goal: 'Cracking IIT Bombay CSE',
    institute: 'Edura Kota Online'
  });

  // Personal Notes state
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem(`edura_notes_${user?.id}`);
    return stored ? JSON.parse(stored) : [
      { id: 1, title: 'Electrostatics Formulas', content: 'E = kQ/r^2\nV = kQ/r\nFlux = Q/E0', date: '01 Jul 2026' },
      { id: 2, title: 'Organic Chemistry Roadmap', content: 'GOC -> Hydrocarbons -> Haloalkanes -> Alcohols', date: '29 Jun 2026' }
    ];
  });
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [searchNote, setSearchNote] = useState('');

  // Downloads state
  const [downloads, setDownloads] = useState([
    { id: 1, name: 'Ray Optics Lecture 06.mp4', size: '245 MB', type: 'video' },
    { id: 2, name: 'Thermodynamics Formulas.pdf', size: '12 MB', type: 'pdf' },
    { id: 3, name: 'Organic Reaction Mechanisms.pdf', size: '18 MB', type: 'pdf' }
  ]);

  // Wishlist state
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'JEE Advanced Ranker Test Series 2026', price: '₹1,999', rating: '4.8 ★' },
    { id: 2, name: 'Concepts of Physics (HC Verma Vol 1 & 2) Solutions', price: '₹499', rating: '4.9 ★' }
  ]);

  // HSL Theme Creator State
  const [hue, setHue] = useState(270);
  const [saturation, setSaturation] = useState(80);

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.setItem(`edura_notes_${user?.id}`, JSON.stringify(notes));
  }, [notes, user?.id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addNotification({ message: "File size exceeds 2MB limit", type: "error" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setProfilePic(base64data);
        localStorage.setItem(`edura_profile_pic_${user?.id}`, base64data);
        localStorage.setItem(`profilePic`, base64data); // sync global
        addNotification({ message: "Avatar picture updated!", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    addNotification({ message: "Profile details updated successfully!", type: "success" });
    setIsEditModalOpen(false);
  };

  const addNote = (e) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const newNote = {
      id: Date.now(),
      title: noteTitle,
      content: noteContent,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setNotes([newNote, ...notes]);
    setNoteTitle('');
    setNoteContent('');
    addNotification({ message: "New study note created!", type: "success" });
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    addNotification({ message: "Note deleted.", type: "info" });
  };

  const deleteDownload = (id) => {
    setDownloads(downloads.filter(d => d.id !== id));
    addNotification({ message: "Download removed from local cache", type: "info" });
  };

  const removeWishlist = (id) => {
    setWishlist(wishlist.filter(w => w.id !== id));
    addNotification({ message: "Item removed from wishlist", type: "info" });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText("EDURAPRO50");
    setCopiedCode(true);
    addNotification({ message: "Referral code copied!", type: "success" });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const applyHSLTheme = (h, s) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', `hsl(${h}, ${s}%, 50%)`);
    root.style.setProperty('--color-primary-light', `hsl(${h}, ${s}%, 65%)`);
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${h}, ${s}%, 50%) 0%, hsl(${(h + 40) % 360}, ${s}%, 45%) 100%)`);
    root.style.setProperty('--gradient-border', `linear-gradient(135deg, hsl(${h}, ${s}%, 50%), hsl(${(h + 120) % 360}, ${s}%, 50%))`);
  };

  const selectPreset = (presetName) => {
    const root = document.documentElement;
    if (presetName === 'dark') {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('edura_theme', 'dark');
      setHue(270); setSaturation(80); applyHSLTheme(270, 80);
      addNotification({ message: 'Dark mode theme preset loaded!', type: 'info' });
    } else if (presetName === 'light') {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('edura_theme', 'light');
      addNotification({ message: 'Light mode theme preset loaded!', type: 'info' });
    } else if (presetName === 'cyberpunk') {
      root.setAttribute('data-theme', 'dark');
      setHue(320); setSaturation(95); applyHSLTheme(320, 95);
      addNotification({ message: 'Cyberpunk Neon preset loaded!', type: 'info' });
    }
  };

  useEffect(() => {
    applyHSLTheme(hue, saturation);
  }, [hue, saturation]);

  const handleLogoutMenuClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="pw-settings-container">
      {/* 1. Profile Header Banner */}
      <div className="pw-profile-header glass-panel">
        <div className="header-bg-glow" />
        <div className="header-main-content">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {profilePic ? (
                <img src={profilePic} alt="Avatar" className="profile-large-avatar" />
              ) : (
                <div className="profile-large-fallback">{userDetails.name.charAt(0).toUpperCase()}</div>
              )}
              <label className="avatar-upload-trigger">
                <Camera size={14} />
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <div className="user-title-box">
              <div className="name-row">
                <h2>{userDetails.name}</h2>
                <span className="verified-badge" title="Verified Scholar">✓</span>
                <span className="premium-badge">PRO ELITE</span>
              </div>
              <p className="student-id">Student ID: EW-{user?.id?.substring(5,10).toUpperCase() || '88390'}</p>
              <div className="exam-tag">{userDetails.targetExam}</div>
            </div>
          </div>

          <div className="header-actions-row">
            <button className="header-action-btn" onClick={() => setIsEditModalOpen(true)}>
              <Edit3 size={14} /> Edit Profile
            </button>
            <button className="header-action-btn" onClick={() => setIsShareModalOpen(true)}>
              <Share2 size={14} /> Share
            </button>
            <button className="header-action-btn" onClick={() => setIsQrModalOpen(true)}>
              <QrCode size={14} /> QR Code
            </button>
          </div>
        </div>

        {/* Mini stats cards right on the header */}
        <div className="header-stats-strip">
          <div className="strip-item">
            <span className="strip-label">XP Level</span>
            <span className="strip-val">{userDetails.level}</span>
          </div>
          <div className="strip-divider" />
          <div className="strip-item">
            <span className="strip-label">Daily Streak</span>
            <span className="strip-val">🔥 {userDetails.streak} Days</span>
          </div>
          <div className="strip-divider" />
          <div className="strip-item">
            <span className="strip-label">Global Rank</span>
            <span className="strip-val">{userDetails.rank}</span>
          </div>
        </div>
      </div>

      {/* 2. Split Navigation Layout */}
      <div className="pw-settings-split-layout">
        {/* Left Sub-Navigation Menu */}
        <div className="pw-settings-nav-sidebar glass-panel">
          <div className="pw-settings-menu-list">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`pw-settings-menu-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div className="pw-settings-menu-active-bg" layoutId="activeSettingsTabPill" />
                  )}
                </button>
              );
            })}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', margin: '0.5rem 0' }} />
            <button className="pw-settings-menu-item logout-menu-item" onClick={handleLogoutMenuClick}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Right Side Content Panel */}
        <div className="pw-settings-content-card glass-panel">
          {isLoadingTab ? (
            <ProfileTabSkeleton tab={activeTab} />
          ) : (
            <AnimatePresence mode="wait">
            
            {/* TAB: MY PROFILE */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-sub-panel">
                <h3>My Academic Profile</h3>
                
                {/* 4 Hero statistics cards */}
                <div className="hero-stats-grid">
                  <div className="hero-stat-card glass-panel">
                    <div className="stat-card-icon blue"><Clock size={20} /></div>
                    <div className="stat-card-info">
                      <h4>148 Hrs</h4>
                      <span>Study Hours</span>
                    </div>
                    <span className="trend-indicator upward">+12%</span>
                  </div>
                  <div className="hero-stat-card glass-panel">
                    <div className="stat-card-icon green"><Play size={20} /></div>
                    <div className="stat-card-info">
                      <h4>86</h4>
                      <span>Completed Lectures</span>
                    </div>
                    <span className="trend-indicator upward">+8%</span>
                  </div>
                  <div className="hero-stat-card glass-panel">
                    <div className="stat-card-icon purple"><FileText size={20} /></div>
                    <div className="stat-card-info">
                      <h4>14</h4>
                      <span>Completed Tests</span>
                    </div>
                    <span className="trend-indicator stability">100%</span>
                  </div>
                  <div className="hero-stat-card glass-panel">
                    <div className="stat-card-icon orange"><Zap size={20} /></div>
                    <div className="stat-card-info">
                      <h4>7 Days</h4>
                      <span>Current Streak</span>
                    </div>
                    <span className="trend-indicator upward">Active</span>
                  </div>
                </div>

                {/* Academic details */}
                <div className="academic-details-box glass-panel">
                  <h4>Academic Information</h4>
                  <div className="academic-details-grid">
                    <div className="detail-row">
                      <span className="det-lbl">Target Exam:</span>
                      <span className="det-val">{userDetails.targetExam}</span>
                    </div>
                    <div className="detail-row">
                      <span className="det-lbl">Class / Stream:</span>
                      <span className="det-val">{userDetails.classLevel}</span>
                    </div>
                    <div className="detail-row">
                      <span className="det-lbl">Board:</span>
                      <span className="det-val">{userDetails.board}</span>
                    </div>
                    <div className="detail-row">
                      <span className="det-lbl">Language Mode:</span>
                      <span className="det-val">{userDetails.lang}</span>
                    </div>
                    <div className="detail-row">
                      <span className="det-lbl">Preferred Goal:</span>
                      <span className="det-val">{userDetails.goal}</span>
                    </div>
                    <div className="detail-row">
                      <span className="det-lbl">Learning Institute:</span>
                      <span className="det-val">{userDetails.institute}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: MY COURSES */}
            {activeTab === 'courses' && (
              <motion.div key="courses" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-sub-panel">
                <h3>My Courses & Batches</h3>
                <div className="courses-grid-list">
                  <div className="course-card-premium glass-panel">
                    <div className="course-card-content">
                      <h5>Lakshya JEE 2025</h5>
                      <span className="educator-lbl">By Alakh Pandey & Kota Star Team</span>
                      <div className="course-prog-row">
                        <div className="prog-bar-container">
                          <div className="prog-bar-fill" style={{ width: '64%' }}></div>
                        </div>
                        <span className="prog-text">64% Completed</span>
                      </div>
                      <div className="course-actions">
                        <button className="c-act-btn primary" onClick={() => navigate('/dashboard/batches')}>Continue Learning</button>
                        <button className="c-act-btn outline" onClick={() => addNotification({ message: "Notes opening offline...", type: "info" })}>Download Notes</button>
                      </div>
                    </div>
                  </div>

                  <div className="course-card-premium glass-panel">
                    <div className="course-card-content">
                      <h5>JEE Backlog Killer Series</h5>
                      <span className="educator-lbl">By MR Sir & Pankaj Sir</span>
                      <div className="course-prog-row">
                        <div className="prog-bar-container">
                          <div className="prog-bar-fill" style={{ width: '12%' }}></div>
                        </div>
                        <span className="prog-text">12% Completed</span>
                      </div>
                      <div className="course-actions">
                        <button className="c-act-btn primary" onClick={() => navigate('/dashboard/batches')}>Start Class</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: STUDY PROGRESS */}
            {activeTab === 'progress' && (
              <motion.div key="progress" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-sub-panel">
                <h3>Study Progress & Analytics</h3>
                
                <div className="progress-split-dashboard">
                  <div className="circular-progress-card glass-panel">
                    <h5>Overall Syllabus Completion</h5>
                    <div className="circular-meter">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" className="circle-bg" stroke="rgba(255,255,255,0.06)" fill="none" strokeWidth="6" />
                        <circle cx="60" cy="60" r="50" className="circle-fill" stroke="var(--color-primary)" fill="none" strokeWidth="6" strokeDasharray="314" style={{ strokeDashoffset: 314 - (314 * 0.74) }} />
                      </svg>
                      <div className="meter-text">
                        <strong>74%</strong>
                        <span>Completed</span>
                      </div>
                    </div>
                    <div className="sub-prog-bar">
                      <span>Physics: <strong>82%</strong></span>
                      <span>Chemistry: <strong>68%</strong></span>
                      <span>Maths: <strong>72%</strong></span>
                    </div>
                  </div>

                  <div className="graphs-analytics-card glass-panel">
                    <h5>Weekly Study Hours Chart</h5>
                    <div className="simple-bars-graph" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100px', padding: '10px 0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '40px', background: 'var(--color-primary)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Mon</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '70px', background: 'var(--color-primary)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Tue</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '90px', background: 'var(--color-primary)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Wed</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '50px', background: 'var(--color-primary)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Thu</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '85px', background: 'var(--color-primary)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Fri</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '30px', background: 'var(--color-primary)', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Sat</span>
                      </div>
                    </div>

                    <div className="strength-card" style={{ marginTop: '12px', fontSize: '0.75rem' }}>
                      <span className="badge-green" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Strong: Mechanics, Physical Chem</span>
                      <span className="badge-red" style={{ marginLeft: '10px', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Weak: Thermodynamics</span>
                    </div>
                  </div>
                </div>

                <div className="ai-recommendation-alert glass-panel" style={{ marginTop: '1.5rem', display: 'flex', gap: '12px', padding: '1rem', borderLeft: '4px solid #a78bfa' }}>
                  <TrendingUp size={20} className="text-purple-400" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#fff' }}>AI Copilot Action Plan</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      We noticed you scored low on GOC mock-series. We recommend spending 20 minutes practicing Organic Reaction Mechanisms to boost scores.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: AWARDS & BADGES (Merged Achievements & Certificates) */}
            {activeTab === 'achievements' && (
              <motion.div key="achievements" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-sub-panel">
                <h3>Awards, Badges & Certificates</h3>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '12px' }}>Unlocked Badges</h5>
                  <div className="badges-grid-console">
                    <div className="badge-item-unlocked glass-panel">
                      <Trophy className="badge-icon glow-yellow" size={24} />
                      <strong>Early Adopter</strong>
                      <span>Joined during launch</span>
                    </div>
                    <div className="badge-item-unlocked glass-panel">
                      <Zap className="badge-icon glow-orange" size={24} />
                      <strong>7 Day Streak</strong>
                      <span>Perfect revision week</span>
                    </div>
                    <div className="badge-item-unlocked glass-panel">
                      <CheckCircle className="badge-icon glow-green" size={24} />
                      <strong>Test Winner</strong>
                      <span>Cleared first milestone test</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '12px' }}>Course Certificates</h5>
                  <div className="empty-certificates-state" style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px' }}>
                    <Award size={36} style={{ color: 'var(--color-text-muted)', opacity: 0.4, marginBottom: '0.75rem', marginInline: 'auto' }} />
                    <h4 style={{ fontSize: '0.9rem', margin: 0, color: '#fff' }}>No Certificates Unlocked Yet</h4>
                    <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', marginBottom: '1rem' }}>
                      Certificates are awarded upon successful completion of premium batches and scoring 80%+ on term exams.
                    </p>
                    <button className="c-act-btn outline" style={{ marginInline: 'auto', fontSize: '0.72rem', padding: '4px 12px' }} onClick={() => navigate('/dashboard/batches')}>
                      Browse Core Batches
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: SAVED & DOWNLOADS (Merged Wishlist, Bookmarks & Downloads) */}
            {activeTab === 'saved' && (
              <motion.div key="saved" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-sub-panel">
                <h3>Saved Items & Offline Storage</h3>
                
                {/* 1. Offline Storage Downloads */}
                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Offline Cache Storage</h5>
                  <div className="storage-meter-box glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span>Offline Storage Usage</span>
                      <strong>275 MB of 32 GB Used</strong>
                    </div>
                    <div className="prog-bar-container" style={{ height: '8px' }}>
                      <div className="prog-bar-fill" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                  <div className="downloads-list-box">
                    {downloads.map(item => (
                      <div key={item.id} className="download-item-row glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '6px' }}>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: '#fff', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Size: {item.size} • Type: {item.type.toUpperCase()}</span>
                        </div>
                        <button className="comm-notif-dismiss" onClick={() => deleteDownload(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. My Wishlist */}
                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>My Batch Wishlist</h5>
                  <div className="wishlist-list">
                    {wishlist.map(item => (
                      <div key={item.id} className="download-item-row glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '6px' }}>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: '#fff', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)' }}>Price: {item.price} • Rating: {item.rating}</span>
                        </div>
                        <button className="comm-notif-dismiss" onClick={() => removeWishlist(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    {wishlist.length === 0 && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Wishlist is empty.</p>}
                  </div>
                </div>

                {/* 3. Bookmarks */}
                <div>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Saved Doubt Bookmarks</h5>
                  <div className="empty-bookmarks" style={{ textAlign: 'center', padding: '1.5rem 1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px' }}>
                    <Bookmark size={24} style={{ color: 'var(--color-text-muted)', opacity: 0.4, marginBottom: '0.5rem', marginInline: 'auto' }} />
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>You haven't bookmarked any class slides or doubts yet.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: STUDY NOTES */}
            {activeTab === 'notes' && (
              <motion.div key="notes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-sub-panel">
                <h3>Personal Study Notes</h3>

                {/* Search notes */}
                <div className="dashboard-search" style={{ marginBottom: '1.25rem' }}>
                  <Search size={16} />
                  <input type="text" placeholder="Search notes..." value={searchNote} onChange={e => setSearchNote(e.target.value)} />
                </div>

                <form onSubmit={addNote} className="note-creation-form glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  <h5>Create Note</h5>
                  <input type="text" placeholder="Note title..." value={noteTitle} onChange={e => setNoteTitle(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }} />
                  <textarea placeholder="Write note content here..." value={noteContent} onChange={e => setNoteContent(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', minHeight: '60px' }} />
                  <button type="submit" className="pw-settings-save-btn" style={{ padding: '0.4rem 1rem', alignSelf: 'flex-start', marginTop: '4px' }}>
                    <Plus size={14} /> Add Note
                  </button>
                </form>

                <div className="notes-list-grid">
                  {notes.filter(n => n.title.toLowerCase().includes(searchNote.toLowerCase())).map(note => (
                    <div key={note.id} className="note-card-item glass-panel" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)', position: 'relative', marginBottom: '8px' }}>
                      <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{note.title}</strong>
                      <p style={{ color: '#cbd5e1', fontSize: '0.78rem', margin: '6px 0 0 0', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                      <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block', marginTop: '10px' }}>Created: {note.date}</span>
                      <button onClick={() => deleteNote(note.id)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: PREMIUM & REFERRAL (Merged Subscription & Referral) */}
            {activeTab === 'referral' && (
              <motion.div key="referral" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-sub-panel">
                <h3>Premium & Referral Console</h3>

                {/* Subscription Info */}
                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '12px' }}>Active Packages & Subscriptions</h5>
                  <div className="pw-subscriptions-list">
                    <div className="pw-sub-card active" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      <div className="pw-sub-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h5 style={{ margin: 0, color: '#fff' }}>Lakshya JEE 2026 Batch (Hinglish)</h5>
                        <span className="pw-status-pill active" style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '2px 6px', borderRadius: '4px' }}>Active</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Access ends on: 15 Jun 2027</p>
                    </div>
                  </div>
                </div>
                
                {/* Referral Code */}
                <div>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '8px' }}>Refer & Earn XP Rewards</h5>
                  <div className="referral-box glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '16px' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                      Share your unique referral code with aspirants to unlock 1,000 Scholar XP points and ₹500 discounts on membership renewals.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', maxWidth: '300px', marginInline: 'auto' }}>
                      <div style={{ flex: 1, padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '1px' }}>
                        EDURAPRO50
                      </div>
                      <button className="pw-settings-save-btn" onClick={copyReferralCode} style={{ padding: '0.6rem 1rem' }}>
                        {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: SETTINGS & SUPPORT (Merged Settings, Preferences, Purchase History & Help Support) */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="settings-sub-panel">
                <h3>Settings, Support & History</h3>
                
                {/* A. Accent Customizer */}
                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Theme Customizer & Accents</h5>
                  <div className="theme-presets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '1rem' }}>
                    <button className="preset-card dark-mode-preset" onClick={() => selectPreset('dark')} style={{ padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.78rem' }}>
                      Dark Presets
                    </button>
                    <button className="preset-card light-mode-preset" onClick={() => selectPreset('light')} style={{ padding: '0.75rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', color: '#111', cursor: 'pointer', fontSize: '0.78rem' }}>
                      Light Presets
                    </button>
                    <button className="preset-card cyberpunk-preset" onClick={() => selectPreset('cyberpunk')} style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #bd00ff, #00d6ff)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.78rem' }}>
                      Cyberpunk Neon
                    </button>
                  </div>

                  <div className="hsl-customizer-box glass-panel" style={{ padding: '1rem' }}>
                    <div style={{ margin: '0.5rem 0' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span>Hue Spectrum</span>
                        <strong>{hue}°</strong>
                      </label>
                      <input type="range" min="0" max="360" value={hue} onChange={e => setHue(parseInt(e.target.value))} style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>

                {/* B. Notification Preferences */}
                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Notification Preferences</h5>
                  <div className="preferences-list glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1rem' }}>
                    <label className="pref-item" style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.8rem', color: '#fff' }}>Class Reminders</strong>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Get notified 10 minutes before live lectures start.</span>
                      </div>
                    </label>
                    <label className="pref-item" style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.8rem', color: '#fff' }}>Assignment Alerts</strong>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Get alerts when a new homework or assignments solution is posted.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* C. Purchase History Table */}
                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Purchase History</h5>
                  <div className="purchase-table-box glass-panel" style={{ overflowX: 'auto', padding: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left', minWidth: '350px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <th style={{ padding: '0.5rem', color: '#94a3b8' }}>Order ID</th>
                          <th style={{ padding: '0.5rem', color: '#94a3b8' }}>Item</th>
                          <th style={{ padding: '0.5rem', color: '#94a3b8' }}>Amount</th>
                          <th style={{ padding: '0.5rem', color: '#10b981' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>ORD-288301</td>
                          <td style={{ padding: '0.5rem', color: '#fff', fontWeight: 500 }}>Pro Scholar Elite Membership</td>
                          <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>₹4,999</td>
                          <td style={{ padding: '0.5rem', color: '#10b981' }}>Success</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* D. Help & Support Ticketing */}
                <div>
                  <h5 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Help & Support Center</h5>
                  <div className="help-box glass-panel" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0 0 1rem 0' }}>
                      If you experience streaming lags, payment processing issues, or doubt solver bugs, submit a support query to our coordinators.
                    </p>
                    <button className="pw-settings-save-btn" onClick={() => addNotification({ message: 'Support ticket successfully dispatched!', type: 'success' })}>
                      Create Support Ticket
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          )}
        </div>
      </div>

      {/* MODAL: EDIT PROFILE */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="profile-modal-overlay">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="profile-modal-card glass-panel">
              <div className="modal-header">
                <h3>Edit Profile Details</h3>
                <button className="modal-close" onClick={() => setIsEditModalOpen(false)}><X size={16} /></button>
              </div>
              <form onSubmit={handleSaveDetails} className="pw-settings-form">
                <div className="settings-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="pw-form-group-large">
                    <label>Full Name</label>
                    <input type="text" value={userDetails.name} onChange={e => setUserDetails({ ...userDetails, name: e.target.value })} className="pw-form-input" required />
                  </div>
                  <div className="pw-form-group-large">
                    <label>Email ID</label>
                    <input type="email" value={userDetails.email} onChange={e => setUserDetails({ ...userDetails, email: e.target.value })} className="pw-form-input" required />
                  </div>
                  <div className="pw-form-group-large">
                    <label>Mobile Number</label>
                    <input type="text" value={userDetails.mobile} onChange={e => setUserDetails({ ...userDetails, mobile: e.target.value })} className="pw-form-input" />
                  </div>
                  <div className="pw-form-group-large">
                    <label>Target Exam</label>
                    <input type="text" value={userDetails.targetExam} onChange={e => setUserDetails({ ...userDetails, targetExam: e.target.value })} className="pw-form-input" />
                  </div>
                </div>
                <button type="submit" className="pw-settings-save-btn" style={{ marginTop: '1.25rem' }}>Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SHARE PROFILE */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="profile-modal-overlay">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="profile-modal-card glass-panel" style={{ maxWidth: '360px', textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div className="modal-header" style={{ justifyContent: 'center' }}>
                <h4 style={{ margin: 0 }}>Share Profile Link</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '1rem 0' }}>
                Copy your profile link to share your study hours and rank with friends.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={`https://edura.in/student/${user?.id || '9820'}`} readOnly style={{ flex: 1, padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#cbd5e1', fontSize: '0.75rem' }} />
                <button className="pw-settings-save-btn" onClick={() => { navigator.clipboard.writeText(`https://edura.in/student/${user?.id || '9820'}`); addNotification({ message: 'Profile link copied!', type: 'success' }); setIsShareModalOpen(false); }}>Copy</button>
              </div>
              <button className="c-act-btn outline" style={{ marginTop: '1.25rem', width: '100%' }} onClick={() => setIsShareModalOpen(false)}>Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: QR CODE */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="profile-modal-overlay">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="profile-modal-card glass-panel" style={{ maxWidth: '300px', textAlign: 'center', padding: '2rem 1.5rem' }}>
              <h4 style={{ margin: 0 }}>Join Telegram Community</h4>
              
              {/* Live Telegram QR Code */}
              <div className="qr-container" style={{ margin: '1.5rem auto', width: '170px', height: '170px', background: '#fff', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://t.me/InEducationAORAFarming&color=09090b" 
                  alt="Telegram QR Code" 
                  style={{ width: '150px', height: '150px', display: 'block' }}
                />
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>Scan this code to join our official Telegram channel and sync with live updates & community rewards!</p>
              <button className="c-act-btn outline" style={{ marginTop: '1.25rem', width: '100%' }} onClick={() => setIsQrModalOpen(false)}>Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProfilePage;
