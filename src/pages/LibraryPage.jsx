import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Download, FileText, Search, ExternalLink } from 'lucide-react';
import './LibraryPage.css';

const DEFAULT_BOOKS = [
  { id: 'book1', title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', category: 'Physics', size: '24.5 MB', downloads: '1.2K' },
  { id: 'book2', title: 'Organic Chemistry (7th Edition)', author: 'Morrison & Boyd', category: 'Chemistry', size: '38.2 MB', downloads: '950' },
  { id: 'book3', title: 'Objective Mathematics for JEE (Vol 2)', author: 'R.D. Sharma', category: 'Mathematics', size: '18.9 MB', downloads: '2.1K' },
  { id: 'book4', title: 'NCERT Exemplar Class 12 Physics', author: 'NCERT Board', category: 'Physics', size: '8.4 MB', downloads: '4.5K' },
];

const LibraryPage = () => {
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Sync with CMS batches/books uploaded by admin via localStorage
    const cmsBooks = JSON.parse(localStorage.getItem('edura_cms_books') || '[]');
    if (cmsBooks.length > 0) {
      // Map CMS books to grid format
      const formattedCms = cmsBooks.map(cb => ({
        id: cb.id,
        title: cb.title,
        author: cb.author || 'Edura Publisher',
        category: cb.category || 'General Study',
        size: cb.size || '12.0 MB',
        downloads: 'New',
        url: cb.url
      }));
      setBooks([...formattedCms, ...DEFAULT_BOOKS]);
    }
  }, []);

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
        <h2>Books & Library</h2>
        <p>Aapki digitally curated study materials aur NCERT reference library. Access standard textbooks instantly.</p>
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
              rotateX: 1, 
              rotateY: 1,
              boxShadow: "0px 10px 20px rgba(138, 43, 226, 0.15)"
            }}
          >
            <div className="book-cover-container" style={{ width: '100%', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="book-icon-wrap" style={{ margin: 0 }}>
                  <Book size={24} />
                </div>
              )}
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
            
            <button 
              className="book-action-btn"
              onClick={() => {
                if (book.url) {
                  window.open(book.url, '_blank');
                } else {
                  alert(`Downloading ${book.title}...`);
                }
              }}
            >
              <Download size={14} />
              <span>Get Book</span>
            </button>
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
    </div>
  );
};

export default LibraryPage;
