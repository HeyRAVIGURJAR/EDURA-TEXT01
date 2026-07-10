import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, BellOff, Info, CheckCircle, AlertTriangle, 
  Radio, ArrowLeft, Trash2, Send, ShieldAlert, Sparkles, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const { notifications, addNotification, dismissNotification, clearAll } = useNotificationStore();

  // Settings states
  const [pushEnabled, setPushEnabled] = useState(false);
  const [prefLectures, setPrefLectures] = useState(true);
  const [prefExams, setPrefExams] = useState(true);
  const [prefCommunity, setPrefCommunity] = useState(false);

  // Simulation delay state
  const [simulationDelay, setSimulationDelay] = useState(3); // default 3s

  // Admin Broadcast states
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState('broadcast');

  // Request browser Notification API permission
  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      addNotification({
        message: 'This browser does not support desktop push notifications.',
        type: 'error'
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setPushEnabled(true);
      addNotification({
        message: 'Push notifications enabled successfully! 🔔',
        type: 'success'
      });
    } else {
      setPushEnabled(false);
      addNotification({
        message: 'Push notification permission denied.',
        type: 'warning'
      });
    }
  };

  // Trigger simulated push notification (both browser push and local store toast)
  const triggerMockPush = (message, type = 'info', delaySeconds = simulationDelay) => {
    if (delaySeconds === 0) {
      addNotification({
        message: message,
        type: type,
        autoDismiss: type !== 'broadcast'
      });
      if ('Notification' in window && Notification.permission === 'granted') {
        new window.Notification('EDURA Push Alert', {
          body: message,
          icon: '/images/edura-logo-new.png'
        });
      }
      return;
    }

    addNotification({
      message: `Simulating push in ${delaySeconds} seconds... Keep window active.`,
      type: 'info'
    });

    setTimeout(() => {
      // 1. Dispatch local toast
      addNotification({
        message: message,
        type: type,
        autoDismiss: type !== 'broadcast'
      });

      // 2. Dispatch browser native push if supported/granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new window.Notification('EDURA Push Alert', {
          body: message,
          icon: '/images/edura-logo-new.png'
        });
      }
    }, delaySeconds * 1000);
  };

  // Trigger a sequential stagger of different alert types at spaced time intervals
  const triggerStaggeredSequence = () => {
    addNotification({
      message: "Queued Staggered Simulation: 4 alerts will arrive at intervals of 2s, 8s, 15s, and 25s!",
      type: "info"
    });

    // Alert 1: Live Class Alert in 2 seconds
    setTimeout(() => {
      addNotification({
        message: "🚨 Live Class Started: Alakh Sir is teaching 'Wave Optics 01' live now! 🎥",
        type: 'broadcast',
        autoDismiss: false
      });
    }, 2000);

    // Alert 2: Homework Assignment due in 8 seconds
    setTimeout(() => {
      addNotification({
        message: "📝 Homework Assignment: 'Electrostatics DPP-04' submission deadline is in 4 hours.",
        type: 'warning',
        autoDismiss: true
      });
    }, 8000);

    // Alert 3: Daily Reward in 15 seconds
    setTimeout(() => {
      addNotification({
        message: "🎁 Daily Streak Reward: Congratulations! You earned +15 XP for keeping your 5-day streak alive.",
        type: 'success',
        autoDismiss: true
      });
    }, 15000);

    // Alert 4: Doubt Answered in 25 seconds
    setTimeout(() => {
      addNotification({
        message: "💬 Doubt Resolved: Educator Vikram has answered your query on Organic Chemistry reaction mechanisms.",
        type: 'info',
        autoDismiss: true
      });
    }, 25000);
  };

  const handleAdminSend = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    addNotification({
      message: broadcastMsg,
      type: broadcastType,
      autoDismiss: broadcastType !== 'broadcast'
    });

    addNotification({
      message: 'Global broadcast dispatched! 🚀',
      type: 'success'
    });

    setBroadcastMsg('');
  };

  return (
    <div className="notif-page-container">
      {/* Back Button */}
      <div className="notif-back-row">
        <button className="notif-back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div className="notif-header-row">
        <div>
          <h1 className="notif-title">Push Notification Center</h1>
          <p className="notif-subtitle">Manage preferences and verify instant study alerts.</p>
        </div>
        {notifications.length > 0 && (
          <button className="notif-clear-btn" onClick={clearAll}>
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      <div className="notif-split-layout">
        {/* Left Side: Preferences / Push Simulation */}
        <div className="notif-left-side">
          {/* Subscription Box */}
          <div className="notif-card glass-panel">
            <div className="card-header">
              <Bell size={18} className="icon-purple" />
              <h3>Push Subscriptions</h3>
            </div>
            <p className="card-desc">Activate system-level push messages to receive alerts when you are offline.</p>
            
            <button 
              className={`push-toggle-btn ${pushEnabled ? 'enabled' : ''}`}
              onClick={requestPushPermission}
            >
              {pushEnabled ? <CheckCircle size={16} /> : <BellOff size={16} />}
              <span>{pushEnabled ? 'System Push Enabled' : 'Enable System Push'}</span>
            </button>

            <div className="preferences-list">
              <label className="pref-item">
                <input type="checkbox" checked={prefLectures} onChange={(e) => setPrefLectures(e.target.checked)} />
                <div className="pref-label-col">
                  <span className="pref-title">Live Lectures Start</span>
                  <span className="pref-sub">Get notified when a teacher goes live.</span>
                </div>
              </label>
              <label className="pref-item">
                <input type="checkbox" checked={prefExams} onChange={(e) => setPrefExams(e.target.checked)} />
                <div className="pref-label-col">
                  <span className="pref-title">Exam & Test Countdown</span>
                  <span className="pref-sub">Warning alerts before registered mock tests start.</span>
                </div>
              </label>
              <label className="pref-item">
                <input type="checkbox" checked={prefCommunity} onChange={(e) => setPrefCommunity(e.target.checked)} />
                <div className="pref-label-col">
                  <span className="pref-title">Community Replies</span>
                  <span className="pref-sub">Notify when someone replies to your post.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Simulated Push Triggers */}
          <div className="notif-card glass-panel animate-pulse-glow">
            <div className="card-header">
              <Sparkles size={18} className="icon-cyan" />
              <h3>Simulate Push Alerts</h3>
            </div>
            <p className="card-desc">Simulate scheduled educational notifications to verify the notification listener works.</p>
            
            {/* Custom Delay Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Choose Delivery Delay</span>
              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.05)' }}>
                {[0, 3, 10, 30].map(seconds => (
                  <button 
                    key={seconds}
                    type="button"
                    onClick={() => setSimulationDelay(seconds)}
                    style={{
                      border: 'none',
                      background: simulationDelay === seconds ? 'var(--color-primary, #5B56E6)' : 'transparent',
                      color: simulationDelay === seconds ? '#fff' : '#94a3b8',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {seconds === 0 ? 'Instant' : `${seconds}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Alert Triggers */}
            <div className="simulation-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                className="sim-btn" 
                onClick={() => triggerMockPush("🚨 Live Class Alert: Alakh Sir has started 'Ray Optics 05' live now! Join immediately.", "broadcast")}
                style={{ fontSize: '0.76rem', padding: '10px 12px' }}
              >
                🎥 Live Class Start
              </button>
              <button 
                className="sim-btn" 
                onClick={() => triggerMockPush("⏰ Homework Assignment: 'Rotational Motion DPP-02' is pending. Complete task today!", "warning")}
                style={{ fontSize: '0.76rem', padding: '10px 12px' }}
              >
                ⚠️ Pending DPP Alert
              </button>
              <button 
                className="sim-btn" 
                onClick={() => triggerMockPush("🏆 Leaderboard Climb: You climbed 4 spots today to reach Scholar Rank #12!", "success")}
                style={{ fontSize: '0.76rem', padding: '10px 12px' }}
              >
                ✨ Leaderboard Update
              </button>
              <button 
                className="sim-btn" 
                onClick={() => triggerMockPush("💬 Doubt Solved: Assistant Educator Vivek has resolved your Physics question.", "info")}
                style={{ fontSize: '0.76rem', padding: '10px 12px' }}
              >
                💬 Doubt Resolved
              </button>
            </div>

            {/* Staggered Timeline Sequence Trigger */}
            <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <button
                className="sim-btn"
                onClick={triggerStaggeredSequence}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(91, 86, 230, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                  borderColor: 'rgba(91, 86, 230, 0.3)',
                  color: '#c084fc',
                  textAlign: 'center',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px'
                }}
              >
                🚀 Trigger Staggered Sequence (2s, 8s, 15s, 25s)
              </button>
            </div>
          </div>

          {/* Admin Panel (If user is Admin) */}
          {isAdmin && (
            <div className="notif-card glass-panel admin-card">
              <div className="card-header">
                <ShieldAlert size={18} className="icon-danger" />
                <h3>Admin Global Broadcast</h3>
              </div>
              <p className="card-desc">Push a real-time message to all students logged in. Will display as high-priority alert.</p>
              
              <form onSubmit={handleAdminSend} className="admin-broadcast-form">
                <textarea 
                  value={broadcastMsg} 
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Type official notification message here..."
                  required
                />
                <div className="form-controls">
                  <select value={broadcastType} onChange={(e) => setBroadcastType(e.target.value)}>
                    <option value="broadcast">📢 Live Broadcast Banner</option>
                    <option value="info">ℹ️ Info Alert</option>
                    <option value="warning">⚠️ Warning Alert</option>
                    <option value="success">✅ Success Alert</option>
                  </select>
                  <button type="submit" className="broadcast-submit-btn">
                    <Send size={14} /> Send Broadcast
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Live Alerts List */}
        <div className="notif-right-side">
          <div className="notif-card glass-panel list-card">
            <div className="card-header">
              <Bell size={18} className="icon-purple" />
              <h3>Notification History ({notifications.length})</h3>
            </div>

            <div className="notif-list-wrap">
              <AnimatePresence mode="popLayout">
                {notifications.length > 0 ? (
                  notifications.map((notif) => {
                    return (
                      <motion.div 
                        key={notif.id}
                        className={`notif-item-row ${notif.type}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                      >
                        <div className="notif-icon-wrap">
                          {notif.type === 'error' && <ShieldAlert size={16} />}
                          {notif.type === 'warning' && <AlertTriangle size={16} />}
                          {notif.type === 'success' && <CheckCircle size={16} />}
                          {notif.type === 'info' && <Info size={16} />}
                          {notif.type === 'broadcast' && <Radio size={16} />}
                        </div>
                        <div className="notif-item-content">
                          <p>{notif.message}</p>
                          <span className="notif-time">Just now</span>
                        </div>
                        <button className="notif-dismiss" onClick={() => dismissNotification(notif.id)}>
                          <X size={12} />
                        </button>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="empty-notifications">
                    <BellOff size={32} />
                    <p>No new notifications</p>
                    <span>Important announcements and learning tasks will display here.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
