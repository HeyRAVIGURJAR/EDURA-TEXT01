import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, MapPin, Smile, 
  Layers, Palette, Shield, HelpCircle, Save, Camera, 
  CheckCircle, Play, Eye, EyeOff 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import './ProfilePage.css';

const TABS = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'packages', label: 'My Subscriptions', icon: Layers },
  { id: 'theme', label: 'Theme Settings', icon: Palette },
  { id: 'security', label: 'Privacy & Security', icon: Shield },
  { id: 'help', label: 'App Tour & Help', icon: HelpCircle },
];

const ProfilePage = () => {
  const { user } = useAuthStore();
  const addNotification = useNotificationStore(s => s.addNotification);
  
  const [activeTab, setActiveTab] = useState('personal');

  // Avatar profile picture
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem(`edura_profile_pic_${user?.id}`) || '';
  });

  // Personal Info Form State
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.username || 'Student Name',
    email: user?.email || 'student@edura.in',
    mobile: '9876543210',
    dob: '2005-08-15',
    location: 'New Delhi, India',
    gender: 'Male'
  });

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // HSL Theme Creator State
  const [hue, setHue] = useState(270); // default violet
  const [saturation, setSaturation] = useState(80);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addNotification({ message: "File size exceeds 2MB limit", type: "error" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setProfilePic(base64data);
        localStorage.setItem(`edura_profile_pic_${user?.id}`, base64data);
        if (user) user.avatar = base64data;
        addNotification({ message: "Avatar picture updated!", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    if (user) {
      user.username = personalInfo.name;
      user.email = personalInfo.email;
    }
    // Sync to userDB
    const db = JSON.parse(localStorage.getItem('edura_users_db') || '[]');
    const updated = db.map(u => u.id === user.id ? { ...u, username: personalInfo.name, email: personalInfo.email } : u);
    localStorage.setItem('edura_users_db', JSON.stringify(updated));
    addNotification({ message: "Personal details updated!", type: "success" });
  };

  const applyHSLTheme = (h, s) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', `hsl(${h}, ${s}%, 50%)`);
    root.style.setProperty('--color-primary-light', `hsl(${h}, ${s}%, 65%)`);
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${h}, ${s}%, 50%) 0%, hsl(${(h + 40) % 360}, ${s}%, 45%) 100%)`);
    root.style.setProperty('--gradient-border', `linear-gradient(135deg, hsl(${h}, ${s}%, 50%), hsl(${(h + 120) % 360}, ${s}%, 50%))`);
  };

  // Change primary color theme preset
  const selectPreset = (presetName) => {
    const root = document.documentElement;
    if (presetName === 'dark') {
      root.setAttribute('data-theme', 'dark');
      setHue(270);
      setSaturation(80);
      applyHSLTheme(270, 80);
      localStorage.setItem('edura_theme', 'dark');
      addNotification({ message: 'Preset: Dark Mode applied!', type: 'info' });
    } else if (presetName === 'light') {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('edura_theme', 'light');
      addNotification({ message: 'Preset: Light Mode applied!', type: 'info' });
    } else if (presetName === 'cyberpunk') {
      root.setAttribute('data-theme', 'dark');
      setHue(320); // Neon pink/cyan HSL values
      setSaturation(95);
      applyHSLTheme(320, 95);
      localStorage.setItem('edura_theme', 'dark');
      addNotification({ message: 'Preset: Cyberpunk Neon applied!', type: 'info' });
    }
  };

  useEffect(() => {
    applyHSLTheme(hue, saturation);
  }, [hue, saturation]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addNotification({ message: "Passwords do not match", type: "error" });
      return;
    }
    addNotification({ message: "Password updated successfully!", type: "success" });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="pw-settings-container">
      {/* Top Banner */}
      <div className="pw-settings-header glass-panel">
        <div className="settings-header-glow" />
        <h2>Account Settings & Profile</h2>
        <p>Manage your batches, customize HSL theme accents, and update secure credentials.</p>
      </div>

      <div className="pw-settings-split-layout">
        {/* Left Side Menu */}
        <div className="pw-settings-nav-sidebar glass-panel">
          <div className="settings-user-card-header">
            <div className="settings-avatar-container">
              {profilePic ? (
                <img src={profilePic} alt="Avatar" className="settings-avatar-img" />
              ) : (
                <div className="settings-avatar-fallback">{personalInfo.name.charAt(0).toUpperCase()}</div>
              )}
              <label className="settings-avatar-camera-btn">
                <Camera size={12} />
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <h4>{personalInfo.name}</h4>
            <span>JEE Scholar</span>
          </div>

          <div className="pw-settings-menu-list">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`pw-settings-menu-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div className="pw-settings-menu-active-bg" layoutId="activeSettingsTabPill" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Content Panel */}
        <div className="pw-settings-content-card glass-panel">
          <AnimatePresence mode="wait">
            {activeTab === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="settings-sub-panel"
              >
                <h3>Personal Information</h3>
                <form onSubmit={handleSavePersonal} className="pw-settings-form">
                  <div className="settings-form-grid">
                    <div className="pw-form-group-large">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={personalInfo.name} 
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                        required
                        className="pw-form-input"
                      />
                    </div>
                    <div className="pw-form-group-large">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={personalInfo.email} 
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        required
                        className="pw-form-input"
                      />
                    </div>
                    <div className="pw-form-group-large">
                      <label>Mobile Number</label>
                      <input 
                        type="tel" 
                        value={personalInfo.mobile} 
                        onChange={(e) => setPersonalInfo({ ...personalInfo, mobile: e.target.value })}
                        required
                        className="pw-form-input"
                      />
                    </div>
                    <div className="pw-form-group-large">
                      <label>Date of Birth</label>
                      <input 
                        type="date" 
                        value={personalInfo.dob} 
                        onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                        required
                        className="pw-form-input"
                      />
                    </div>
                    <div className="pw-form-group-large">
                      <label>State / City</label>
                      <input 
                        type="text" 
                        value={personalInfo.location} 
                        onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                        required
                        className="pw-form-input"
                      />
                    </div>
                    <div className="pw-form-group-large">
                      <label>Gender</label>
                      <select 
                        value={personalInfo.gender} 
                        onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                        className="pw-form-input"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="pw-settings-save-btn">
                    <Save size={16} />
                    <span>Save Information</span>
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'packages' && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="settings-sub-panel"
              >
                <h3>My Packages & Subscriptions</h3>
                
                <div className="pw-subscriptions-list">
                  <div className="pw-sub-header-title">Active Batches</div>
                  <div className="pw-sub-card active">
                    <div className="pw-sub-card-header">
                      <h5>Lakshya JEE 2026 Batch (Hinglish)</h5>
                      <span className="pw-status-pill active">Active</span>
                    </div>
                    <p>Access ends on: 15 Jun 2027</p>
                  </div>

                  <div className="pw-sub-header-title expired">Expired Batches</div>
                  <div className="pw-sub-card expired">
                    <div className="pw-sub-card-header">
                      <h5>Bridge Course Mathematics Foundations 2025</h5>
                      <span className="pw-status-pill expired">Expired</span>
                    </div>
                    <p>Access expired on: 15 May 2025</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="settings-sub-panel"
              >
                <h3>Theme Settings & HSL Creator</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Choose a preset or customize hue and saturation coordinates dynamically.
                </p>

                {/* Presets Grid */}
                <div className="theme-presets-grid">
                  <button className="preset-card dark-mode-preset" onClick={() => selectPreset('dark')}>
                    <strong>Dark Mode</strong>
                    <span>Deep Cinematic</span>
                  </button>
                  <button className="preset-card light-mode-preset" onClick={() => selectPreset('light')}>
                    <strong>Light Mode</strong>
                    <span>Daylight Clean</span>
                  </button>
                  <button className="preset-card cyberpunk-preset" onClick={() => selectPreset('cyberpunk')}>
                    <strong>Cyberpunk Neon</strong>
                    <span>Violet & Cyan</span>
                  </button>
                </div>

                {/* Custom HSL Sliders */}
                <div className="hsl-customizer-box glass-panel">
                  <h5>HSL Primary Color Accents</h5>
                  
                  <div className="hsl-slider-row">
                    <div className="hsl-label-row">
                      <span>Hue (Color Spectrum)</span>
                      <strong>{hue}°</strong>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="360" 
                      value={hue}
                      onChange={(e) => setHue(parseInt(e.target.value))}
                      className="hsl-range-slider"
                    />
                  </div>

                  <div className="hsl-slider-row">
                    <div className="hsl-label-row">
                      <span>Saturation (Intensity)</span>
                      <strong>{saturation}%</strong>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="hsl-range-slider"
                    />
                  </div>

                  <div className="hsl-preview-dot-row">
                    <span>Accent Preview:</span>
                    <div 
                      className="hsl-preview-dot"
                      style={{ background: `hsl(${hue}, ${saturation}%, 50%)` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="settings-sub-panel"
              >
                <h3>Privacy & Security</h3>
                <form onSubmit={handlePasswordChange} className="pw-settings-form">
                  <div className="pw-form-group-large password-group">
                    <label>Current Password</label>
                    <div className="password-input-wrapper">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                        maxLength={20}
                        className="pw-form-input"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="pwd-toggle-btn"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="pw-form-group-large password-group">
                    <label>New Password (Max 20 chars)</label>
                    <div className="password-input-wrapper">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        maxLength={20}
                        className="pw-form-input"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="pw-form-group-large password-group">
                    <label>Confirm New Password</label>
                    <div className="password-input-wrapper">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        maxLength={20}
                        className="pw-form-input"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button type="submit" className="pw-settings-save-btn">
                    <Shield size={16} />
                    <span>Change Credentials</span>
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="settings-sub-panel"
              >
                <h3>App Tour & Help Guide</h3>
                
                <div className="help-guide-list">
                  <div className="help-item glass-panel">
                    <h5>🎬 Getting Started with Lectures</h5>
                    <p>Go to your enrolled batches inside "Batches", select a lecture block, and play the media stream directly inside your dashboard browser window.</p>
                  </div>
                  <div className="help-item glass-panel">
                    <h5>💡 Doubts Assistant chatbot</h5>
                    <p>Click the support bot at the bottom right to quickly trigger tickets to counsel admins or join the Telegram broadcast feed.</p>
                  </div>
                  <div className="help-item glass-panel">
                    <h5>🤖 StudyBuddy AI doubts resolver</h5>
                    <p>Use the large AI prompt bar centered at the top of the dashboard page to get immediate, step-by-step explanations of physics laws or reactions.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
