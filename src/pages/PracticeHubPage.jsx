import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, ClipboardList, HelpCircle, PenTool, 
  ArrowLeft, Download, Eye, Play, CheckCircle, 
  Clock, AlertCircle, ChevronRight, X 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import './PracticeHubPage.css';

const PracticeHubPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addNotification = useNotificationStore(s => s.addNotification);

  // Map route to active tab
  const getTabFromPath = (path) => {
    if (path.includes('dpp')) return 'dpp';
    if (path.includes('tests')) return 'tests';
    if (path.includes('pyqs')) return 'pyqs';
    if (path.includes('assignments')) return 'assignments';
    return 'dpp';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Mini Test Simulation States
  const [testActive, setTestActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testScore, setTestScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const MINI_TEST_QUESTIONS = [
    {
      q: "If the distance between two charges is doubled, the electrostatic force becomes:",
      options: ["Doubled", "Halved", "Four times", "One-fourth"],
      a: 3
    },
    {
      q: "Which functional group has the highest priority in IUPAC naming?",
      options: ["Aldehyde", "Ketone", "Carboxylic Acid", "Alcohol"],
      a: 2
    },
    {
      q: "The derivative of ln(sin x) with respect to x is:",
      options: ["tan x", "cot x", "sec x", "cosec x"],
      a: 1
    }
  ];

  // Timer simulation for mini test
  useEffect(() => {
    let timer;
    if (testActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (testActive && timeLeft === 0) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [testActive, timeLeft]);

  const startTest = () => {
    setTestActive(true);
    setCurrentQ(0);
    setAnswers({});
    setTestScore(null);
    setTimeLeft(60);
  };

  const handleSelectAnswer = (idx) => {
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
  };

  const finishTest = () => {
    let scoreVal = 0;
    MINI_TEST_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.a) scoreVal += 4; // +4 for correct
      else if (answers[idx] !== undefined) scoreVal -= 1; // -1 for incorrect
    });
    setTestScore(scoreVal);
    setTestActive(false);
    addNotification({
      message: `Test Completed! You scored ${scoreVal} marks.`,
      type: scoreVal > 0 ? 'success' : 'warning'
    });
  };

  const handleDownload = (title) => {
    addNotification({
      message: `Downloading ${title}... Check your browser storage.`,
      type: 'success'
    });
  };

  return (
    <div className="practice-page-container">
      {/* Back Link */}
      <div className="practice-back-row">
        <button className="practice-back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div className="practice-header-row">
        <div>
          <h1 className="practice-title">Practice & Preparation Hub</h1>
          <p className="practice-subtitle">Boost your ranks with expert materials and live mock evaluations.</p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="practice-tabs">
        <button className={`prac-tab-btn ${activeTab === 'dpp' ? 'active' : ''}`} onClick={() => setActiveTab('dpp')}>
          <HelpCircle size={15} /> DPPs
        </button>
        <button className={`prac-tab-btn ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>
          <ClipboardList size={15} /> Test Series
        </button>
        <button className={`prac-tab-btn ${activeTab === 'pyqs' ? 'active' : ''}`} onClick={() => setActiveTab('pyqs')}>
          <FileText size={15} /> PYQs
        </button>
        <button className={`prac-tab-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
          <PenTool size={15} /> Assignments
        </button>
      </div>

      {/* Tab content area */}
      <div className="practice-tab-content-wrap">
        
        {/* ---- TAB: DPPS ---- */}
        {activeTab === 'dpp' && (
          <div className="tab-pane-list">
            <div className="section-desc-row">
              <h3>Daily Practice Problems (DPP)</h3>
              <p>Daily problem sheets related to lectures to solidify conceptual calculations.</p>
            </div>

            <div className="materials-grid">
              {[1, 2, 3].map(num => (
                <div key={num} className="material-card glass-panel">
                  <div className="card-left">
                    <div className="m-icon-wrap bg-purple"><HelpCircle size={22} /></div>
                    <div className="m-details">
                      <h4>Electrostatics DPP - 0{num}</h4>
                      <p className="sub-text">10 Questions | Physics | JEE 2027</p>
                    </div>
                  </div>
                  <div className="card-right">
                    <button className="m-action-btn border" onClick={() => handleDownload(`Electrostatics DPP 0${num} Solutions`)}>
                      <Download size={14} /> Solutions
                    </button>
                    <button className="m-action-btn primary" onClick={() => handleDownload(`Electrostatics DPP 0${num} Questions`)}>
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- TAB: TEST SERIES ---- */}
        {activeTab === 'tests' && (
          <div className="tab-pane-list">
            <div className="section-desc-row">
              <h3>Live Scholars Test Series</h3>
              <p>Assess your national ranking with standard mock test questions.</p>
            </div>

            {!testActive && testScore === null && (
              <div className="test-banner-card glass-panel">
                <div className="banner-badge">RECOMMENDED</div>
                <h2>Weekly Mini Checkpoint Evaluation</h2>
                <p>3 questions on Electrostatics, IUPAC Organic rules, and Calculus differentiation. (+12 / -3 Marks)</p>
                <div className="test-meta-info">
                  <span><Clock size={13} /> 60 Seconds</span>
                  <span><AlertCircle size={13} /> 3 Questions</span>
                </div>
                <button className="start-test-btn" onClick={startTest}>
                  Attempt Test Challenge <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Live Test Window */}
            {testActive && (
              <div className="live-test-window glass-panel">
                <div className="test-window-header">
                  <span>Question {currentQ + 1} of {MINI_TEST_QUESTIONS.length}</span>
                  <span className="test-timer"><Clock size={13} /> {timeLeft}s remaining</span>
                </div>

                <div className="test-q-box">
                  <h3>{MINI_TEST_QUESTIONS[currentQ].q}</h3>
                  <div className="options-grid">
                    {MINI_TEST_QUESTIONS[currentQ].options.map((opt, oIdx) => (
                      <button 
                        key={oIdx}
                        className={`opt-btn ${answers[currentQ] === oIdx ? 'selected' : ''}`}
                        onClick={() => handleSelectAnswer(oIdx)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="test-window-footer">
                  <button 
                    className="test-footer-btn" 
                    onClick={() => setCurrentQ(p => Math.max(0, p - 1))}
                    disabled={currentQ === 0}
                  >
                    Previous
                  </button>
                  {currentQ < MINI_TEST_QUESTIONS.length - 1 ? (
                    <button 
                      className="test-footer-btn next" 
                      onClick={() => setCurrentQ(p => p + 1)}
                    >
                      Next Question
                    </button>
                  ) : (
                    <button 
                      className="test-footer-btn finish" 
                      onClick={finishTest}
                    >
                      Finish and Submit
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Test results screen */}
            {testScore !== null && (
              <div className="test-result-card glass-panel">
                <CheckCircle size={48} className="text-emerald-400 mb-4" />
                <h2>Checkpoint Score: {testScore} / 12</h2>
                <p>Correct answers: {MINI_TEST_QUESTIONS.map((q, idx) => answers[idx] === q.a ? 'Yes' : 'No').filter(x=>x==='Yes').length}</p>
                <div className="result-actions">
                  <button className="retry-btn" onClick={() => setTestScore(null)}>
                    Go Back to Series
                  </button>
                  <button className="attempt-btn" onClick={startTest}>
                    Attempt Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- TAB: PYQS ---- */}
        {activeTab === 'pyqs' && (
          <div className="tab-pane-list">
            <div className="section-desc-row">
              <h3>Previous Year Questions (PYQ)</h3>
              <p>Download official examination booklets for JEE & NEET with handwritten step answers.</p>
            </div>

            <div className="materials-grid">
              {[2025, 2024, 2023].map(year => (
                <div key={year} className="material-card glass-panel">
                  <div className="card-left">
                    <div className="m-icon-wrap bg-cyan"><FileText size={22} /></div>
                    <div className="m-details">
                      <h4>JEE Advanced Physics Paper 1 ({year})</h4>
                      <p className="sub-text">Official Paper & Solutions Booklet</p>
                    </div>
                  </div>
                  <div className="card-right">
                    <button className="m-action-btn primary" onClick={() => handleDownload(`JEE Advanced ${year} Paper 1 Solutions`)}>
                      <Download size={14} /> Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- TAB: ASSIGNMENTS ---- */}
        {activeTab === 'assignments' && (
          <div className="tab-pane-list">
            <div className="section-desc-row">
              <h3>Official Lecture Assignments</h3>
              <p>Weekly homework tasks set by class coordinators to monitor performance.</p>
            </div>

            <div className="materials-grid">
              <div className="material-card glass-panel">
                <div className="card-left">
                  <div className="m-icon-wrap bg-rose"><PenTool size={22} /></div>
                  <div className="m-details">
                    <h4>Electromagnetic Induction Practice Assignment</h4>
                    <p className="sub-text">Deadline: 2 days left | Status: Pending</p>
                  </div>
                </div>
                <div className="card-right">
                  <button className="m-action-btn primary" onClick={() => handleDownload(`Electromagnetic Induction Assignment`)}>
                    Attempt Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PracticeHubPage;
