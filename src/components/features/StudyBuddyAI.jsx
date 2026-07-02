import React, { useState, useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { sanitizeInput } from '../../utils/sanitize';
import { askStudyBuddy } from '../../services/api';
import './StudyBuddyAI.css';

const SUGGESTIONS = [
  "Explain Newton's Laws with an example",
  "How to balance chemical equations?",
  "Tips for time management in exams",
  "Summarize the French Revolution",
];

const StudyBuddyAI = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Saarthi, your AI Doubt Solver. I can explain complex concepts, solve academic doubts, or help you plan your study schedule. What would you like to learn today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice AI. Please try using Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript, true); // true = voice mode
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (text = input, isVoice = false) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const replyText = await askStudyBuddy(text);
      setIsTyping(false);
      const botMsg = { 
        id: Date.now() + 1, 
        text: replyText, 
        sender: "bot" 
      };
      setMessages(prev => [...prev, botMsg]);
      
      // If requested via voice, speak back!
      if (isVoice && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(replyText);
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("StudyBuddy API error:", error);
      setIsTyping(false);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        sender: "bot"
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="ai-buddy-container">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-info">
          <div className="ai-avatar">
            🤖
            <div className="ai-status-dot"></div>
          </div>
          <div>
            <h2 className="ai-title">
              Saarthi AI
              <span className="ai-badge">Doubt Solver</span>
            </h2>
            <p className="ai-subtitle">Always online to help you solve doubts</p>
          </div>
        </div>
        <div className="ai-header-actions">
          <button title="Clear Chat">🗑️</button>
          <button title="Settings">⚙️</button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="ai-chat-area">
        {messages.length === 1 && (
          <div className="ai-welcome">
            <h3>How can I help you?</h3>
            <p>Select a suggestion or type your question below.</p>
            <div className="ai-suggestions">
              {SUGGESTIONS.map((suggestion, i) => (
                <button 
                  key={i} 
                  className="ai-chip"
                  onClick={() => handleSend(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`ai-message ${msg.sender}`}>
            <div className="msg-avatar">
              {msg.sender === 'bot' ? '🤖' : '👤'}
            </div>
            <div className="msg-bubble">
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="ai-message bot">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble">
              <div style={{ width: '150px', height: '4px', background: 'rgba(139,92,246,0.2)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%',
                    background: 'linear-gradient(90deg, transparent, #06B6D4, #8B5CF6, transparent)',
                    boxShadow: '0 0 10px rgba(139,92,246,0.8)'
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="ai-input-area">
        <div className="ai-input-wrapper stitch-border" style={{ '--stitch-bg': '#1e293b' }}>
          <input
            type="text"
            className="ai-input"
            placeholder="Ask StudyBuddy anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={`ai-send-btn flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`}
            onClick={input.trim() ? () => handleSend() : startListening}
            title={input.trim() ? "Send" : "Use Voice AI"}
          >
            {input.trim() ? '➤' : <Mic size={18} />}
          </button>
        </div>
        <div className="ai-footer-note">
          StudyBuddy can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
};

export default StudyBuddyAI;
