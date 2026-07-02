import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, Download, FileText, Search, ExternalLink, 
  ArrowLeft, ZoomIn, ZoomOut, CheckCircle, ChevronLeft, 
  ChevronRight, BrainCircuit, Sparkles, Send 
} from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { askStudyBuddy } from '../services/api';
import './LibraryPage.css';

const DEFAULT_BOOKS = [
  { id: 'book1', title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', category: 'Physics', size: '24.5 MB', downloads: '1.2K', pages: 120 },
  { id: 'book2', title: 'Organic Chemistry (7th Edition)', author: 'Morrison & Boyd', category: 'Chemistry', size: '38.2 MB', downloads: '950', pages: 154 },
  { id: 'book3', title: 'Objective Mathematics for JEE (Vol 2)', author: 'R.D. Sharma', category: 'Mathematics', size: '18.9 MB', downloads: '2.1K', pages: 210 },
  { id: 'book4', title: 'NCERT Exemplar Class 12 Physics', author: 'NCERT Board', category: 'Physics', size: '8.4 MB', downloads: '4.5K', pages: 85 },
];

const LibraryPage = () => {
  const addNotification = useNotificationStore(s => s.addNotification);
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // PDF Reader Modal States
  const [selectedBook, setSelectedBook] = useState(null);
  const [readerPage, setReaderPage] = useState(1);
  const [readerZoom, setReaderZoom] = useState(100);
  const [readerNotes, setReaderNotes] = useState('');
  
  // AI Reader assistant states
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState([
    { role: 'assistant', text: 'Hi! Ask any doubt about this page, formulas, or solved examples, and I will explain it instantly.' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const cmsBooks = JSON.parse(localStorage.getItem('edura_cms_books') || '[]');
    if (cmsBooks.length > 0) {
      const formattedCms = cmsBooks.map(cb => ({
        id: cb.id,
        title: cb.title,
        author: cb.author || 'Edura Publisher',
        category: cb.category || 'General Study',
        size: cb.size || '12.0 MB',
        downloads: 'New',
        pages: 90,
        url: cb.url
      }));
      setBooks([...formattedCms, ...DEFAULT_BOOKS]);
    }
  }, []);

  const handleDownload = (title) => {
    addNotification({ message: `Downloading ${title}... Check your browser downloads folder.`, type: 'success' });
  };

  const handleSendAiQuery = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiChat(prev => [...prev, { role: 'user', text: userText }]);
    setAiInput('');
    setAiLoading(true);

    try {
      const response = await askStudyBuddy(
        `In reference to the book "${selectedBook.title}" on page ${readerPage}, answer this query: ${userText}`
      );
      setAiChat(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (err) {
      setAiChat(prev => [...prev, { role: 'assistant', text: 'Sorry, I failed to process that request. Please try again.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="library-container">
      {/* Header section */}
      <motion.div 
        className="library-header glass-panel"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="library-header-glow" />
        <h2>Books & Library Shelf</h2>
        <p>Aapki digitally curated study materials aur NCERT reference library. Access and read standard textbooks instantly.</p>
      </motion.div>

      {/* Search toolbar */}
      <div className="library-search-bar">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Search textbooks, authors, or categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Books Grid */}
      <div className="library-grid">
        {filteredBooks.map((book) => (
          <motion.div 
            key={book.id} 
            className="book-card glass-panel"
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0px 10px 20px rgba(139, 92, 246, 0.15)"
            }}
          >
            <div className="book-cover-container">
              <div className="book-icon-wrap">
                <Book size={24} />
              </div>
            </div>
            <div className="book-info">
              <span className="book-category">{book.category}</span>
              <h4>{book.title}</h4>
              <p className="book-author">By {book.author}</p>
              <div className="book-meta">
                <span>{book.size}</span>
                <span>•</span>
                <span>{book.downloads} downloads</span>
              </div>
            </div>
            
            <div className="book-card-actions">
              <button className="book-action-btn primary" onClick={() => {
                setSelectedBook(book);
                setReaderPage(1);
                setReaderZoom(100);
                setAiChat([{ role: 'assistant', text: `Hi! Ask any doubt about page 1 of "${book.title}"!` }]);
              }}>
                Read Inside
              </button>
              <button 
                className="book-action-btn secondary"
                onClick={() => handleDownload(book.title)}
              >
                <Download size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="library-empty">
            <Book size={48} className="library-empty-icon" />
            <h3>No books found matching your search</h3>
            <p>Try searching for a different course subject or book author.</p>
          </div>
        )}
      </div>

      {/* Full screen PDF / Book Reader modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div 
            className="book-reader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="book-reader-hud">
              {/* Header Info */}
              <div className="reader-hud-left">
                <button className="reader-exit-btn" onClick={() => setSelectedBook(null)}>
                  <ArrowLeft size={16} /> Exit Shelf
                </button>
                <div className="reader-title-col">
                  <h4>{selectedBook.title}</h4>
                  <p>By {selectedBook.author} · Category: {selectedBook.category}</p>
                </div>
              </div>

              {/* Page Controls */}
              <div className="reader-hud-center">
                <button 
                  className="hud-control-btn"
                  onClick={() => setReaderPage(p => Math.max(1, p - 1))}
                  disabled={readerPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <span>Page {readerPage} of {selectedBook.pages}</span>
                <button 
                  className="hud-control-btn"
                  onClick={() => setReaderPage(p => Math.min(selectedBook.pages, p + 1))}
                  disabled={readerPage === selectedBook.pages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="reader-hud-right">
                <button className="hud-control-btn" onClick={() => setReaderZoom(z => Math.max(50, z - 10))}>
                  <ZoomOut size={14} />
                </button>
                <span>{readerZoom}%</span>
                <button className="hud-control-btn" onClick={() => setReaderZoom(z => Math.min(150, z + 10))}>
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>

            {/* Split screen content layout */}
            <div className="book-reader-split-layout">
              {/* Left Column: Interactive Page Display */}
              <div className="book-page-canvas-wrapper">
                <div 
                  className="book-page-sheet glass-panel"
                  style={{ transform: `scale(${readerZoom / 100})`, transformOrigin: 'top center' }}
                >
                  <div className="sheet-watermark">EDURA SCHOLAR PREVIEW</div>
                  <div className="sheet-text-content">
                    <h3>Chapter 1: Conceptual Summary Booklet</h3>
                    <p className="page-paragraph">
                      Let us evaluate the relative difference between Coulombs forces and Newton gravitational constants. 
                      Gravitational forces are always attractive, while electrostatic fields can be repulsive based on charge polarity.
                    </p>
                    <div className="mock-diagram-box">
                      <div className="mock-diagram-dot positive">Q+</div>
                      <div className="mock-diagram-line">F = k * q1 * q2 / r²</div>
                      <div className="mock-diagram-dot negative">Q-</div>
                    </div>
                    <p className="page-paragraph">
                      For continuous charge distributions, integrations must be calculated across lines, surfaces, and volumes 
                      using Gauss\'s Theorem to calculate direct flux parameters.
                    </p>
                  </div>
                  <div className="sheet-footer">Page {readerPage}</div>
                </div>
              </div>

              {/* Right Column: AI Reader Buddy Panel & Notepad */}
              <div className="reader-utilities-sidebar">
                {/* AI Chat Box */}
                <div className="sidebar-utility-panel glass-panel">
                  <div className="panel-header">
                    <BrainCircuit size={16} className="text-purple-400" />
                    <h4>AI Page Assistant</h4>
                  </div>
                  <div className="panel-chat-messages">
                    {aiChat.map((msg, idx) => (
                      <div key={idx} className={`sidebar-chat-msg ${msg.role}`}>
                        <div className="msg-icon"><Sparkles size={11} /></div>
                        <div className="msg-text">{msg.text}</div>
                      </div>
                    ))}
                    {aiLoading && <div className="sidebar-chat-msg assistant loading">AI is analyzing page formula...</div>}
                  </div>
                  <form className="panel-chat-input" onSubmit={handleSendAiQuery}>
                    <input 
                      type="text" 
                      placeholder="Ask doubt about this page..." 
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      required
                    />
                    <button type="submit"><Send size={12} /></button>
                  </form>
                </div>

                {/* Notepad */}
                <div className="sidebar-utility-panel glass-panel notepad">
                  <div className="panel-header">
                    <FileText size={16} className="text-cyan-400" />
                    <h4>Scratch Notes</h4>
                  </div>
                  <textarea 
                    placeholder="Write key equations and pointers while reading. Saved automatically..." 
                    value={readerNotes}
                    onChange={e => {
                      setReaderNotes(e.target.value);
                      localStorage.setItem(`edura_lib_note_${selectedBook.id}`, e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
