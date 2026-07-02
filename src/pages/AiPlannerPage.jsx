import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Lightbulb, Sparkles, ArrowLeft, CheckCircle, 
  Calendar, Award, BookOpen, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';
import './AiPlannerPage.css';

const MOCK_QUIZ_QUESTIONS = {
  physics: [
    { q: "What is the force between two charges of 1C separated by 1m in vacuum?", options: ["9 x 10^9 N", "1 N", "8.85 x 10^-12 N", "9 x 10^-9 N"], a: 0, exp: "From Coulomb\'s Law, F = (1 / 4πε₀) * (q1 * q2) / r² = 9 x 10⁹ * (1 * 1) / 1² = 9 x 10⁹ N." },
    { q: "If the electric field is zero in a region, the electric potential must be:", options: ["Zero", "Constant", "Positive", "Negative"], a: 1, exp: "Since E = -dV/dr, if E = 0, then dV/dr = 0, which means V (potential) is constant." }
  ],
  chemistry: [
    { q: "What is the IUPAC name of CH3-CH2-CH(CH3)-COOH?", options: ["2-methylbutanoic acid", "3-methylbutanoic acid", "2-methylpropanoic acid", "pentanoic acid"], a: 0, exp: "Longest carbon chain is 4 carbons (butanoic acid). Carbon 1 is the carboxylic acid carbon, so the methyl group is on Carbon 2." }
  ],
  maths: [
    { q: "The derivative of cot(x) with respect to x is:", options: ["cosec²(x)", "-cosec²(x)", "sec²(x)", "-sec²(x)"], a: 1, exp: "By standard differentiation formulas, d/dx(cot x) = -cosec²(x)." }
  ]
};

const AiPlannerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addNotification = useNotificationStore(s => s.addNotification);
  const { user, addXP } = useAuthStore();

  const getTabFromPath = (path) => {
    if (path.includes('quiz')) return 'quiz';
    if (path.includes('planner')) return 'planner';
    return 'planner';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Planner States
  const [plannerTasks, setPlannerTasks] = useState([
    { id: 't-1', text: 'Solve 10 electrostatics numericals', done: false, xp: 50 },
    { id: 't-2', text: 'Revise functional group naming priorities', done: false, xp: 40 },
    { id: 't-3', text: 'Attempt the definite integration practice test', done: false, xp: 60 }
  ]);

  const toggleTask = (id, xpReward) => {
    setPlannerTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextDone = !t.done;
        if (nextDone) {
          addXP(xpReward);
          addNotification({ message: `Task completed! +${xpReward} XP earned 🎖️`, type: 'success' });
        }
        return { ...t, done: nextDone };
      }
      return t;
    }));
  };

  // Quiz States
  const [quizTopic, setQuizTopic] = useState('physics');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeQuestions = MOCK_QUIZ_QUESTIONS[quizTopic] || [];
  const activeQ = activeQuestions[currentQIndex];

  const handleSelectQuizAns = (idx) => {
    if (quizSubmitted) return;
    setSelectedAns(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedAns === null || quizSubmitted) return;
    setQuizSubmitted(true);
    const isCorrect = selectedAns === activeQ.a;
    if (isCorrect) {
      addXP(30);
      addNotification({ message: 'Correct answer! +30 XP ⚡', type: 'success' });
    } else {
      addNotification({ message: 'Incorrect answer. Read the explanation.', type: 'warning' });
    }
  };

  const handleNextQuizQ = () => {
    setSelectedAns(null);
    setQuizSubmitted(false);
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(p => p + 1);
    } else {
      setCurrentQIndex(0);
      addNotification({ message: 'Quiz looped! Loading first question.', type: 'info' });
    }
  };

  return (
    <div className="planner-page-container">
      {/* Back Link */}
      <div className="planner-back-row">
        <button className="planner-back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div className="planner-header-row">
        <div>
          <h1 className="planner-title">
            <Sparkles className="planner-icon-spark" /> AI Study Companion Suite
          </h1>
          <p className="planner-subtitle">Use generative assistance to schedule target paths and evaluate concepts.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="planner-tabs">
        <button className={`plan-tab-btn ${activeTab === 'planner' ? 'active' : ''}`} onClick={() => setActiveTab('planner')}>
          <Calendar size={15} /> AI Planner & Goals
        </button>
        <button className={`plan-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
          <Lightbulb size={15} /> AI Custom Checkpoints
        </button>
      </div>

      <div className="planner-tab-content-wrap">
        
        {/* ---- TAB: PLANNER ---- */}
        {activeTab === 'planner' && (
          <div className="plan-pane-list">
            <div className="plan-desc-row">
              <h3>AI Daily Target Allocator</h3>
              <p>Custom daily study targets analyzed from your current batch syllabus speeds.</p>
            </div>

            <div className="plan-layout-grid">
              {/* Daily Checklist */}
              <div className="plan-checklist-card glass-panel">
                <div className="checklist-header">
                  <CheckCircle2 size={18} className="text-purple-400" />
                  <h4>Target Tasks Checklist</h4>
                </div>
                
                <div className="checklist-items">
                  {plannerTasks.map((t) => (
                    <div key={t.id} className={`task-row-item ${t.done ? 'checked' : ''}`} onClick={() => toggleTask(t.id, t.xp)}>
                      <div className="task-checkbox">
                        {t.done ? '✓' : ''}
                      </div>
                      <span className="task-text">{t.text}</span>
                      <span className="task-xp-badge">+{t.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Panel */}
              <div className="plan-progress-side-card glass-panel">
                <Award size={36} className="text-yellow-500 mb-2" />
                <h4>Aspirant Growth Score</h4>
                <p className="desc-small">Verify targets to level up. Leveling increases peer dashboard standing.</p>
                
                <div className="standing-mini-stats">
                  <div>
                    <span className="s-lbl">Your Level</span>
                    <span className="s-val text-yellow-500 font-bold">Lvl 12 Gold</span>
                  </div>
                  <div>
                    <span className="s-lbl">XP Today</span>
                    <span className="s-val text-purple-400 font-bold">
                      {plannerTasks.filter(x => x.done).reduce((acc, c) => acc + c.xp, 0)} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---- TAB: QUIZ ---- */}
        {activeTab === 'quiz' && (
          <div className="plan-pane-list">
            <div className="plan-desc-row">
              <h3>AI Concept Evaluator</h3>
              <p>Select a subject to attempt instant revision quizzes created by your AI Buddy.</p>
            </div>

            {/* Subject Selector */}
            <div className="quiz-topic-selector">
              {['physics', 'chemistry', 'maths'].map(sub => (
                <button 
                  key={sub} 
                  className={`topic-select-btn ${quizTopic === sub ? 'active' : ''}`}
                  onClick={() => {
                    setQuizTopic(sub);
                    setCurrentQIndex(0);
                    setSelectedAns(null);
                    setQuizSubmitted(false);
                  }}
                >
                  {sub.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Quiz Content Box */}
            {activeQ ? (
              <div className="ai-quiz-content-card glass-panel">
                <div className="quiz-q-header">
                  <span>Subject: {quizTopic.toUpperCase()}</span>
                  <span>Question {currentQIndex + 1}</span>
                </div>

                <div className="quiz-question-body">
                  <h3>{activeQ.q}</h3>
                  <div className="quiz-options-col">
                    {activeQ.options.map((opt, idx) => {
                      let btnClass = '';
                      if (quizSubmitted) {
                        if (idx === activeQ.a) btnClass = 'correct';
                        else if (selectedAns === idx) btnClass = 'incorrect';
                      } else if (selectedAns === idx) {
                        btnClass = 'selected';
                      }

                      return (
                        <button 
                          key={idx}
                          className={`quiz-opt-btn ${btnClass}`}
                          onClick={() => handleSelectQuizAns(idx)}
                          disabled={quizSubmitted}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanations section */}
                <AnimatePresence>
                  {quizSubmitted && (
                    <motion.div 
                      className="quiz-explanation-box"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="exp-label">💡 AI Concept Explanation:</div>
                      <p>{activeQ.exp}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="quiz-footer-actions">
                  {!quizSubmitted ? (
                    <button 
                      className="quiz-submit-btn" 
                      onClick={handleSubmitQuiz}
                      disabled={selectedAns === null}
                    >
                      Verify Answer
                    </button>
                  ) : (
                    <button 
                      className="quiz-next-btn" 
                      onClick={handleNextQuizQ}
                    >
                      Next Question <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="ai-quiz-content-card glass-panel text-center py-8">
                <BookOpen size={36} className="mx-auto text-slate-500 mb-2" />
                <p>No questions generated for this subject yet. Choose another subject above.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AiPlannerPage;
