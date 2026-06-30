import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ title = "Nothing here yet", message = "Looks like there's no data to show right now.", icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center w-full h-full min-h-[300px]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="w-32 h-32 mb-6 text-purple-500/50 relative"
      >
        <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full"></div>
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 font-light max-w-md">{message}</p>
    </div>
  );
};

export default EmptyState;
