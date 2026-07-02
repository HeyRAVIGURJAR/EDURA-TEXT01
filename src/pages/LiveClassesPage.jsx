import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, Users, MessageSquare, Send, Play, 
  Volume2, Maximize, ArrowLeft, Sparkles, Heart 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import './LiveClassesPage.css';

const MOCK_COMMENTS = [
  "Sir Coulomb\'s Law and gravitational law relative difference bataiye",
  "Amazing concept clear ho gya!",
  "Notes kahan milenge guys?",
  "Best physics teacher in India 🔥",
  "Sir board exams ke liye numerical direct aate hai kya?",
  "Lag fix ho gya guys refresh kar lo",
  "Alakh Sir op in the chat!",
  "Doubt clear section me send karo question",
  "Physics is love now ❤️"
];

const LiveClassesPage = () => {
  const navigate = useNavigate();
  const addNotification = useNotificationStore(s => s.addNotification);

  const [activeStream, setActiveStream] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatList, setChatList] = useState([
    { user: 'Aman_JEE', text: 'Good evening sir!', time: '17:30' },
    { user: 'Sonia_NEET', text: 'Ready for calculations class!', time: '17:31' }
  ]);

  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatList]);

  // Simulate scrolling live comments when stream is active
  useEffect(() => {
    let timer;
    if (activeStream) {
      timer = setInterval(() => {
        const randomUser = ['Rohan_AIR_10', 'Neha_NEET_Prep', 'Vikram_Aspirant', 'Scholars_Base'][Math.floor(Math.random() * 4)];
        const randomMsg = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
        const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        setChatList(prev => [...prev, { user: randomUser, text: randomMsg, time: timeNow }]);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [activeStream]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setChatList(prev => [...prev, { user: 'You (Scholar)', text: chatInput, time: timeNow }]);
    setChatInput('');
  };

  const activeLectures = [
    {
      id: 'live-1',
      title: 'Current Electricity 04: Kirchhoff\'s Laws & Loop Rule',
      instructor: 'Alakh Pandey Sir',
      subject: 'Physics',
      viewers: 12480,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'live-2',
      title: 'Chemical Bonding: Molecular Orbital Theory (MOT) Live',
      instructor: 'Chemistry Senior HOD',
      subject: 'Chemistry',
      viewers: 8940,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600&auto=format&fit=crop'
    }
  ];

  return (
    <div className="live-page-container">
      {/* Back Button */}
      <div className="live-back-row">
        <button className="live-back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div className="live-header-row">
        <div>
          <h1 className="live-title">
            <Radio className="live-icon-pulse" /> Live Broadcast Theater
          </h1>
          <p className="live-subtitle">Interact with instructors in real-time. Feel the energy of a live classroom.</p>
        </div>
      </div>

      {/* Streams list grid */}
      {!activeStream ? (
        <div className="live-streams-grid">
          {activeLectures.map((stream) => (
            <motion.div 
              key={stream.id} 
              className="live-stream-card glass-panel"
              whileHover={{ y: -4 }}
              onClick={() => {
                setActiveStream(stream);
                addNotification({ message: `Entering live stream: ${stream.title}`, type: 'success' });
              }}
            >
              <div className="live-card-thumb-wrap">
                <img src={stream.thumbnail} alt={stream.title} />
                <div className="live-status-pill">
                  <span className="live-dot" /> LIVE
                </div>
                <div className="viewers-count-badge">
                  <Users size={12} /> {stream.viewers.toLocaleString()} watching
                </div>
              </div>
              <div className="live-card-info">
                <span className="live-subj-badge">{stream.subject}</span>
                <h3 className="live-card-title">{stream.title}</h3>
                <p className="live-card-meta">By {stream.instructor}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Interactive Live Player and Chat Panel */
        <motion.div 
          className="live-theater-layout"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Left Column: Stream Canvas */}
          <div className="live-player-col">
            <div className="live-player-header">
              <button className="live-leave-btn" onClick={() => setActiveStream(null)}>
                <ArrowLeft size={16} /> Exit Theater
              </button>
              <div className="live-header-badge">
                <Radio size={12} className="live-badge-pulse" />
                <span>LIVE</span>
              </div>
            </div>

            <div className="live-stream-canvas">
              <video src={activeStream.videoUrl} autoPlay loop muted playsInline />
              <div className="live-canvas-hud">
                <div className="hud-left">
                  <button className="hud-icon"><Play size={16} fill="white" /></button>
                  <button className="hud-icon"><Volume2 size={16} /></button>
                  <span className="hud-live-tag">LIVE FEED</span>
                </div>
                <button className="hud-icon"><Maximize size={16} /></button>
              </div>
            </div>

            <div className="live-stream-meta">
              <h2 className="live-meta-title">{activeStream.title}</h2>
              <p className="live-meta-author">Instructing: {activeStream.instructor} | Subject: {activeStream.subject}</p>
            </div>
          </div>

          {/* Right Column: Live Chat Panel */}
          <div className="live-chat-col glass-panel">
            <div className="chat-panel-header">
              <MessageSquare size={16} className="text-purple-400" />
              <h4>Live Discussion Room</h4>
            </div>

            <div className="chat-messages-wrap">
              {chatList.map((msg, idx) => (
                <div key={idx} className="chat-msg-row">
                  <span className="chat-sender">{msg.user}</span>
                  <span className="chat-text">{msg.text}</span>
                  <span className="chat-time">{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendChat} className="chat-input-form">
              <input 
                type="text" 
                placeholder="Ask doubt or chat live..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                required
              />
              <button type="submit" className="chat-send-btn">
                <Send size={13} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LiveClassesPage;
