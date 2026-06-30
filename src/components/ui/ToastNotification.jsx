import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Radio, Info, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import './ToastNotification.css';

const typeConfig = {
  info: { icon: Info, className: 'toast-info' },
  success: { icon: CheckCircle, className: 'toast-success' },
  warning: { icon: AlertTriangle, className: 'toast-warning' },
  error: { icon: AlertOctagon, className: 'toast-error' },
  broadcast: { icon: Radio, className: 'toast-broadcast' },
};

const ToastNotification = () => {
  const { notifications, dismissNotification } = useNotificationStore();

  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 5).map((notif) => {
          const config = typeConfig[notif.type] || typeConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={notif.id}
              className={`toast-item ${config.className}`}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              layout
            >
              <div className="toast-icon-wrapper">
                <Icon size={18} />
              </div>
              <div className="toast-content">
                {notif.type === 'broadcast' && (
                  <span className="toast-badge">LIVE BROADCAST</span>
                )}
                <p className="toast-message">{notif.message}</p>
              </div>
              <button
                className="toast-dismiss"
                onClick={() => dismissNotification(notif.id)}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
