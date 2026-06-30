import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ShieldBan, Database, Bell, Upload, FileText, MessageSquare,
  Search, Ban, CheckCircle, Send, LogOut, ChevronDown, Eye,
  Clock, Monitor, BarChart3, Radio, Plus, Smartphone, BookOpen, BadgeCheck,
  Music, Play, Pause
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { sanitizeInput, sanitizeHTML } from '../utils/sanitize';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const TABS = [
  { id: 'users', label: 'User Analytics', icon: Users },
  { id: 'cms', label: 'Content CMS', icon: Database },
  { id: 'books', label: 'Books Library', icon: BookOpen },
  { id: 'music', label: 'Music Library', icon: Music },
  { id: 'apks', label: 'App Distribution', icon: Smartphone },
  { id: 'notifications', label: 'Push Notifications', icon: Bell },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, logout, toggleUserBlock, user } = useAuthStore();
  const usersState = useAuthStore((s) => s.users); // Auth store state
  const { broadcast, addNotification } = useNotificationStore();

  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  // Simulating fetching from Auth store to reactive state
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Sync with global auth store to load registered users dynamically
    const filtered = usersState.filter((u) => u.role !== 'admin');
    setUsers(filtered);
  }, [usersState]);

  // CMS Batches & Posts State
  const [batchForm, setBatchForm] = useState({ token: '', title: '', thumbnail: '' });
  const [postContent, setPostContent] = useState('');
  const [cmsBatches, setCmsBatches] = useState(() => {
    return JSON.parse(localStorage.getItem('edura_cms_batches') || '[]');
  });
  const [cmsPosts, setCmsPosts] = useState(() => {
    return JSON.parse(localStorage.getItem('edura_cms_posts') || '[]');
  });

  // Advanced Library CMS state
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: 'Physics',
    thumbnail: '',
    fileName: '',
    fileSize: ''
  });
  const [cmsBooks, setCmsBooks] = useState(() => {
    return JSON.parse(localStorage.getItem('edura_cms_books') || '[]');
  });

  // Music CMS State
  const [musicForm, setMusicForm] = useState({
    title: '',
    artist: '',
    genre: 'Bollywood',
    color: '#8B5CF6',
    url: ''
  });
  const [cmsMusic, setCmsMusic] = useState(() => {
    return JSON.parse(localStorage.getItem('edura_cms_music') || '[]');
  });

  // APK CMS State
  const [apkForm, setApkForm] = useState({
    title: '',
    version: '',
    notes: '',
    fileName: '',
    fileSize: ''
  });
  const [cmsApks, setCmsApks] = useState(() => {
    return JSON.parse(localStorage.getItem('edura_cms_apks') || '[]');
  });

  // Notification State
  const [broadcastMsg, setBroadcastMsg] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/ghost');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Performance Optimization: useDeferredValue for search to prevent lag on large user lists
  const deferredSearchQuery = React.useDeferredValue(searchQuery);

  // Reactive user filtering on local state
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(deferredSearchQuery.toLowerCase())
  );

  const handleBanToggle = (userId) => {
    toggleUserBlock(userId);
    const targetUser = users.find((u) => u.id === userId);
    addNotification({
      message: `User ${targetUser?.username} has been ${targetUser?.blocked ? 'unblocked' : 'blocked'}`,
      type: targetUser?.blocked ? 'success' : 'warning',
    });
  };

  const handleAddBatch = (e) => {
    e.preventDefault();
    const newBatch = {
      id: `batch-${Date.now()}`,
      token: sanitizeInput(batchForm.token),
      title: sanitizeInput(batchForm.title),
      thumbnail: sanitizeInput(batchForm.thumbnail),
      createdAt: new Date().toISOString(),
    };
    const updated = [newBatch, ...cmsBatches];
    setCmsBatches(updated);
    localStorage.setItem('edura_cms_batches', JSON.stringify(updated));
    setBatchForm({ token: '', title: '', thumbnail: '' });
    addNotification({ message: `Batch "${newBatch.title}" added!`, type: 'success' });
  };

  const handlePostAnnouncement = () => {
    if (!postContent.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      content: sanitizeHTML(postContent),
      author: user?.username || 'Admin',
      createdAt: new Date().toISOString(),
    };
    const updated = [newPost, ...cmsPosts];
    setCmsPosts(updated);
    localStorage.setItem('edura_cms_posts', JSON.stringify(updated));
    setPostContent('');
    addNotification({ message: 'Community post published!', type: 'success' });
  };

  // Thumbnail file uploader conversion to base64
  const handleBookThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookForm(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF File upload reader
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setBookForm(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${sizeMB} MB`
      }));
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const newBook = {
      id: `book-${Date.now()}`,
      title: sanitizeInput(bookForm.title),
      author: sanitizeInput(bookForm.author),
      category: bookForm.category,
      thumbnail: bookForm.thumbnail,
      fileName: bookForm.fileName || 'reference-material.pdf',
      size: bookForm.fileSize || '8.2 MB',
      createdAt: new Date().toISOString()
    };
    const updated = [newBook, ...cmsBooks];
    setCmsBooks(updated);
    localStorage.setItem('edura_cms_books', JSON.stringify(updated));
    setBookForm({ title: '', author: '', category: 'Physics', thumbnail: '', fileName: '', fileSize: '' });
    addNotification({ message: `Book "${newBook.title}" published!`, type: 'success' });
  };

  // Music CMS Handler
  const handleAddMusic = (e) => {
    e.preventDefault();
    const newTrack = {
      id: `music-${Date.now()}`,
      title: sanitizeInput(musicForm.title),
      artist: sanitizeInput(musicForm.artist),
      genre: musicForm.genre,
      color: musicForm.color,
      url: musicForm.url || 'https://pagalfree.com/musics/placeholder.mp3',
      emoji: '🎵',
      createdAt: new Date().toISOString()
    };
    const updated = [newTrack, ...cmsMusic];
    setCmsMusic(updated);
    localStorage.setItem('edura_cms_music', JSON.stringify(updated));
    setMusicForm({ title: '', artist: '', genre: 'Bollywood', color: '#8B5CF6', url: '' });
    addNotification({ message: `Track "${newTrack.title}" published!`, type: 'success' });
  };

  // APK Uploader files
  const handleApkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setApkForm(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${sizeMB} MB`
      }));
    }
  };

  const handleDeployApk = (e) => {
    e.preventDefault();
    const newApk = {
      id: `apk-${Date.now()}`,
      title: sanitizeInput(apkForm.title),
      version: sanitizeInput(apkForm.version),
      notes: sanitizeInput(apkForm.notes),
      fileName: apkForm.fileName || 'app-release.apk',
      size: apkForm.fileSize || '18.4 MB',
      createdAt: new Date().toISOString()
    };
    const updated = [newApk, ...cmsApks];
    setCmsApks(updated);
    localStorage.setItem('edura_cms_apks', JSON.stringify(updated));
    setApkForm({ title: '', version: '', notes: '', fileName: '', fileSize: '' });
    addNotification({ message: `APK "${newApk.title}" deployed!`, type: 'success' });
  };

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    broadcast(sanitizeInput(broadcastMsg));
    setBroadcastMsg('');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-dashboard admin-panel-container">
      {/* Header */}
      <div className="ad-header">
        <div className="ad-header-left">
          <div className="ad-shield-badge">
            <ShieldBan size={20} />
          </div>
          <div>
            <h1 className="ad-title">Admin Command Center</h1>
            <p className="ad-subtitle">EDURA System Administration</p>
          </div>
        </div>
        <div className="ad-header-right">
          <div className="ad-admin-badge">
            <Radio size={12} className="ad-live-dot" />
            <span>ADMIN MODE</span>
          </div>
          <button className="ad-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="ad-stats-row">
        <div className="ad-stat-card">
          <Users size={20} />
          <div>
            <span className="ad-stat-value">{users.length}</span>
            <span className="ad-stat-label">Total Users</span>
          </div>
        </div>
        <div className="ad-stat-card warning">
          <Ban size={20} />
          <div>
            <span className="ad-stat-value">{users.filter((u) => u.blocked).length}</span>
            <span className="ad-stat-label">Blocked</span>
          </div>
        </div>
        <div className="ad-stat-card success">
          <Database size={20} />
          <div>
            <span className="ad-stat-value">{cmsBatches.length}</span>
            <span className="ad-stat-label">CMS Batches</span>
          </div>
        </div>
        <div className="ad-stat-card info">
          <Smartphone size={20} />
          <div>
            <span className="ad-stat-value">{cmsApks.length}</span>
            <span className="ad-stat-label">APKs Deployed</span>
          </div>
        </div>
      </div>

      {/* Visual Chart: User Signups This Week (Recharts AreaChart) */}
      <div className="admin-graph-card glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--color-surface)', border: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
        <h4 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700 }}>
          <BarChart3 size={16} style={{ color: '#8A2BE2' }} /> User Signups This Week
        </h4>
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { day: 'Mon', count: 12 },
              { day: 'Tue', count: 24 },
              { day: 'Wed', count: 18 },
              { day: 'Thu', count: 35 },
              { day: 'Fri', count: 28 },
              { day: 'Sat', count: 42 },
              { day: 'Sun', count: 31 }
            ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#00BFFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(18,18,27,0.9)', border: '1px solid rgba(138,43,226,0.3)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#00BFFF', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="count" stroke="#8A2BE2" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="ad-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`ad-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div className="ad-tab-indicator" layoutId="adminTabIndicator" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ---- USER ANALYTICS ---- */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            className="ad-tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ad-search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="ad-users-table">
              <div className="ad-table-header">
                <span>User ID</span>
                <span>Username</span>
                <span>IP Address</span>
                <span>Screen Time</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filteredUsers.map((u) => (
                <React.Fragment key={u.id}>
                  <div className={`ad-table-row ${u.blocked ? 'blocked' : ''}`}>
                    <span className="ad-cell-id">{u.id}</span>
                    <span className="ad-cell-name">
                      <div className="ad-user-avatar">{u.username[0].toUpperCase()}</div>
                      <div>
                        <div>{u.username}</div>
                        <div className="ad-cell-email">{u.email}</div>
                      </div>
                    </span>
                    <span className="ad-cell-ip">{u.ip}</span>
                    <span className="ad-cell-time">
                      <Clock size={14} />
                      {u.screenTime}
                    </span>
                    <span>
                      <span 
                        className="ad-status-badge"
                        style={u.blocked ? {
                          background: 'rgba(239,68,68,0.12)',
                          border: '1px solid rgba(239,68,68,0.4)',
                          color: '#FCA5A5',
                          boxShadow: '0 0 10px rgba(239,68,68,0.2)',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                        } : {
                          background: 'rgba(16,185,129,0.12)',
                          border: '1px solid rgba(16,185,129,0.4)',
                          color: '#6EE7B7',
                          boxShadow: '0 0 10px rgba(16,185,129,0.2)',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <span style={{ 
                          width: 6, height: 6, borderRadius: '50%',
                          background: u.blocked ? '#EF4444' : '#10B981',
                          boxShadow: u.blocked ? '0 0 5px #EF4444' : '0 0 5px #10B981',
                          display: 'inline-block'
                        }} />
                        {u.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </span>
                    <span className="ad-cell-actions">
                      <button
                        className={`ad-ban-btn ${u.blocked ? 'unban' : ''}`}
                        onClick={() => handleBanToggle(u.id)}
                        title={u.blocked ? 'Unblock user' : 'Block user'}
                      >
                        {u.blocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                      </button>
                      <button
                        className="ad-expand-btn"
                        onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                        title="View details"
                      >
                        <ChevronDown
                          size={16}
                          style={{
                            transform: expandedUser === u.id ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.3s',
                          }}
                        />
                      </button>
                    </span>
                  </div>

                  <AnimatePresence>
                    {expandedUser === u.id && (
                      <motion.div
                        className="ad-user-detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="ad-detail-grid">
                          <div className="ad-detail-item">
                            <Eye size={14} />
                            <span>Last Active:</span>
                            <strong>{new Date(u.lastActive).toLocaleString()}</strong>
                          </div>
                          <div className="ad-detail-item">
                            <Monitor size={14} />
                            <span>Total Screen Time:</span>
                            <strong>{u.screenTime}</strong>
                          </div>
                          <div className="ad-detail-item full-width">
                            <BarChart3 size={14} />
                            <span>Lecture History:</span>
                            <div className="ad-lecture-tags">
                              {u.lectureHistory && u.lectureHistory.length > 0 ? (
                                u.lectureHistory.map((lec, i) => (
                                  <span key={i} className="ad-lecture-tag">{lec}</span>
                                ))
                              ) : (
                                <span className="ad-no-data">No lectures viewed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}

              {filteredUsers.length === 0 && (
                <div className="ad-empty">No users found matching "{searchQuery}"</div>
              )}
            </div>
          </motion.div>
        )}

        {/* ---- CONTENT CMS ---- */}
        {activeTab === 'cms' && (
          <motion.div
            key="cms"
            className="ad-tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ad-cms-grid">
              {/* Add Batch */}
              <div className="ad-cms-card">
                <h3><Database size={18} /> Add Batch</h3>
                <form onSubmit={handleAddBatch} className="ad-cms-form">
                  <input
                    type="text"
                    placeholder="API Token"
                    value={batchForm.token}
                    onChange={(e) => setBatchForm((p) => ({ ...p, token: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Batch Title"
                    value={batchForm.title}
                    onChange={(e) => setBatchForm((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Thumbnail URL"
                    value={batchForm.thumbnail}
                    onChange={(e) => setBatchForm((p) => ({ ...p, thumbnail: e.target.value }))}
                  />
                  <button type="submit" className="ad-cms-submit">
                    <Plus size={16} /> Add Batch
                  </button>
                </form>

                {cmsBatches.length > 0 && (
                  <div className="ad-cms-list">
                    <h4>Recent Batches</h4>
                    {cmsBatches.slice(0, 5).map((b) => (
                      <div key={b.id} className="ad-cms-list-item">
                        <span>{b.title}</span>
                        <span className="ad-cms-date">{new Date(b.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Advanced Library CMS Uploader */}
              <div className="ad-cms-card">
                <h3><BookOpen size={18} /> Advanced Library CMS</h3>

                {/* Form wrapper strict border-dashed border-2 border-gray-600 bg-[#121212] p-8 rounded-xl */}
                <form onSubmit={handleAddBook} className="border-dashed border-2 border-gray-600 bg-[#121212] p-8 rounded-xl flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Book Title"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    required
                    style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.8rem', borderRadius: '8px' }}
                  />
                  <input
                    type="text"
                    placeholder="Author / Publisher"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    required
                    style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.8rem', borderRadius: '8px' }}
                  />

                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.8rem', borderRadius: '8px' }}
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="General Study">General Study</option>
                  </select>

                  <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-300 font-semibold">Drag & Drop Thumbnail Image</span>
                    <span className="text-xs text-gray-500 mt-1">or click to browse</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBookThumbnailUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-sky-500 hover:bg-sky-500/5 transition-all">
                    <FileText size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-300 font-semibold">Drag & Drop PDF Document</span>
                    <span className="text-xs text-gray-500 mt-1">or click to browse</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {bookForm.thumbnail && (
                    <div className="text-xs text-green-400 font-medium">✓ Thumbnail cover parsed successfully</div>
                  )}
                  {bookForm.fileName && (
                    <div className="text-xs text-sky-400 font-medium">✓ PDF: {bookForm.fileName} ({bookForm.fileSize})</div>
                  )}

                  <button type="submit" className="ad-cms-submit mt-2">
                    <Plus size={16} /> Publish Book
                  </button>
                </form>
              </div>

              {/* Community Announcements */}
              <div className="ad-cms-card full-width">
                <h3><MessageSquare size={18} /> Community Announcements</h3>
                <div className="ad-post-editor">
                  <textarea
                    placeholder="Write an announcement for all users..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={4}
                  />
                  <button
                    className="ad-cms-submit"
                    onClick={handlePostAnnouncement}
                    disabled={!postContent.trim()}
                  >
                    <Send size={16} /> Publish Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- BOOKS LIBRARY ---- */}
        {activeTab === 'books' && (
          <motion.div
            key="books"
            className="ad-tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ad-cms-grid">
              <div className="ad-cms-card">
                <h3><BookOpen size={18} /> Add New Book</h3>
                <form onSubmit={handleAddBook} className="ad-cms-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input type="text" placeholder="Book Title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9', padding: '0.8rem', borderRadius: '8px' }} />
                  <input type="text" placeholder="Author / Publisher" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} required style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9', padding: '0.8rem', borderRadius: '8px' }} />
                  <select value={bookForm.category} onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9', padding: '0.8rem', borderRadius: '8px' }}>
                    {['Physics','Chemistry','Biology','Mathematics','History','Geography','Polity','Economy','Science & Tech'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" placeholder="Thumbnail URL (optional)" value={bookForm.thumbnail} onChange={(e) => setBookForm({ ...bookForm, thumbnail: e.target.value })} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9', padding: '0.8rem', borderRadius: '8px' }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', border: '1px dashed rgba(139,92,246,0.3)', borderRadius: '8px', cursor: 'pointer', color: '#8B5CF6', fontSize: '0.85rem' }}>
                    <Upload size={16} /> Upload PDF File
                    <input type="file" accept=".pdf" onChange={handlePdfUpload} style={{ display: 'none' }} />
                  </label>
                  {bookForm.fileName && <div style={{ color: '#06B6D4', fontSize: '0.8rem' }}>✓ {bookForm.fileName} ({bookForm.fileSize})</div>}
                  <button type="submit" className="ad-cms-submit"><Plus size={16} /> Publish Book</button>
                </form>
              </div>
              <div className="ad-cms-card">
                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Published Books</span>
                  <span style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)', padding: '2px 10px', borderRadius: 999, fontSize: 12 }}>{cmsBooks.length}</span>
                </h3>
                {cmsBooks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                    <BookOpen size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                    <p>No books published yet.</p>
                  </div>
                ) : cmsBooks.map((book) => (
                  <div key={book.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.5rem' }}>
                    <BookOpen size={16} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{book.author} · {book.category}</div>
                    </div>
                    <span style={{ background: 'rgba(16,185,129,0.1)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: 999, fontSize: 11 }}>Live</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- MUSIC LIBRARY ---- */}
        {activeTab === 'music' && (
          <motion.div
            key="music"
            className="ad-tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ad-cms-grid">
              <div className="ad-cms-card">
                <h3><Music size={18} /> Add New Track</h3>
                <form onSubmit={handleAddMusic} className="ad-cms-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input type="text" placeholder="Track Title" value={musicForm.title} onChange={(e) => setMusicForm({ ...musicForm, title: e.target.value })} required style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9', padding: '0.8rem', borderRadius: '8px' }} />
                  <input type="text" placeholder="Artist" value={musicForm.artist} onChange={(e) => setMusicForm({ ...musicForm, artist: e.target.value })} required style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9', padding: '0.8rem', borderRadius: '8px' }} />
                  <select value={musicForm.genre} onChange={(e) => setMusicForm({ ...musicForm, genre: e.target.value })} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9', padding: '0.8rem', borderRadius: '8px' }}>
                    {['Bollywood', 'Lofi', 'Devotional', 'Hip Hop', 'Pop', 'Acoustic'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" placeholder="Direct MP3 URL (Pagalfree, etc.)" value={musicForm.url} onChange={(e) => setMusicForm({ ...musicForm, url: e.target.value })} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9', padding: '0.8rem', borderRadius: '8px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Theme Color:</label>
                    <input type="color" value={musicForm.color} onChange={(e) => setMusicForm({ ...musicForm, color: e.target.value })} style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                  </div>
                  <button type="submit" className="ad-cms-submit" style={{ marginTop: '0.5rem' }}><Plus size={16} /> Publish Track</button>
                </form>
              </div>
              <div className="ad-cms-card">
                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Published Tracks</span>
                  <span style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)', padding: '2px 10px', borderRadius: 999, fontSize: 12 }}>{cmsMusic.length}</span>
                </h3>
                {cmsMusic.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                    <Music size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                    <p>No tracks published yet.</p>
                  </div>
                ) : cmsMusic.map((track) => (
                  <div key={track.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: `1px solid ${track.color}44`, marginBottom: '0.5rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: track.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 10px ${track.color}88` }}>
                      <Play size={14} fill="white" color="white" style={{ marginLeft: 2 }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
                      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{track.artist} · {track.genre}</div>
                    </div>
                    <span style={{ background: 'rgba(16,185,129,0.1)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: 999, fontSize: 11 }}>Live</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- APK DISTRIBUTION ---- */}
        {activeTab === 'apks' && (
          <motion.div
            key="apks"
            className="ad-tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ad-cms-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3><Smartphone size={18} /> App Distribution CMS</h3>
              <form onSubmit={handleDeployApk} className="ad-cms-form">
                <input type="text" placeholder="App Title (e.g. EDURA Mobile)" value={apkForm.title} onChange={(e) => setApkForm({ ...apkForm, title: e.target.value })} required />
                <input type="text" placeholder="Version Number (e.g. v2.1.0)" value={apkForm.version} onChange={(e) => setApkForm({ ...apkForm, version: e.target.value })} required />
                <textarea placeholder="Release Notes / What's new..." value={apkForm.notes} onChange={(e) => setApkForm({ ...apkForm, notes: e.target.value })} rows={4} required style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.8rem', borderRadius: '8px' }} />
                <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-500 hover:bg-green-500/5 transition-all">
                  <Smartphone size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-300 font-semibold">Drag & Drop APK Package</span>
                  <span className="text-xs text-gray-500 mt-1">or click to browse</span>
                  <input type="file" accept=".apk" onChange={handleApkUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                {apkForm.fileName && <div style={{ fontSize: '0.75rem', color: '#00BFFF' }}>✓ {apkForm.fileName} ({apkForm.fileSize})</div>}
                <button type="submit" className="ad-cms-submit"><Smartphone size={16} /> Deploy APK App</button>
              </form>
              {cmsApks.length > 0 && (
                <div className="ad-cms-list" style={{ marginTop: '1.5rem' }}>
                  <h4>Deployed Builds</h4>
                  {cmsApks.map((apk) => (
                    <div key={apk.id} className="ad-cms-list-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{apk.title} ({apk.version})</span>
                      <span className="ad-cms-date">{apk.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ---- PUSH NOTIFICATIONS ---- */}
        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            className="ad-tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ad-broadcast-card">
              <div className="ad-broadcast-header">
                <Radio size={20} className="ad-broadcast-live" />
                <div>
                  <h3>Live Broadcast</h3>
                  <p>Send a real-time notification to all active users</p>
                </div>
              </div>

              <div className="ad-broadcast-input">
                <input
                  type="text"
                  placeholder='e.g. "Live Class starting now! Join Ray Optics Lecture 07"'
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
                />
                <motion.button
                  className="ad-broadcast-btn"
                  onClick={handleBroadcast}
                  disabled={!broadcastMsg.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={18} />
                  Broadcast
                </motion.button>
              </div>
            </div>

            {/* Global Audio Controller */}
            <div className="ad-broadcast-card" style={{ marginTop: '2rem' }}>
              <div className="ad-broadcast-header">
                <Music size={20} className="text-purple-400" />
                <div>
                  <h3>Global Audio Controller</h3>
                  <p>Force play an audio track for all users</p>
                </div>
              </div>
              <div className="ad-broadcast-input">
                <input
                  type="text"
                  placeholder="Enter MP3 / Audio URL..."
                  value={useAuthStore(s => s.globalAudioUrl) || ''}
                  onChange={(e) => useAuthStore.getState().setGlobalAudio(e.target.value)}
                />
                <motion.button
                  className="ad-broadcast-btn"
                  onClick={() => useAuthStore.getState().toggleAudio()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: useAuthStore(s => s.isPlaying) ? '#ef4444' : '#8b5cf6' }}
                >
                  {useAuthStore(s => s.isPlaying) ? <Pause size={18} /> : <Play size={18} />}
                  {useAuthStore(s => s.isPlaying) ? 'Pause Audio' : 'Play Global Audio'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
