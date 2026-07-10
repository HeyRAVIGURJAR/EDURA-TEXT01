import React from 'react';
import { ArrowLeft, Film, Sparkles, Tv, Clapperboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EduraLogo from '../components/ui/EduraLogo';
import './OttPage.css';

const OttPage = () => {
  const navigate = useNavigate();

  return (
    <div className="ott-page-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '2rem',
      textAlign: 'center',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(91, 86, 230, 0.15) 0%, transparent 70%)',
        zIndex: 0,
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', width: '100%' }}>
        {/* Back Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '8px 18px',
              borderRadius: '20px',
              color: '#a78bfa',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(91, 86, 230, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(91, 86, 230, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Cinematic Icon Card */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(91, 86, 230, 0.15), rgba(6, 182, 212, 0.15))',
          border: '1.5px solid rgba(91, 86, 230, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2.5rem auto',
          color: '#a78bfa',
          boxShadow: '0 10px 30px -10px rgba(91, 86, 230, 0.4)',
          position: 'relative'
        }}>
          <Clapperboard size={38} className="animate-pulse" />
        </div>

        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <EduraLogo size={42} subview="OTT" />
        </div>

        {/* COMING SOON Badge with Glow */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '6px 16px',
          borderRadius: '20px',
          color: '#f59e0b',
          fontSize: '0.95rem',
          fontWeight: '800',
          letterSpacing: '0.05em',
          marginBottom: '2rem',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
        }}>
          <Sparkles size={16} />
          COMING SOON
          <Sparkles size={16} />
        </div>

        {/* Description */}
        <p style={{
          color: '#94a3b8',
          fontSize: '1rem',
          lineHeight: '1.7',
          maxWidth: '480px',
          margin: '0 auto',
          fontWeight: '500'
        }}>
          We are craftfully designing a next-generation cinematic streaming platform for educational masterclasses, detailed mock analysis, and conceptual interactive courses.
        </p>
      </div>
    </div>
  );
};

export default OttPage;
