import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Gift, Copy, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const ReferralModal = ({ isOpen, onClose }) => {
  const { addXP } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const telegramLink = "https://t.me/InEducationAORAFarming";

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    // Open telegram link
    window.open(telegramLink, '_blank');
    
    // Simulate verification and reward
    if (!claimed) {
      setClaiming(true);
      setTimeout(() => {
        addXP(100);
        setClaiming(false);
        setClaimed(true);
        alert("Awesome! You earned +100 XP & 10 Coins for joining the community!");
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-md w-full relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(147,51,234,0.4)]">
                <Gift size={40} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Refer & Earn Rewards</h2>
              <p className="text-gray-400 text-sm mb-8">
                Join our official Telegram community and invite your friends. Get instant <strong className="text-purple-400">+100 XP</strong> for sharing!
              </p>

              <div className="bg-[#18181b] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 mb-6">
                <div className="truncate text-gray-300 font-mono text-sm text-left flex-1">
                  {telegramLink}
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors flex-shrink-0"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>

              <button 
                onClick={handleShare}
                disabled={claimed || claiming}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${claimed ? 'bg-green-600/20 text-green-500 border border-green-500/30' : 'bg-[#0088cc] hover:bg-[#0099e6] text-white shadow-[0_0_20px_rgba(0,136,204,0.4)] hover:shadow-[0_0_30px_rgba(0,136,204,0.6)] hover:-translate-y-1'}`}
              >
                <Send size={20} />
                {claiming ? 'Verifying...' : claimed ? 'Reward Claimed ✅' : 'Share & Join Telegram (+100 XP)'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReferralModal;
