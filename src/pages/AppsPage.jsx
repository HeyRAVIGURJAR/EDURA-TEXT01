import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import './AppsPage.css';

const DEFAULT_APKS = [
  {
    id: 'apk-1',
    title: 'EDURA Mobile Companion',
    version: 'v1.0.4',
    notes: 'Initial stable release. Complete courses dashboard integration, lecture streaming support, and StudyBuddy AI doubt chatbot accessibility.',
    fileName: 'edura-companion-v104.apk',
    size: '18.4 MB'
  }
];

const AppsPage = () => {
  const [apks, setApks] = useState(DEFAULT_APKS);

  useEffect(() => {
    const cmsApks = JSON.parse(localStorage.getItem('edura_cms_apks') || '[]');
    if (cmsApks.length > 0) {
      setApks([...cmsApks, ...DEFAULT_APKS]);
    }
  }, []);

  const triggerDownload = (apk) => {
    alert(`Downloading ${apk.title} APK file (${apk.fileName})...`);
  };

  return (
    <div className="apps-page-container">
      {/* Header */}
      <motion.div 
        className="apps-header glass-panel"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="apps-header-glow" />
        <h2>Get Mobile App</h2>
        <p>Download our official Android APK to study on-the-go with seamless lectures and live alerts.</p>
      </motion.div>

      {/* APK Cards Grid */}
      <div className="apps-grid">
        {apks.map((apk) => (
          <motion.div 
            key={apk.id}
            className="apk-card glass-panel"
            whileHover={{ 
              scale: 1.02, 
              rotateX: 1, 
              rotateY: 1,
              boxShadow: "0px 15px 30px rgba(0, 191, 255, 0.2)"
            }}
          >
            <div className="apk-card-header">
              <div className="apk-icon-wrap">
                <Smartphone size={32} />
              </div>
              <div className="apk-info">
                <h4>{apk.title}</h4>
                <span className="apk-version">{apk.version}</span>
              </div>
            </div>

            <div className="apk-details">
              <div className="apk-details-title">What's New:</div>
              <p className="apk-notes">{apk.notes}</p>
              <div className="apk-meta">
                <span>File: <code>{apk.fileName}</code></span>
                {apk.size && (
                  <>
                    <span>•</span>
                    <span>Size: {apk.size}</span>
                  </>
                )}
              </div>
            </div>

            <button 
              className="apk-download-btn btn-tactile-3d"
              onClick={() => triggerDownload(apk)}
            >
              <Download size={16} />
              <span>Download APK</span>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="apps-help-info glass-panel">
        <h5><AlertCircle size={16} style={{ color: 'var(--color-primary)' }} /> How to install:</h5>
        <ol>
          <li>Click <strong>Download APK</strong> above to save the package.</li>
          <li>Open your downloads folder and tap the package to initiate installation.</li>
          <li>If prompted, enable <em>"Install from Unknown Sources"</em> in your Android settings panel.</li>
          <li>Log in using your student credentials to sync study progression.</li>
        </ol>
      </div>
    </div>
  );
};

export default AppsPage;
