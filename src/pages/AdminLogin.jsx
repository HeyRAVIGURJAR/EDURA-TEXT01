import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAdmin, isAuthenticated } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);
    if (success) {
      const { isAdmin: admin } = useAuthStore.getState();
      if (admin) {
        navigate('/admin-dashboard');
      } else {
        setError('Access denied. Admin credentials required.');
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
        useAuthStore.getState().logout();
      }
    } else {
      setError('Invalid credentials');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-grid-overlay" />
        <div className="admin-glow-orb orb-1" />
        <div className="admin-glow-orb orb-2" />
      </div>

      <motion.div
        className={`admin-login-card glass-panel ${shaking ? 'shake' : ''}`}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="admin-shield-icon">
          <Shield size={32} />
        </div>

        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-subtitle">Restricted area. Authorized personnel only.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <Lock size={16} className="admin-input-icon" />
            <input
              type="text"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="admin-input-group">
            <Lock size={16} className="admin-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              maxLength={20}
            />
            <button
              type="button"
              className="admin-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <motion.div
              className="admin-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <AlertTriangle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="admin-submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield size={18} />
            Authenticate
          </motion.button>
        </form>

        <div className="admin-login-footer">
          <button onClick={() => navigate('/auth')} className="admin-back-link">
            ← Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
