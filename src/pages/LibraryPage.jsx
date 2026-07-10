import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lock } from 'lucide-react';
import EduraLogo from '../components/ui/EduraLogo';
import './LibraryPage.css';

const LibraryPage = () => {
  return (
    <div className="library-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', padding: '2rem' }}>
      <motion.div 
        className="library-header glass-panel"
        style={{
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center',
          padding: '3.5rem 2rem',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(135deg, rgba(15, 10, 25, 0.5) 0%, rgba(91, 86, 230, 0.03) 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glowing background bubble */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(91, 86, 230, 0.12) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(91, 86, 230, 0.1)',
          border: '1.5px solid rgba(91, 86, 230, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          boxShadow: '0 0 25px rgba(91, 86, 230, 0.25)'
        }}>
          <BookOpen size={30} className="text-[#a78bfa]" />
        </div>

        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <EduraLogo size={40} subview="LIBRARY" />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '420px', margin: '0 auto' }}>
            Aapki digitally curated study reference library holds textbook chapters, topper notes, and visual guides.
          </p>
        </div>

        <div className="glass-panel" style={{
          padding: '1.25rem 2.5rem',
          borderRadius: '16px',
          border: '1.5px dashed rgba(167, 139, 250, 0.25)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1
        }}>
          <Lock size={16} className="text-[#a78bfa] animate-pulse" />
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '2px',
            color: '#c4b5fd',
            textTransform: 'uppercase'
          }}>
            Coming Soon
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default LibraryPage;
