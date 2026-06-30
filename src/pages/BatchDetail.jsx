import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, FileText, Download, ArrowLeft, Video, 
  BookOpen, HelpCircle, Lock, Star, Clock 
} from 'lucide-react';
import { fetchBatchDetails, fetchBatches } from '../services/api';
import EduraPreloader from '../components/ui/EduraPreloader';
import Flashcard from '../components/features/Flashcard';
import PdfViewer from '../components/features/PdfViewer';
import './BatchDetail.css';

const TABS = [
  { id: 'lectures', label: 'Video Lectures', icon: Video },
  { id: 'dpp', label: 'DPP (Practice Papers)', icon: HelpCircle },
  { id: 'notes', label: 'Class Notes', icon: FileText },
];

const LECTURES = [
  { id: 'vid1', title: 'Electrostatics 01 : Introduction & Coulomb\'s Law', duration: '1h 45m', tutor: 'Alakh Sir', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'vid2', title: 'Electrostatics 02 : Electric Field & Dipole Moment', duration: '2h 10m', tutor: 'Alakh Sir', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'vid3', title: 'Electrostatics 03 : Gauss\'s Law & Flux Applications', duration: '1h 55m', tutor: 'Alakh Sir', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'vid4', title: 'Electrostatics 04 : Electric Potential & Capacitors', duration: '2h 15m', tutor: 'Alakh Sir', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

const BatchDetail = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePdf, setActivePdf] = useState(null);
  const [activeTab, setActiveTab] = useState('lectures');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      // Fetch details from local list or API
      const batches = await fetchBatches();
      const matched = batches.find(b => b._id === batchId);
      
      if (matched) {
        setBatch(matched);
      } else {
        // Mock fallback if specific details API fails or item not found
        setBatch({
          _id: batchId,
          name: "Lakshya JEE/NEET 2026 Batch",
          byName: "By India's Top Educators",
          previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        });
      }
      setLoading(false);
    };
    loadDetails();
  }, [batchId]);

  // Handle query parameter play auto-select
  useEffect(() => {
    if (batch && !loading) {
      const queryParams = new URLSearchParams(window.location.search);
      const playId = queryParams.get('play');
      if (playId) {
        const foundLec = LECTURES.find(l => l.id === playId);
        if (foundLec) {
          setSelectedVideo(foundLec);
        }
      }
    }
  }, [batch, loading]);

  // Wrapper for selecting a video that persists to localStorage
  const handleSelectVideo = (lec) => {
    setSelectedVideo(lec);
    if (lec) {
      localStorage.setItem('edura_last_lecture', JSON.stringify({
        id: lec.id,
        title: lec.title,
        duration: lec.duration,
        tutor: lec.tutor,
        batchId: batchId,
        batchName: batch?.name || 'Lakshya JEE/NEET 2026 Batch'
      }));
    }
  };

  if (loading) {
    return <EduraPreloader message="Opening classroom..." />;
  }

  const dpps = [
    { id: 'dpp1', title: 'DPP 01 : Electrostatics Fundamentals MCQ', questions: '15 Questions', status: 'Download PDF' },
    { id: 'dpp2', title: 'DPP 02 : Coulomb\'s Law Numerical Practice', questions: '10 Questions', status: 'Download PDF' },
    { id: 'dpp3', title: 'DPP 03 : Gauss Law and Flux advanced level', questions: '20 Questions', status: 'Download PDF' },
  ];

  const notes = [
    { id: 'note1', title: 'Class Notes - Electrostatics Lecture 01 (Handwritten)', size: '4.8 MB', pages: '12 Pages' },
    { id: 'note2', title: 'Class Notes - Electrostatics Lecture 02 (Handwritten)', size: '5.2 MB', pages: '15 Pages' },
    { id: 'note3', title: 'Formula Cheat-Sheet : Coulomb\'s law and Fields', size: '2.1 MB', pages: '4 Pages' },
  ];

  return (
    <div className="batch-detail-container">
      {/* Top Navigation Row */}
      <div className="bd-back-row">
        <button className="bd-back-btn" onClick={() => navigate('/dashboard/batches')}>
          <ArrowLeft size={16} />
          Back to Batches
        </button>
      </div>

      {/* Hero Banner Header */}
      <div className="bd-hero glass-panel">
        <div className="bd-hero-glow" />
        <div className="bd-hero-content">
          <span className="bd-tag-hinglish">Hinglish</span>
          <h1 className="bd-name">{batch?.name || "Lakshya Classroom"}</h1>
          <p className="bd-instructor">{batch?.byName || "By Top Educators"}</p>
        </div>
      </div>

      {/* Video Player Display */}
      {selectedVideo && (
        <motion.div 
          className="bd-player-section glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bd-player-header">
            <h4>Now Playing: {selectedVideo.title}</h4>
            <button className="bd-close-player" onClick={() => setSelectedVideo(null)}>✕ Close Player</button>
          </div>
          <div className="bd-video-frame-wrap">
            <video controls autoPlay className="bd-video-element" src={selectedVideo.url} />
          </div>
        </motion.div>
      )}

      {/* Sliding Navigation Tabs */}
      <div className="bd-tabs-bar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`bd-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div className="bd-tab-pill-bg" layoutId="bdTabIndicator" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bd-tab-content-area">
        <AnimatePresence mode="wait">
          {activeTab === 'lectures' && (
            <motion.div 
              key="lectures-tab"
              className="bd-lectures-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {LECTURES.map((lec) => (
                <motion.div 
                  key={lec.id} 
                  className="bd-lecture-card glass-panel"
                  whileHover={{ scale: 1.01, rotateX: 1, rotateY: 1 }}
                >
                  <div className="bd-lecture-icon-wrap">
                    <Play size={20} fill="var(--color-primary)" />
                  </div>
                  <div className="bd-lecture-info">
                    <h5>{lec.title}</h5>
                    <div className="bd-lecture-meta">
                      <span><Clock size={12} /> {lec.duration}</span>
                      <span>By {lec.tutor}</span>
                    </div>
                  </div>
                  <button className="bd-watch-btn" onClick={() => handleSelectVideo(lec)}>
                    Play Video
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'dpp' && (
            <motion.div 
              key="dpp-tab"
              className="bd-dpps-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {dpps.map((dpp) => (
                <div key={dpp.id} className="bd-resource-row glass-panel">
                  <div className="bd-resource-info">
                    <HelpCircle size={18} className="bd-icon-purple" />
                    <div>
                      <h6>{dpp.title}</h6>
                      <span>{dpp.questions}</span>
                    </div>
                  </div>
                  <button 
                    className="bd-download-btn"
                    onClick={() => alert(`Downloading Practice Sheet ${dpp.title}`)}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div 
              key="notes-tab"
              className="bd-notes-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {notes.map((note) => (
                <div key={note.id} className="bd-resource-row glass-panel">
                  <div className="bd-resource-info">
                    <FileText size={18} className="bd-icon-blue" />
                    <div>
                      <h6>{note.title}</h6>
                      <span>{note.pages} | {note.size}</span>
                    </div>
                  </div>
                  <button 
                    className="bd-download-btn bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30"
                    onClick={() => setActivePdf(note)}
                  >
                    <FileText size={14} />
                    <span>Read Now</span>
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- QUICK REVISION FLASHCARDS --- */}
      <div className="mt-12 bg-black/40 border border-white/5 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">⚡</span>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Quick Revision (Active Recall)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Flashcard 
            question="What is the formula for the Time of Flight in Projectile Motion?" 
            answer="T = (2u sin θ) / g" 
            category="Physics" 
          />
          <Flashcard 
            question="What happens to the focal length of a convex lens when immersed in water?" 
            answer="It increases, because the relative refractive index decreases." 
            category="Physics" 
          />
          <Flashcard 
            question="Define Faraday's Law of Electromagnetic Induction." 
            answer="The induced electromotive force in any closed circuit is equal to the negative of the time rate of change of the magnetic flux enclosed by the circuit." 
            category="Physics" 
          />
        </div>
      </div>

      {activePdf && (
        <PdfViewer 
          title={activePdf.title} 
          fileUrl={activePdf.url} 
          onClose={() => setActivePdf(null)} 
        />
      )}
    </div>
  );
};

export default BatchDetail;
